const fs               = require('fs');
const path             = require('path');
const express          = require('express');
const bodyParser       = require('body-parser');
const { createServer } = require('http');
const io               = require('socket.io');
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

app.use(express.static(path.join(__dirname, 'artefacts')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'artefacts', 'index.html')));
app.get('*', (req, res) => res.redirect('/'));

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

      if (!fs.existsSync(dirName)){
        const dirPath = dirName

        try {
          fs.mkdirSync(dirPath);
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

      if (!fs.existsSync(dirName)){
        const dirPath = dirName

        try {
          fs.writeFileSync(dirPath, '// Add code here.', {
            encoding: 'utf8',
            mode: 0o755
          });
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

  client.on('renderFile', data => {
    const fileContent = fs.readFileSync(data.fileName, 'utf8')

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

    const fileContent = fs.readFileSync(file, 'utf8')
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

