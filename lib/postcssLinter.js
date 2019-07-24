const utils = require('./utils')
const postcss = require('postcss')
var cssstats = require('cssstats')

function postcssLinter(compilation) {
  // const options = options;
  
  const plugins = [cssstats()];

  // read bundled css somehow
  // read generated sourcemap somehow

  // for each css file
  utils.getCssFilenames().forEach(file => {
    postcss(plugins).process(`${utils.getDataPath()}/${file}`, { from: `${utils.getDataPath()}/${file}`, prev: false }).then(result => {
      result.messages.forEach(function (message) {
        console.log(message)
      })
    })
  })


  console.log('PostCSS - finished (not really)')  
}

module.exports = postcssLinter;