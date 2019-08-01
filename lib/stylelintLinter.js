const stylelint = require('stylelint');

/**
 * Wrapper around stylelints lint function
 * @param options - config for stylelint
 */
function linter(options, compilation) {
  stylelint.lint(options)
    .then(data => {
      // data.results: An array containing all the stylelint result objects (the objects that formatters consume)
      const { output, results, } = data;
      results.forEach(LintResult => {
        console.log(LintResult.warnings)
        
      })
    })
    .catch(err => {
      console.log(err.stack);
    });
}

module.exports = linter;