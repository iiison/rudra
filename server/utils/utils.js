const fs = require('fs');

function formatInputQuery(input) {
  const inputArray = input.split(' ')

  if (inputArray[0].length === 1) {
    return [input]
  }

  return inputArray
}

function findSimilaritiesInLists({ target, input }) {
  return [...new Set(target.map(
    entry => {
      for (const i in input) {
        const name = input[i].toLowerCase()

        if (entry.toLowerCase().includes(name)) {
          return entry
        }
      }
    }
  ).filter(Boolean))]
}

function stripCommonPartsFromPaths(paths, projPath) {
  if (projPath) {
    return paths.map( path => path.replace(projPath, '') )
  }

  var [smallestPath, largestPath] = paths.reduce(([sml, lrg], path) => {
    if (!sml) {
      sml = path
      lrg = path
    }

    if (path.length < sml.length){
      sml = path
    }

    if (path.length > lrg.length) {
      lrg = path
    }

    return [sml, lrg]
  }, ['', ''])

  let i = 0

  for (; i < smallestPath.length; i++) {
    if (smallestPath[i] === largestPath[i]) {
      continue
    }

    break
  }

  return paths.map((path) => path.substring(i - 1))
}

function readFileFromProject(projectPath, path) {
  return {
    readFile     : (filePath) => fs.readFileSync(path.join(projectPath, filePath), 'utf8'),
    ifFileExists : (filePath) => fs.existsSync(path.join(projectPath, filePath)),
    makeDir      : (dirPath) =>  fs.mkdirSync(path.join(projectPath, dirPath)),
    makeFile     : (filePath, content) => fs.writeFileSync(
      path.join(projectPath, filePath),
      content, 
      {
        encoding : 'utf8',
        mode     : 0o755
      }
    )
  }
}

module.exports = {
  formatInputQuery,
  readFileFromProject,
  findSimilaritiesInLists,
  stripCommonPartsFromPaths
}

