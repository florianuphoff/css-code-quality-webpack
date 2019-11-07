const stylelint = require('stylelint')

/**
 * Wrapper around stylelints lint function
 * @param options - config for stylelint
 */
function linter(options, compilation, saver) {
  stylelint.lint(options)
    .then(data => {
      const { output, results, } = data
      results.forEach(LintResult => {
        LintResult._postcssResult.messages.forEach((message) => {
          saver.addStylelintResult(message)
        })
      })
      
      saver.writeResults()  
    })
    .catch(err => {
      console.log(err.stack)
    })
}

module.exports = linter;