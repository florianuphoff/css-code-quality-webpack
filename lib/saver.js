const path = require('path')
const utils = require('./utils')
const excludingNames = ['keyframes']

class Saver {
  constructor() {
    this._savePath = `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/results`
    this._result = {
      nesting: new Map(),
      warnings: [],
      stats: [],
      mixins: []
    }
  }

  get savePath() {
    return this._savePath
  }

  set savePath(savepath) {
    this._savePath = this.savePath;
  }

  get nesting() {
    return this._result.nesting
  }
  
  nestingResult(result) {
    this._result.nesting = new Map([...this.nesting, ...result])
  }

  get warnings() {
    return this._result.warnings
  }

  warningResult(result) {
    this._result.warnings.push(result)
  }

  get mixins() {
    return this._result.mixins
  }

  resultMixins(result) {
    this._result.mixins.push(result)
  }

  /**
   * add a stylelint message
   * @param message - _postcssResult message object of a stylelint's warning
   */
  addStylelintResult(message) {
    const result = message
    let resolvedSelector = ''

    switch (message.rule) {
      case 'plugin/report-nesting-depth':
        // save map to this._result.nesting
        this.nestingResult(message.node)
        break
    
      case 'plugin/stats':
        // save stats to this._result.stats
        break

      case 'plugin/mixin-extend-usage':
        // save to this.result.mixin
        switch (message.node.name) {
          case 'mixin':
            this.resultMixins({
              type: 'mixin',
              line: message.line,
              column: message.column,
              selector: message.word,
              value: message.word
            })    
            break;
          case 'include':
            if(message.node.parent.name !== 'mixin') resolvedSelector = utils.getSelector(message.node.parent)

            this.resultMixins({
              type: 'include',
              line: message.line,
              column: message.column,
              selector: message.node.parent.params,
              resolvedSelector: resolvedSelector,
              value: message.word
            })
            break;
          case 'extend':
            resolvedSelector = utils.getSelector(message.node.parent)
            this.resultMixins({
              type: 'extend',
              line: message.line,
              column: message.column,
              selector: message.node.parent.params,
              resolvedSelector: resolvedSelector,
              value: message.word
            })
            break;
          case 'rule':
            this.resultMixins({
              type: 'placeholder',
              line: message.line,
              column: message.column,
              selector: message.word,
              value: message.word
            })
            break;
          default:
            // we should not get here
            break;
        }
        break
      default:
        // save all warnings to this._result.warnings
        
        // some plugins return a declaration node, so there is no selector as a direct parent
        if(message.node.type === 'rule') {
          resolvedSelector = utils.getSelector(message.node)
          this.warningResult({
            selector: message.node.selector,
            resolvedSelector: resolvedSelector,
            line: message.line,
            column: message.column,
            rule: message.rule,
            word: message.word,
          })
        } else if(message.node.type === 'decl') {
          resolvedSelector = utils.getSelector(message.node.parent)
          this.warningResult({
            selector: message.node.parent.selector,
            resolvedSelector: resolvedSelector,
            line: message.line,
            column: message.column,
            rule: message.rule,
            word: `${message.node.prop}:${message.node.value}`
          })
        } else {
          console.log(message)
          if(!message.node.name.includes(excludingNames)) resolvedSelector = utils.getSelector(message.node.parent)
          this.warningResult({
            selector: message.node.parent.selector,
            resolvedSelector: resolvedSelector,
            line: message.line,
            column: message.column,
            rule: message.rule,
            word: message.word,
          })
        }
        break
    }
  }

  writeResults() {
    console.log(this._result);
    
  }
}

module.exports = Saver