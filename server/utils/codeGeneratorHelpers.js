const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
// const { generate } = require('astring')


function generateAST(code, options = {}) {
  try {
    return parse(code, options)
  } catch (error) {
    return error.message
  }
}

function actionMakerHelper({ code, actionName }) {
  const ast = generateAST(code)
  const nameTypeMap = {
    defaultAction : actionName,
    successAction : `${actionName}Success`,
    failureAction : `${actionName}Failure`
  }

  traverse(ast, {
    ObjectProperty :  ({ node }) => {
      const actionType = node.key.name

      node.value.name = nameTypeMap[actionType]
    }
  })

  const { code : newCode } = generate(ast)

  return newCode.split('\n')
}

module.exports = {
  actionMakerHelper
}
