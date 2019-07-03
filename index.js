class CssCodeQualityWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap('Hello World Plugin', (
      stats /* stats is passed as argument when done hook is tapped.  */
    ) => {
      console.log(this.options.message);
      console.log('------------------------------------------------');
    });
  }
}

module.exports = HelloWorldPlugin;