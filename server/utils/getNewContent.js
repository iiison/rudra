function getNewContent({ type }) {
  const map = {
    variable : [`const tempVar = ''`],
    function : [`function tempFxn() {`, `}`]
  }

  return map[type]
}

module.exports = {
  getNewContent
}

