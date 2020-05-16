const fs    = require('fs').promises;
const fuzzy = require('fuzzy')
const path  = require('path');

const defaultConfigs = {
  excluded : ['node_modules', 'build', '.git']
}

async function getAllFiles(dir, configs = {}) {
  let files = await fs.readdir(dir);
  const { excluded = defaultConfigs.excluded } = configs

  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory() && !excluded.includes(file)) return getAllFiles(filePath);
    else if(stats.isFile()) return filePath;
  }));

  return files
    .reduce((all, folderContents) => folderContents ? all.concat(folderContents) : all, [])
    // .map(addr => addr.toLowerCase());
}

async function getAllDirs(dir, configs = {}, dirs = []) {
  let files = await fs.readdir(dir);
  const { excluded = defaultConfigs.excluded } = configs

  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory() && !excluded.includes(file)){
      dirs.push(filePath)

      return getAllDirs(filePath, {}, dirs);
    }
  }));

  return dirs.map(dirPath => `${dirPath}/`)
}

function filterNames(fullSet, patterns) {
  const filtered = patterns
    .map(
      (pattern) => fullSet.filter(
        entry => (entry && entry.toLowerCase().includes(pattern.toLowerCase())
      ))
    ).flat()

  return [...new Set(filtered)]
}

async function findFile(directory, fileName) {
  const files = await getAllFiles(directory)
  const filteredUniq = filterNames(files, fileName)

  return filteredUniq
}


async function findDirectory(directory, dirName) {
  const dirs = await getAllDirs(directory)
  const filtered = filterNames(dirs, dirName)

  return filtered;
}

module.exports = {
  findFile,
  findDirectory
}

