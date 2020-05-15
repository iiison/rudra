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
    .map(addr => addr.toLowerCase());
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

async function findFile(directory, fileName) {
  const files = await getAllFiles(directory)
  // const fzFiltered = fuzzy.filter(fileName, files)

  const filtered = files.filter(file => (file && file.includes(fileName)))

  return filtered
}


async function findDirectory(directory, dirName) {
  const dirs = await getAllDirs(directory)

  return dirs.filter(dir => dir.includes(dirName));
}

module.exports = {
  findFile,
  findDirectory
}

