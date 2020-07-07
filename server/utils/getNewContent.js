const fs   = require('fs')
const path = require('path')

function getNewContent({ type }) {
  const map = {
    variable            : [`const tempVar = ''`],
    function            : [`function tempFxn() {`, `}`],
    reactStateHook      : [`const [temp, setTemp] = useState('')`],
    reactUseEffectHook  : [`useEffect(() => {}, [])`],
    reactClassComponent : fs.readFileSync(
      path.resolve('./static/reactClassComponent.txt'),
      'utf8'
    ),
    reactFunctionComponent : fs.readFileSync(
      path.resolve('./static/reactFunctionComponent.txt'),
      'utf8'
    )
  }

  return map[type]
}

module.exports = {
  getNewContent
}

