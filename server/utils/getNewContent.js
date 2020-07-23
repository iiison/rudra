const fs   = require('fs')
const path = require('path')

const {
  actionMakerHelper,
  checkForHooksInImport,
  reactFunctionComponentHelper
} = require('./codeGeneratorHelpers')

function getNewContent({ type, meta }) {
  const map = {
    variable            : [`const tempVar = ''`],
    function            : [`function tempFxn() {`, `}`],
    reactStateHook      : [`const [%, set%] = useState('')`],
    reactUseEffectHook  : [`useEffect(() => {}, [])`],
    reactClassComponent : fs.readFileSync(
      path.resolve('./static/reactClassComponent.txt'),
      'utf8'
    ),
    reactFunctionComponent : fs.readFileSync(
      path.resolve('./static/reactFunctionComponent.txt'),
      'utf8'
    ),
    reducerFunction : fs.readFileSync(
      path.resolve('./static/reducerFunction.txt'),
      'utf8'
    ),
    reduxActions : fs.readFileSync(
      path.resolve('./static/reduxActions.txt'),
      'utf8'
    ),
    reduxAsyncAction : fs.readFileSync(
      path.resolve('./static/reduxAsyncAction.txt'),
      'utf8'
    ),
  }

  const rawResult = map[type]
  const { name } = meta

  /** TODO:
   * Change this shit to switch or something better
   **/
  if (type === 'reduxActions') {
    return actionMakerHelper({
      code       : map.reduxActions,
      actionName : name
    })
  }

  if (type === 'reactFunctionComponent') {
    return reactFunctionComponentHelper({
      code : map.reactFunctionComponent,
      name
    })
  }

  if (type === 'reduxAsyncAction') {
    return rawResult.replace(/%/g, name).split(/\r?\n/)
  }

  if (name) {
    return [rawResult[0].replace(/.%/g, (matched) => {
      if (matched[0].match(/\W/)) {
        return `${matched[0]}${name}`
      }

      return `${matched[0]}${name[0].toUpperCase()}${name.slice(1)}`
    })]
  }

  return rawResult
}

module.exports = {
  getNewContent,
  checkForHooksInImport
}

