// get data path
const path = require(path)

function getDataPath() {
  return `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/data`
}

module.exports.getDataPath