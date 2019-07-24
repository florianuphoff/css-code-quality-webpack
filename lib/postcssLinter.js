const utils = require('./utils')
const postcss = require('postcss')
const cssstats = require('cssstats')
const fs = require('fs')

function postcssLinter(compilation) {
  // const options = options;
  
  const plugins = [cssstats()];

  utils.getCssFilenames().forEach(filePath => {
    postcss(plugins).process(utils.getCssFile(filePath), { from: filePath, prev: false }).then(result => {
      result.messages.forEach(function (message) {
        console.log(message)
      })
    })
  })


  console.log('PostCSS - finished (not really)')  
}

module.exports = postcssLinter;