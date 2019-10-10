const defaultFormatter = require('stylelint').formatters.json
const Saver = require('./lib/saver')
const getDataPath = require('./lib/utils').getDataPath
const styleLinter = require('./lib/stylelintLinter')
const postcssLinter = require('./lib/postcssLinter')
const arrify = require('arrify')
const async = require('neo-async')
const path = require('path')
const fs = require('fs')

class StylesheetCodeQualityWebpackPlugin {
  constructor(stylelintOptions) {
    this.stylelintOptions = stylelintOptions
  }

  apply(compiler) {
    let stylelintOptions = this.stylelintOptions || {}
    const context = this.stylelintOptions.context || compiler.context
    const formatter = this.stylelintOptions.formatter || defaultFormatter
    const exportLocation = this.stylelintOptions.exportLocation || '/'
    const exportJSON = JSON.stringify({ location: exportLocation })
    const copyTo = this.stylelintOptions.copyTo || exportLocation 

    fs.writeFileSync(path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/dashboard/package.json")) + '/export.json', exportJSON)

    stylelintOptions = Object.assign(
      {
        formatter,
      },
      stylelintOptions,
      {
        files: arrify(stylelintOptions.files || '**/*.s?(c|a)ss').map((file) =>
          path.join(context, '/', file)
        ),
        context,
      }
    )

    const sLinter = styleLinter.bind(this, stylelintOptions)
    const saver = new Saver()

    compiler.hooks.shouldEmit.tap('StylesheetCodeQualityWebpackPlugin', (compilation, callback) => {
      Object.entries(compilation.assets).forEach((entry, index) => {
        let targetFile = entry[0]
        
        if(!targetFile.includes('css/')) {
          return
        }
        
        const source = entry[1]
        const outputPath = getDataPath()
        const targetPath = `${outputPath}/${targetFile.replace('css/', '')}`

        const writeOut = err => {
          if (err) {
            console.error(err)              
            return callback(err)
          }

          let content = source.source()

          if (!Buffer.isBuffer(content)) {
            content = Buffer.from(content, "utf8")
          }

          fs.writeFileSync(targetPath, content);   
        }
        
        fs.mkdirSync(outputPath, { recursive: true })
        writeOut()
      })
      
      const timestamp = + new Date()      

      sLinter(compilation, saver, timestamp)
      postcssLinter(stylelintOptions.copyTo, compilation, saver, timestamp)

      
    })
  }
}

module.exports = StylesheetCodeQualityWebpackPlugin;