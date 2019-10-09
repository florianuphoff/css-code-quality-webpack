const utils = require('./utils')
const postcss = require('postcss')
const cssstats = require('cssstats')
const postcssCodeDuplication = require('postcss-code-duplication')
const postcssSelectorStats = require('postcss-selector-stats')
const npmRun = require('npm-run')
const path = require('path')

function postcssLinter(compilation, saver, timestamp) {
  const plugins = [cssstats(), postcssCodeDuplication(), postcssSelectorStats({})];

  utils.getCssFilenames().forEach(filePath => {
    postcss(plugins).process(utils.getCssFile(filePath), { from: filePath, prev: false }).then(result => {
      result.messages.forEach(function (message) {
        saver.addPostcssResult(message)
      })

      saver.writeResults(timestamp)

      const currwd = path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/dashboard/package.json"))

      console.log(currwd)

      npmRun.exec('npm run build', {cwd: currwd}, function (err, stdout, stderr) {
        // err Error or null if there was no error
        console.log(err)
        // stdout Buffer|String
        // stderr Buffer|String
      })
    })
  })
}

module.exports = postcssLinter;