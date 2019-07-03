const runLinting = require('./lib/runLinting');
const defaultFormatter = require('stylelint').formatters.json;

class StylesheetCodeQualityWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(options, compiler) {
    options = options || {};
    const context = options.context || compiler.context;
    const formatter = this.options.formatter || defaultFormatter;

    // build config object for stylelint
    options = Object.assign(
      {
        formatter,
      },
      options,
      {
        // default: any directory level of scss/sass file
        // under webpack's context and specificity changed via globbing patterns
        files: arrify(options.files || '**/*.s?(c|a)ss').map((file) =>
          path.join(context, '/', file)
        ),
        context,
      }
    );

    const runner = runLinting.bind(this, options);

    compiler.hooks.done.tap('StylesheetCodeQualityWebpackPlugin', runner);
  }
}

module.exports = StylesheetCodeQualityWebpackPlugin;