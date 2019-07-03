const stylelint = require('stylelint');

/**
 * Wrapper around stylelints lint function
 * @param options - config for stylelint
 */
function linter(options, compiler, done) {
  stylelint.lint(options)
    .then(data => {
      // data.results: An array containing all the stylelint result objects (the objects that formatters consume)
      const { output } = data;
      console.log(output);
      done();
    })
    .catch(done);
}

module.exports = linter;