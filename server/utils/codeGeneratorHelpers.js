const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const { startCase } = require('lodash')

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

function reactFunctionComponentHelper({ code, name }) {
  const options = {
    sourceType : 'unambiguous',
    plugins    : ['jsx']
  }
  const ast = generateAST(code, options)
  const sentenceCase = startCase(name)

  console.log('%%%%%%%%%%%%%%%%%%%')
  console.log(sentenceCase)
  console.log('%%%%%%%%%%%%%%%%%%%')

  traverse(ast, {
    FunctionDeclaration : ({ node }) => {
      node.id.name = name
    },
    JSXText : ({ node }) => {
      node.value = sentenceCase
    }
  })

  return generate(ast).code
}

module.exports = {
  actionMakerHelper,
  reactFunctionComponentHelper
}
