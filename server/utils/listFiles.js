const fs       = require('fs').promises
const FuzzySet = require('fuzzyset.js')
const path     = require('path')

const { stripCommonPartsFromPaths } = require('./utils')

const defaultConfigs = {
  excluded : ['node_modules', 'build', '.git']
}

async function getAllFiles(dir, configs = {}) {
  let files = await fs.readdir(dir)
  const { excluded = [] } = configs
  const mergedExcluded = [...defaultConfigs.excluded, ...excluded]


  files = await Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file)
    const stats = await fs.stat(filePath)

    if (stats.isDirectory() && !mergedExcluded.includes(file)) return getAllFiles(filePath)
    else if (stats.isFile()) return filePath
  }))

  return files
    .reduce((all, folderContents) => {
      return folderContents ? all.concat(folderContents) : all
    }, [])
    // .map(addr => addr.toLowerCase())
}

async function getAllDirs(dir, configs = {}, dirs = []) {
  let files = await fs.readdir(dir)
  const { excluded = [] } = configs
  const mergedExcluded = [...defaultConfigs.excluded, ...excluded]

  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file)
    const stats = await fs.stat(filePath)

    if (stats.isDirectory() && !mergedExcluded.includes(file)) {
      dirs.push(filePath)

      return getAllDirs(filePath, {}, dirs)
    }
  }))

  return dirs.map((dirPath) => `${dirPath}/`)
}

function filterNames(fullSet, patterns) {
  const matcher = FuzzySet(fullSet, false)
  const joinedPattern = patterns.join(' ')
  const matches = matcher.get(joinedPattern, undefined, 0.2) || []

  return matches.map((match) => match[1])

  // const filtered = patterns
  //   .map(
  //     (pattern) => fullSet.filter(
  //       entry => (entry && entry.toLowerCase().includes(pattern.toLowerCase())
  //     ))
  //   ).flat()

  // return [...new Set(filtered)]
}

async function findFile(directory, fileName) {
  const files = stripCommonPartsFromPaths(await getAllFiles(directory), directory)
  const filteredUniq = filterNames(files, fileName)

  return filteredUniq
}


async function findDirectory(directory, dirName) {
  const dirs = stripCommonPartsFromPaths(await getAllDirs(directory), directory)
  const filtered = filterNames(dirs, dirName)

  return filtered
}

module.exports = {
  findFile,
  findDirectory
}

