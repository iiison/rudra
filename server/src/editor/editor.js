const { formatInputQuery } = require('../../utils/utils')
const {
  getNewContent,
  checkForHooksInImport
}    = require('../../utils/getNewContent')

const { getUtils } = require('./editorUtils')

function addEditorPageEvents({ client }) {
  const {
    readFile,
    ioServer,
  } = global.globalUtilFunctions
  const {
    handleFileImport,
    handleLibraryImport,
    addReactHooksInImport,
    getLastEntryOfImportType,
    validateAndSaveFileContent
  } = getUtils()

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
      /** TODO
       * - It's not a good idea to do this operation here.
       *   Should be handled in handleLibraryImprot function.
       *
       * - Should check if the file/lib was imported already.
       */

      const importCode = `import {} from '${data.imortItem}'\r`
      const fileContent = readFile(file)

      const importLine = getLastEntryOfImportType('library', fileContent)

      const fileContentByLine = fileContent.split(/\r?\n/)

      const firstPart = fileContentByLine.slice(0, importLine)
      const restPart = fileContentByLine.slice(importLine)
      const newContent = [...firstPart, importCode, ...restPart]

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
    const {
      line,
      type,
      file,
      meta = {},
      changeType = 'line'
    } = data

    const normalizedLineNumber = parseInt(line, 10) - 1
    const fileContent          = readFile(file)
    const newPart              = getNewContent({ type, meta, fileContent })

    let fileContentByLine = fileContent.split(/\r?\n/),
      newContent

    // Should have been done at getNewContent level
    if (type === 'reactStateHook' || type === 'reactUseEffectHook') {
      fileContentByLine = addReactHooksInImport({
        type,
        fileContentByLine,
        ...checkForHooksInImport(fileContent)
      })
    }

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
  })
}

module.exports = {
  addEditorPageEvents
}

