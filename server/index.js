const fs               = require('fs')
const path             = require('path')
const express          = require('express')
const { createServer } = require('http')
const https            = require('https')
const io               = require('socket.io')

const { format }        = require('./utils/fileFormatter')
const { getNewContent } = require('./utils/getNewContent')
const {
  formatInputQuery,
  readFileFromProject,
  findSimilaritiesInLists
} = require('./utils/utils')
const {
  findFile,
  findDirectory
} = require('./utils/listFiles')

const {
  setProjectPath
} = require('./configs/variablesSetter')

setProjectPath('../../git-war-demo')

// Add experimental imports here
const chalk       = require('chalk')
const babelParser = require('@babel/parser')
const clipboardy  = require('clipboardy')
//

// Certificates
const key = fs.readFileSync('./certs/key.pem', 'utf8')
const cert = fs.readFileSync('./certs/cert.pem', 'utf8')

const app             = express()
const server          = createServer(app)
const httpsServer     = https.createServer({ key, cert }, app)
const ioServer        = io(server)
const port            = 9000
const httpsServerPort = 9001
const { projPath }    = global

const {
  makeDir,
  makeFile,
  readFile,
  ifFileExists
} = readFileFromProject(projPath, path)


app.use(express.static(path.join(__dirname, 'artefacts')))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'artefacts', 'index.html')))
app.get('*', (req, res) => res.redirect('/'))

function validateAndSaveFileContent({ content, file, data = {} }) {
  const {
    content : formattedContent,
    errors,
    meta
  } = format({ content })

  if (formattedContent) {
    makeFile(file, formattedContent)
  }

  ioServer.emit('add new content', {
    ...data,
    fileContent : formattedContent || content
  })

  const { errorCount, warningCount } = meta

  if (errorCount || warningCount) {
    console.log(chalk.red('*******************'))
    console.log(errors)
    console.log(chalk.red('*******************'))

    ioServer.emit('show context', {
      type : 'lint errors',
      data : {
        meta,
        errors
      }
    })
  }
}

function addFileImportCode(importCode, data) {
  const { file } = data
  const fileContent = readFile(file)
  const fileContentByLine = fileContent.split(/\r?\n/)

  const newContent = [importCode, ...fileContentByLine]

  validateAndSaveFileContent({
    file,
    data,
    content : newContent.join('\n')
  })
}

function handleLibraryImport({
  data,
  operationOn,
  formattedNames
}) {
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
  const { file } = data
  const fileDirName = path.dirname(file)
  const filteredList = defaultFilteredList || await findFile(projPath, formattedNames)

  console.log('*******************')
  console.log(filteredList)
  console.log(defaultFilteredList)
  console.log('*******************')

  if (filteredList.length === 1) {
    const relativePath = path.relative(fileDirName, filteredList[0])
    const {
      dir,
      name,
      ext
    } = path.parse(relativePath)

    let importRightPart = relativePath

    if (ext === '.js') {
      importRightPart = `${dir}/${name}`
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

ioServer.on('connection', (client) => {
  client.on('event', (data) => {
    console.log(data)
  })

  client.on('openFile', async (data) => {
    console.log('*****************************')
    console.log(data.file)
    console.log('*****************************')

    const filteredFiles = await findFile(projPath, data.file)

    ioServer.emit('openFile', { filteredFiles, file : data.file.join(' ') })
  })

  client.on('make directory', async ({ path : filePath, operation, dirName }) => {
    console.log('*******************')
    console.log(filePath)
    console.log('*******************')

    if (operation === 'list directory') {
      const filteredDirs = await findDirectory(projPath, filePath)

      ioServer.emit('list directory', {
        filteredDirs,
        listFor : 'directory',
        file    : filePath.join(' ')
      })
    } else if (operation === 'create directory') {
      let exceptions

      if (!ifFileExists(dirName)) {
        console.log('*******************')
        console.log(dirName)
        console.log('*******************')

        const dirPath = dirName

        try {
          makeDir(dirPath)
        } catch (error) {
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

  client.on('make file', async ({ path : filePath, operation, dirName }) => {
    if (operation === 'list directory') {
      const filteredDirs = await findDirectory(projPath, filePath)

      ioServer.emit('list directory', {
        filteredDirs,
        listFor : 'file',
        file    : filePath.join(' ')
      })
    } else if (operation === 'create file') {
      let exceptions

      if (!ifFileExists(dirName)) {
        const dirPath = dirName

        try {
          makeFile(dirPath, '// Add code here.')
        } catch (error) {
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
    } else if (operation === 'file import') {
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

      validateAndSaveFileContent({
        data,
        file,
        content : newContent.join('\n')
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

  client.on('renderFile', (data) => {
    const fileContent = readFile(data.fileName)

    ioServer.emit('renderFile', { fileContent, ...data })
  })

  client.on('addNewItem', (data) => {
    let newContent

    const {
      line,
      type,
      file,
      changeType = 'line'
    } = data

    const normalizedLineNumber = parseInt(line, 10) - 1
    const fileContent          = readFile(file)
    const fileContentByLine    = fileContent.split(/\r?\n/)
    const newPart              = getNewContent({ type })

    console.log('*******************')
    console.log(newPart)
    console.log('*******************')

    if (changeType === 'line') {
      const firstPart = fileContentByLine.slice(0, normalizedLineNumber)
      const lastPart  = fileContentByLine.slice(normalizedLineNumber)

      newContent = [...firstPart, ...newPart, ...lastPart].join('\n')
    } else if (changeType === 'file') {
      newContent = newPart
    }

    validateAndSaveFileContent({
      data,
      file,
      content : newContent
    })
  })

  client.on('save content', ({ file, content }) => {
    validateAndSaveFileContent({
      file,
      content
    })

    // if (formattedContent) {
    //   makeFile(file, formattedContent)
    // }
  })

  client.on('disconnect', () => console.log('Connection closed!'))
})

const serveRef       = app.listen(port, '0.0.0.0', () => console.log(`HTTP Listening on ${port}!`))
const httpsServerRef = app.listen(
  httpsServerPort,
  '0.0.0.0',
  () => console.log(`HTTPS is Listening on ${httpsServerPort}!`)
)

ioServer.attach(serveRef)
ioServer.attach(httpsServerRef)

