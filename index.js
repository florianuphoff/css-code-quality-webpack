const styleLinter = require('./lib/stylelintLinter');
const postcssLinter = require('./lib/postcssLinter');
const defaultFormatter = require('stylelint').formatters.json;
const arrify = require('arrify');
const async = require('neo-async');
const path = require('path');
const fs = require('fs');

class StylesheetCodeQualityWebpackPlugin {
  constructor(stylelintOptions) {
    this.stylelintOptions = stylelintOptions;
  }

  apply(compiler) {
    let stylelintOptions = this.stylelintOptions || {};
    const context = this.stylelintOptions.context || compiler.context;
    const formatter = this.stylelintOptions.formatter || defaultFormatter;

    console.log(context);

    // build config object for stylelint
    stylelintOptions = Object.assign(
      {
        formatter,
      },
      stylelintOptions,
      {
        // default: any directory level of scss/sass file
        // under webpack's context and specificity changed via globbing patterns
        files: arrify(stylelintOptions.files || '**/*.s?(c|a)ss').map((file) =>
          path.join(context, '/', file)
        ),
        context,
      }
    );

    const sLinter = styleLinter.bind(this, stylelintOptions);
    const pLinter = postcssLinter.bind(this);

    compiler.hooks.shouldEmit.tap('StylesheetCodeQualityWebpackPlugin', (compilation, callback) => {
      // save css / css.map files

      Object.entries(compilation.assets).forEach((entry, index) => {
        let targetFile = entry[0];
        
        if(!targetFile.includes('css/')) {
          return;
        }
        
        const source = entry[1];
        const outputPath = `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/data`;      
        const targetPath = `${outputPath}/${targetFile.replace('css/', '')}`;

        const writeOut = err => {
          if (err) {
            console.error(err)              
            return callback(err);
          }

          let content = source.source();        

          if (!Buffer.isBuffer(content)) {
            content = Buffer.from(content, "utf8");
          }

          fs.writeFile(targetPath, content, err => {
            if (err) {
              console.error(err)
              return callback(err);
            }
            
            console.log()
            console.log('File created ----')
          });
          console.log()          
          console.log('run finished')          
        };
        

        fs.mkdir(outputPath, { recursive: true }, writeOut);
      });

      // async.forEach(
      //   compilation.assets,
			// 	(source, file, callback) => {
      //     const targetFile = file;
      //     const outputPath = `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/data`;
      //     const dir = path.dirname(targetFile);
      //     const targetPath = targetFile.match(/\/|\\/) ? path.join(outputPath, dir) : outputPath;
          
      //     if(!targetFile.includes('css/')) {
      //       return;
      //     }

			// 		const writeOut = err => {
			// 			if (err) {
      //         console.error(err)              
      //         return callback(err);
      //       }
      //       let content = source.source();

      //       if (!Buffer.isBuffer(content)) {
      //         content = Buffer.from(content, "utf8");
      //       }

      //       // write css to outputPath
      //       fs.writeFile(outputPath, content, err => {
      //         if (err) {
      //           console.error(err)
      //           return callback(err);
      //         }
              
      //         console.log()
      //         console.log('File created ----')
      //         console.log()
      //       });
      //     };
          
      //     mkdirp(targetPath, writeOut);
			// 	},
			// 	err => {
      //     console.error(err);
			// 		return;
			// 	}
      // );

      // sLinter(compilation);
      // postcssLinter(compilation);
    });
  }
}

module.exports = StylesheetCodeQualityWebpackPlugin;