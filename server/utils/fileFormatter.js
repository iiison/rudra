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

      if (ruleId === `react-hooks/rules-of-hooks`) {
        return prev
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
  if (content.constructor.name !== 'String') {
    throw new Error('Please check content type, it should be String')
  }

  const report = file
    ? engine.executeOnFiles(file)
    : engine.executeOnText(content)
  const {
    output,
    source,
    messages,
    errorCount,
    warningCount,
  } = report.results[0] || []
  const formattedErrors = formatLintErrorMessage(messages)

  console.log('*******************')
  console.log(source)
  console.log('-------------------')
  console.log(output)
  console.log('*******************')

  return {
    content : output || source,
    errors  : formattedErrors,
    meta    : {
      errorCount,
      warningCount,
    }
  }
}

module.exports = { format }

