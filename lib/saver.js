const path = require('path')

class Saver {
  constructor() {
    this.savePath = `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/results`
  }

  get savePath() {
    return this.savePath;
  }

  saveStylelintResult(violation) {
    const ruleName = violation.ruleName;
    const result = violation.result;
    const message = violation.message;
    const line = violation.line;
    const node = violation.node;
    const index = violation.index;
    const word = violation.word;
  }
}

module.exports = Saver