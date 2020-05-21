const fs                   = require('fs');
const path                 = require('path');
const express              = require('express');
const bodyParser           = require('body-parser');
const { createServer }     = require('http');
const io                   = require('socket.io');
const {
  formatInputQuery,
  readFileFromProject,
 findSimilaritiesInLists
} = require('./utils/utils');
const {
  findFile,
  findDirectory
} = require('./utils/listFiles')

// Add experimental imports here
const chalk = require('chalk');
const babelParser = require('@babel/parser');
const clipboardy = require('clipboardy')
//

const ctx = new chalk.Instance({level: 3});

const app      = express();
const server   = createServer(app)
const ioServer = io(server)
const port     = 9000;
const ioPort   = 8000;
const projPath = path.join(__dirname, '../../test')

const {
  makeDir,
  makeFile,
  readFile,
  ifFileExists
} = readFileFromProject(projPath, path)


app.use(express.static(path.join(__dirname, 'artefacts')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'artefacts', 'index.html')));
app.get('*', (req, res) => res.redirect('/'));

function addFileImportCode(importCode, data) {
  const { file, name } = data
  const fileContent = readFile(file)
  const fileContentByLine = fileContent.split(/\r?\n/)

  const newContent = [importCode, ...fileContentByLine]

  ioServer.emit('addNewVariable', {
    name,
    file,
    fileContent : newContent.join('\n')
  })
}

function handleLibraryImport({
  data,
  operationOn,
  formattedNames
}) {
  const { name, file } = data
  const { dependencies, devDependencies } = JSON.parse(readFile('package.json'))

  const dependenciesList = [...Object.keys(dependencies), ...Object.keys(devDependencies)]
  const filteredList = findSimilaritiesInLists({
    target : dependenciesList,
    input  : formattedNames
  })

  if (filteredList.length === 1) {
    const importContent = `import {} from '${filteredList[0]}'\r`

    addFileImportCode(importContent, data)
  } else {
    ioServer.emit('import operation', {
      operationOn,
      query       : data,
      suggestions : filteredList,
      operation   : 'show suggestions'
    })
  }
}

async function handleFileImport({
  data,
  operationOn,
  formattedNames,
  filteredList : defaultFilteredList
}) {
  const { name, file } = data
  const fileDirName = path.dirname(file)
  const filteredList = defaultFilteredList || await findFile(projPath, formattedNames)

  console.log('*******************')
  console.log(filteredList)
  console.log(defaultFilteredList)
  console.log('*******************')

  if (filteredList.length === 1) {
    const relativePath = path.relative(fileDirName, filteredList[0]);
    const { dir, name, ext } = path.parse(relativePath)
    let importRightPart = ''

    if (ext === '.js') {
      importRightPart = `${dir}/${name}`
    } else {
      importRightPart = relativePath
    }

    const importContent = `import {} from '${importRightPart}'`
    addFileImportCode(importContent, data)
  } else {
    ioServer.emit('import operation', {
      operationOn,
      query       : data,
      suggestions : filteredList,
      operation   : 'show suggestions'
    })
  }
}

ioServer.on('connection', client => {
  client.on('event', data => {
    console.log(data)
  });

  client.on('openFile', async data => {
    console.log('*****************************')
    console.log(data.file)
    console.log('*****************************')

    const filteredFiles = await findFile(projPath, data.file)

    ioServer.emit('openFile', { filteredFiles, file : data.file.join(' ') })
  });

  client.on('make directory', async ({ path, operation, dirName }) => {
    if (operation === 'list directory') {
      const filteredDirs = await findDirectory(projPath, path)

      ioServer.emit('list directory', {
        filteredDirs,
        listFor : 'directory',
        file : path.join(' ')
      })
    } else if (operation === 'create directory') {
      let exceptions

      if (!ifFileExists(dirName)){
        console.log('*******************')
        console.log(dirName)
        console.log('*******************')

        const dirPath = dirName

        try {
          makeDir(dirPath);
        } catch(error) {
          exceptions = error
        }
      } else {
        exceptions = 'Directory already exists.'
      }

      ioServer.emit('create directory status', {
        dirName,
        exceptions,
        listFor : 'directory'
      })
    }
  })

  client.on('make file', async ({ path, operation, dirName }) => {
    if (operation === 'list directory') {
      const filteredDirs = await findDirectory(projPath, path)

      ioServer.emit('list directory', {
        filteredDirs,
        listFor : 'file',
        file : path.join(' ')
      })
    } else if (operation === 'create file') {
      let exceptions

      if (!ifFileExists(dirName)){
        const dirPath = dirName

        try {
          makeFile(dirPath, '// Add code here.');
        } catch(error) {
          exceptions = error
        }
      } else {
        exceptions = 'Directory already exists.'
      }

      ioServer.emit('create directory status', {
        dirName,
        exceptions,
        listFor : 'file'
      })
    }
  })

  client.on('import operation', async (data) => {
    const { operation, name, file } = data
    const formattedNames = formatInputQuery(name)
    let operationOn = ''

    if (operation === 'library import') {
      operationOn = 'library'

      handleLibraryImport({
        data,
        operationOn,
        formattedNames
      })
    } else if( operation === 'file import' ) {
      operationOn = 'file'

      handleFileImport({
        data,
        operationOn,
        formattedNames
      })
    } else if (operation === 'library import confirmation') {
      const importContent = `import {} from '${data.imortItem}'\r`
      const fileContent = readFile(file)
      const fileContentByLine = fileContent.split(/\r?\n/)

      const newContent = [importContent, ...fileContentByLine]

      ioServer.emit('addNewVariable', {
        name,
        file,
        fileContent : newContent.join('\n')
      })
    } else if (operation === 'file import confirmation') {
      handleFileImport({
        data,
        operationOn,
        formattedNames,
        filteredList : [data.imortItem]
      })
    }
  })

  client.on('renderFile', data => {
    const fileContent = readFile(data.fileName)

    ioServer.emit('renderFile', { fileContent, ...data })
  })

  client.on('addNewItem', data => {
    const {
      line,
      type,
      name,
      file
    } = data
    const parsedLine = parseInt(line) - 1

    const fileContent = readFile(file)
    const fileContentByLine = fileContent.split(/\r?\n/)
    // const firstPart = fileContentByLine.slice(0, parsedLine)
    // const lastPart = fileContentByLine.slice(parsedLine)
    // const newPart = `const ${name} = 23`

    const todoColor = ctx.rgb(238, 158, 47);
    const todoColorBold = ctx.rgb(238, 158, 47);

    console.log(todoColor('---------------------------------------------'));
    console.log(todoColorBold('Todos:'));
    console.log(todoColor('- Convert to AST'));
    console.log(todoColor('- Categorize by type'));
    console.log(todoColor('- Add variable at (line)'));
    console.log(todoColor('- Validate the code'));
    console.log(todoColor('- Fix the fixable'));
    console.log(todoColor('- Send not fixable errors to develper'));
    console.log(todoColor('------------------------------------------'));

    const fileAst = babelParser.parse(fileContent, {
      sourceType : 'module',
      errorRecovery : true,
      plugins : ['babel-eslint', 'jsx']
    });

    clipboardy.writeSync(JSON.stringify(fileAst.program.body))
    console.log(ctx.magentaBright('+++++++++++++++++++++++++++++++'))
    console.log('Copied the AST to clipboard.')
    // console.log(babelParser.parse(fileContent, {
    //   sourceType : 'module',
    //   errorRecovery : true,
    //   plugins : ['babel-eslint',]
    // }))
    console.log(ctx.magentaBright('+++++++++++++++++++++++++++++++'))

    // console.log('-----------------------------')
    // console.log(parsedLine)
    // console.log(fileContentByLine[parsedLine])
    // console.log('-----------------------------')

    // ioServer.emit('addNewVariable', {
    //   ...data,
    //   fileContent : [
    //     ...firstPart,
    //     newPart,
    //     ...lastPart
    //   ].join('\n')
    // })
  })

  client.on('disconnect', client => {
    console.log('Connection closed!')
  });
});

const serveRef = app.listen(port, () => console.log(`Listening on ${port}!`));
// ioServer.listen(ioPort, () => console.log(`IO is listening on ${ioPort}!`));
ioServer.listen(serveRef);


