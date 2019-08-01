// get data path
const path = require('path')
const fs = require('fs');
const fg = require('fast-glob');

function getDataPath() {
  return `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/data`
}

function getCssFilenames() {
  return fg.sync(`${getDataPath()}/*.css`, `!${getDataPath()}/*.css.map`);
}

function getCssFile(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

module.exports = {
  getDataPath: getDataPath,
  getCssFilenames: getCssFilenames,
  getCssFile: getCssFile
}