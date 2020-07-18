const homeFxns = require('./home/home')
const editorFxns = require('./editor/editor')

module.exports = {
  ...homeFxns,
  ...editorFxns
}

