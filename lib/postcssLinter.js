const utils = require('./utils')
const postcss = require('postcss')
const cssstats = require('cssstats')
const postcssCodeDuplication = require('postcss-code-duplication')
const postcssSelectorStats = require('postcss-selector-stats')

function postcssLinter(compilation, saver, timestamp) {
  const plugins = [cssstats(), postcssCodeDuplication(), postcssSelectorStats()];

  utils.getCssFilenames().forEach(filePath => {
    postcss(plugins).process(utils.getCssFile(filePath), { from: filePath, prev: false }).then(result => {
      result.messages.forEach(function (message) {
        saver.addPostcssResult(message)
      })

      saver.writeResults(timestamp)
    })
  })
}

module.exports = postcssLinter;