function formatInputQuery(input) {
  const inputArray = input.split(' ')

  if (inputArray[0].length === 1) {
    return [input]
  }

  return inputArray
}

module.exports = {
  formatInputQuery
}
