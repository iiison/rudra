const fs    = require('fs').promises;
const fuzzy = require('fuzzy')
const path  = require('path');

const defaultConfigs = {
  excluded : ['node_modules', 'build', '.git']
}
async function walk(dir, configs = {}) {
  let files = await fs.readdir(dir);
  const { excluded = defaultConfigs.excluded } = configs

  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory() && !excluded.includes(file)) return walk(filePath);
    else if(stats.isFile()) return filePath;
  }));

  return files
    .reduce((all, folderContents) => folderContents ? all.concat(folderContents) : all, [])
    .map(addr => addr.toLowerCase());
}

async function findFile(directory, fileName) {
  const files = await walk(directory)

  // const fzFiltered = fuzzy.filter(fileName, files)

  const filtered = files.filter(file => (file && file.includes(fileName)))

  return filtered
}

module.exports = findFile

