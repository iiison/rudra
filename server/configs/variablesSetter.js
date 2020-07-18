const path = require('path')

function setProjectPath(projPath) {
  global.projPath = path.join(__dirname, `../${projPath}`)
}

function makeValuesGlobal(values = {}, type) {
  if (!type) {
    throw new Error('Please pass type value to makeValuesGlobal function')
  }

  global[type] = {
    ...global.type,
    ...values
  }
}

module.exports = {
  setProjectPath,
  makeValuesGlobal
}

