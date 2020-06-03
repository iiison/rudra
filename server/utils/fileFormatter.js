const eslint    = require('eslint')
const formatter = require('eslint-friendly-formatter')
const lintRules = require('../.eslintrc').rules

const engine = new eslint.CLIEngine({
  envs  : ['browser', 'mocha'],
  rules : lintRules,
  fix   : true
})

const { Linter } = eslint
const linterRef = new Linter()

// function format(content) {
function format({ file, content }) {
  const report = file
    ? engine.executeOnFiles(file)
    : engine.executeOnText(content)

  const results = report.results || []

  eslint.CLIEngine.outputFixes(report)

  console.log('=+++++++++++++++++++++++++++++++++++++++=')
  console.log(results[0].messages)
  console.log('=+++++++++++++++++++++++++++++++++++++++=')

  return formatter(results)
}

module.exports = { format }
