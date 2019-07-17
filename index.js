const path = require('path');
const styleLinter = require('./lib/stylelintLinter');
const postcssLinter = require('./lib/postcssLinter').default;
const defaultFormatter = require('stylelint').formatters.json;
const arrify = require('arrify');
const async = require('neo-async');

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

    console.log(stylelintOptions);

    const sLinter = styleLinter.bind(this, stylelintOptions);
    const postcssLinter = postcssLinter.bind(this);

    compiler.hooks.shouldEmit.tap('StylesheetCodeQualityWebpackPlugin', compilation => {
      // save css / css.map files
      let outputPath = compilation.getPath(this.outputPath);

      async.forEach(
        compilation.assets,
				(source, file, callback) => {
          if(!source.includes('css/')) {
            return;
          }
          let targetFile = file;
          
					const queryStringIdx = targetFile.indexOf("?");
					if (queryStringIdx >= 0) {
						targetFile = targetFile.substr(0, queryStringIdx);
          }
          
          const targetPath = this.outputFileSystem.join(
            outputPath,
            targetFile
          );

          console.log(targetPath);
          console.log(outputPath);

					// const writeOut = err => {
					// 	if (err) return callback(err);
					// 	const targetPath = this.outputFileSystem.join(
					// 		outputPath,
					// 		targetFile
					// 	);
					// 	if (source.existsAt === targetPath) {
					// 		source.emitted = false;
					// 		return callback();
					// 	}
					// 	let content = source.source();

					// 	if (!Buffer.isBuffer(content)) {
					// 		content = Buffer.from(content, "utf8");
					// 	}

					// 	source.existsAt = targetPath;
					// 	source.emitted = true;
					// 	this.outputFileSystem.writeFile(targetPath, content, callback);
					// };

					// if (targetFile.match(/\/|\\/)) {
          //   const dir = path.dirname(targetFile);
            
					// 	this.outputFileSystem.mkdirp(
					// 		this.outputFileSystem.join(outputPath, dir),
					// 		writeOut
					// 	);
					// } else {
					// 	writeOut();
					// }
				},
				err => {
          console.error(err);
					return;
				}
      );

      // Object.entries(compilation.assets).forEach((entry, index) => {
      //   if(entry[0].includes('css/')) {
      //     // parse entry to utf8 files and save it to /data
      //     console.log(entry[1]);
      //     let 
      //   }
      // });

      // sLinter(compilation);
      // postcssLinter(compilation);
    });
  }
}

module.exports = StylesheetCodeQualityWebpackPlugin;