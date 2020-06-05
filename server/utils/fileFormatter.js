const eslint    = require('eslint')

const engine = new eslint.CLIEngine({
  envs  : ['browser', 'mocha'],
  fix   : true
})

function formatLintErrorMessage(messages) {
  const messageTypeMap = {
    1 : 'warning',
    2 : 'error'
  }

  if (messages && messages.length > 0) {
    return messages.reduce((prev, curr) => {
      const { severity, ruleId, message } = curr
      const messageType = messageTypeMap[severity]
      const prevTypeItems = prev[`${messageType}s`]

      curr.type = messageTypeMap[severity]

      if (!ruleId) {
        curr.message = message.slice(0, message.indexOf('\n'))
      }

      return {
        ...prev,
        [`${messageType}s`] : [
          ...prevTypeItems,
          curr
        ]
      }
    }, {
      errors   : [],
      warnings : []
    })
  }

  return null
}

function format({ file, content }) {
  const report = file
    ? engine.executeOnFiles(file)
    : engine.executeOnText(content)
  const {
    output,
    messages,
    errorCount,
    warningCount,
  } = report.results[0] || []
  const formattedErrors = formatLintErrorMessage(messages)

  return {
    content : output,
    errors  : formattedErrors,
    meta    : {
      errorCount,
      warningCount,
    }
  }
}

module.exports = { format }

