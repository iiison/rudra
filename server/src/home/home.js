const chalk = require('chalk')
const {
  findFile,
  findDirectory
} = require('../../utils/listFiles')

function addHomePageEvents({ client }) {
  const { projPath } = global
  const {
    ioServer,
    makeDir,
    makeFile,
    ifFileExists
  } = global.globalUtilFunctions

  client.on('openFile', async (data) => {
    console.log(chalk.yellow('*****************************'))
    console.log(chalk.yellow('INFO: openFile event from src/home.js:\n'))
    console.log(data.file)
    console.log(chalk.yellow('*****************************'))

    const filteredFiles = await findFile(projPath, data.file)

    ioServer.emit('openFile', { filteredFiles, file : data.file.join(' ') })
  })

  client.on('make directory', async ({ path : filePath, operation, dirName }) => {
    console.log(chalk.yellow('*****************************'))
    console.log(chalk.yellow('INFO: \'make directory\' event from src/home.js:\n'))
    console.log(filePath)
    console.log(chalk.yellow('*****************************'))

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
}

module.exports = {
  addHomePageEvents
}

