const chalk    = require('chalk')
const path     = require('path')
const traverse = require('@babel/traverse').default

const { format }                  = require('../../utils/fileFormatter')
const { findFile }                = require('../../utils/listFiles')
const { generateAST }             = require('../../utils/codeGeneratorHelpers')
const { findSimilaritiesInLists } = require('../../utils/utils')

function getLastEntryOfImportType(type, code) {
  const ast = generateAST(code, {
    sourceType : 'unambiguous',
    plugins    : ['jsx']
  })
  const lastEntryOfType = {
    library : 1,
    file    : 0
  }

  traverse(ast, {
    ImportDeclaration : ({ node }) => {
      const lineNumber = node.loc.start.line

      // Fix Repetitive Logic.
      if (node.source.value.includes('./')) {
        lastEntryOfType.file = lineNumber - lastEntryOfType.file <= 2
          ? lineNumber
          : lastEntryOfType.file
      } else {
        lastEntryOfType.library = lineNumber - lastEntryOfType.library <= 2
          ? lineNumber
          : lastEntryOfType.library
      }
    }
  })

  lastEntryOfType.file = lastEntryOfType.file === 0
    ? lastEntryOfType.file
    : lastEntryOfType.library + 1

  return lastEntryOfType[type]
}

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
      console.log(chalk.red('ERROR : Validation Error @ validateAndSaveFileContent src/editor/editorUtils.js :\n'))
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

  function addImportCode(importCode, data, importType) {
    const { file } = data
    const fileContent = readFile(file)
    const fileContentByLine = fileContent.split(/\r?\n/)
    const importLine = getLastEntryOfImportType(importType, fileContent)

    const firstPart = fileContentByLine.slice(0, importLine - 1)
    const restPart = fileContentByLine.slice(importLine - 1)

    const newContent = [...firstPart, importCode, ...restPart]

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

      addImportCode(importContent, data, 'library')
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
    console.log(chalk.yellow('INFO : filtered lists handleFileImport @ src/editor/editorUtils.js :\n'))
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

      addImportCode(importContent, data, 'file')
    } else {
      ioServer.emit('import operation', {
        operationOn,
        query       : data,
        suggestions : filteredList,
        operation   : 'show suggestions'
      })
    }
  }

  function addReactHooksInImport({
    type,
    reactImportLine,
    fileContentByLine
  }) {
    const normalizedIndex = reactImportLine - 1
    const hookNameTypeMap = {
      reactUseEffectHook : 'useEffect',
      reactStateHook     : 'useState'
    }
    const hookName = hookNameTypeMap[type]

    let reactImportCode = fileContentByLine[normalizedIndex]
    const localImportIndex = reactImportCode.indexOf('{')

    if (localImportIndex === -1) {
      reactImportCode = 'import React, {} from \'react\'\n'
    }

    if (!reactImportCode.includes(hookName)) {
      reactImportCode = reactImportCode.replace('{', `{ ${hookName}, `)
    }

    fileContentByLine[normalizedIndex] = reactImportCode

    console.log('%%%%%%%%%%%%%%%%%%%')
    console.log(fileContentByLine[normalizedIndex])
    console.log('%%%%%%%%%%%%%%%%%%%')

    return fileContentByLine
  }

  return {
    handleFileImport,
    handleLibraryImport,
    addReactHooksInImport,
    getLastEntryOfImportType,
    validateAndSaveFileContent
  }
}

module.exports = { getUtils }

