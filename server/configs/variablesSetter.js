const path = require('path')

function setProjectPath(projPath) {
  global.projPath = path.join(__dirname, `../${projPath}`)
}

module.exports = { setProjectPath }
