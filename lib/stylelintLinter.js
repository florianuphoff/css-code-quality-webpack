const stylelint = require('stylelint')
const Saver = require('./saver')

/**
 * Wrapper around stylelints lint function
 * @param options - config for stylelint
 */
function linter(options, compilation) {
  stylelint.lint(options)
    .then(data => {
      // data.results: An array containing all the stylelint result objects (the objects that formatters consume)
      const { output, results, } = data;
      const saver = new Saver()
      results.forEach(LintResult => {
        LintResult._postcssResult.messages.forEach((message) => {
          saver.addStylelintResult(message)
        })
      })
    })
    .catch(err => {
      console.log(err.stack);
    });
}

module.exports = linter;