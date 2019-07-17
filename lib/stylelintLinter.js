const stylelint = require('stylelint');

/**
 * Wrapper around stylelints lint function
 * @param options - config for stylelint
 */
function linter(options, compilation) {

  // Object.entries(compilation.assets).forEach((entry, index) => {
  //   if(entry[0].includes('css/')) {
  //     console.log(entry[1]);
  //     console.log("---------------");
  //   }
  // });

  // stylelint.lint(options)
  //   .then(data => {
  //     // data.results: An array containing all the stylelint result objects (the objects that formatters consume)
  //     const { output } = data;
  //     console.log(output);
  //   })
  //   .catch(err => {
  //     console.log(err.stack);
  //   });
}

module.exports = linter;