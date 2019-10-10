const utils = require('./utils')
const postcss = require('postcss')
const cssstats = require('cssstats')
const postcssCodeDuplication = require('postcss-code-duplication')
const postcssSelectorStats = require('postcss-selector-stats')
const npmRun = require('npm-run')
const path = require('path')
const fs = require('fs-extra')

function postcssLinter(copyTo, compilation, saver, timestamp) {
  const plugins = [cssstats(), postcssCodeDuplication(), postcssSelectorStats({})];

  utils.getCssFilenames().forEach(filePath => {
    postcss(plugins).process(utils.getCssFile(filePath), { from: filePath, prev: false }).then(result => {
      result.messages.forEach(function (message) {
        saver.addPostcssResult(message)
      })

      saver.writeResults(timestamp)

      const currwd = path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/dashboard/package.json"))

      npmRun.exec('npm install', {cwd: currwd}, function (err, stdout, stderr) {
        // err Error or null if there was no error
        if(!err) {
          console.log('No error. Building Dashboard app now...')
          npmRun.exec('npm run build', {cwd: currwd}, function (err, stdout, stderr) {
            if(!err) {
              console.log('Finished building the dashboard - copying it to publicPath...')
              fs.copySync(`${currwd}/dist`, `${process.cwd()}${copyTo}`)
              console.log(`Dashboard copied to: ${process.cwd()}${copyTo}`)

            } else {
              console.error(err)
            }
          })
        }
      })
      
    })
  })
}

module.exports = postcssLinter;