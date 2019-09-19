// get data path
const path = require('path')
const fs = require('fs');
const fg = require('fast-glob')
const resolvedNestedSelector = require("postcss-resolve-nested-selector")

function getDataPath() {
  return `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/data`
}

function getCssFilenames() {
  return fg.sync(`${getDataPath()}/*.css`, `!${getDataPath()}/*.css.map`);
}

function getCssFile(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

function getSelector(node) {
  return resolvedNestedSelector(node.selector, node)[0]
}

function countFileLines(filePath){
  const fileBuffer = fs.readFileSync(filePath)
  const to_string = fileBuffer.toString();
  const split_lines = to_string.split("\n");
  return split_lines.length-1
}

module.exports = {
  getDataPath: getDataPath,
  getCssFilenames: getCssFilenames,
  getCssFile: getCssFile,
  getSelector: getSelector
}