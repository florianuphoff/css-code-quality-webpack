const postcss = require('postcss')
const { dataPath } = require('./utils')
var cssstats = require('cssstats')

function postcssLinter(compilation) {
  // const options = options;
  
  const plugins = [cssstats()];

  // read bundled css somehow
  // read generated sourcemap somehow

  postcss(plugins).process(css, `${dataPath()}/*.css`).then(result => {
    result.messages.forEach(function (message) {
      console.log(message)
    })
  })

  console.log('PostCSS - finished (not really)')  
}

module.exports = postcssLinter;