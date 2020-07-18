const chalk = require('chalk')
const path  = require('path')

const { format } = require('../../utils/fileFormatter')
const { findSimilaritiesInLists } = require('../../utils/utils')
const { findFile } = require('../../utils/listFiles')

function getUtils() {
  const { projPath } = global
  const {
    ioServer,
    makeFile,
    readFile,
  } = global.globalUtilFunctions

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
      console.log(chalk.red('*****************************'))
      console.log(chalk.red('ERROR: Validation Error @ validateAndSaveFileContent src/editor/editorUtils.js:\n'))
      console.log(errors)
      console.log(chalk.red('*****************************'))

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

    console.log(chalk.yellow('*****************************'))
    console.log(chalk.yellow('INFO: filtered lists handleFileImport @ src/editor/editorUtils.js:\n'))
    console.log(filteredList)
    console.log(defaultFilteredList)
    console.log(chalk.yellow('*****************************'))

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

  return {
    handleFileImport,
    handleLibraryImport,
    validateAndSaveFileContent
  }
}

module.exports = { getUtils }

