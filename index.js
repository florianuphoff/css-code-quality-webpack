const styleLinter = require('./lib/stylelintLinter')
const postcssLinter = require('./lib/postcssLinter')
const { dataPath } = require('./lib/utils')
const defaultFormatter = require('stylelint').formatters.json
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
    const pLinter = postcssLinter.bind(this)

    compiler.hooks.shouldEmit.tap('StylesheetCodeQualityWebpackPlugin', (compilation, callback) => {
      Object.entries(compilation.assets).forEach((entry, index) => {
        let targetFile = entry[0]
        
        if(!targetFile.includes('css/')) {
          return
        }
        
        const source = entry[1]
        const outputPath = dataPath()
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

          fs.writeFile(targetPath, content, err => {
            if (err) {
              console.error(err)
              return callback(err);
            }
          });   
        };
        

        fs.mkdir(outputPath, { recursive: true }, writeOut)
      })
      console.info('- Saved bundled files to /data - ')
      console.info('- Starting analysis process - ')
      
      sLinter(compilation)
      postcssLinter(compilation)
    })
  }
}

module.exports = StylesheetCodeQualityWebpackPlugin;