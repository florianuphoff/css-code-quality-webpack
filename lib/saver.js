const path = require('path')
const utils = require('./utils')
const fs = require('fs')
const excludingNames = ['keyframes']

class Saver {
  constructor() {
    this._savePath = `${path.dirname(require.resolve("stylesheet-code-quality-webpack-plugin/package.json"))}/dashboard/public/results`
    this._result = {
      nesting: new Map(),
      warnings: [],
      mixins: [],
      duplications: [],
      stats: []
    }
  }

  get savePath() {
    return this._savePath
  }

  set savePath(savepath) {
    this._savePath = this.savePath;
  }

  get result() {
    return this._result
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

  resultDuplications(result) {
    this._result.duplications.push(result)
  }

  resultStats(result) {
    this._result.stats.push(result)
  }

  /**
   * add a stylelint message
   * @param message - _postcssResult message object of a stylelint's warning
   */
  addStylelintResult(message) {
    const result = message
    let resolvedSelector = ''

    switch (result.rule) {
      case 'plugin/report-nesting-depth':
        // save map to this._result.nesting
        this.nestingResult(result.node)
        break
    
      case 'plugin/stats':
        // save stats to this._result.stats
        break

      case 'plugin/mixin-extend-usage':
        // save to this.result.mixin
        switch (result.node.name) {
          case 'mixin':
            this.resultMixins({
              type: 'mixin',
              line: result.line,
              column: result.column,
              selector: result.word,
              value: result.word
            })    
            break;
          case 'include':
            if(result.node.parent.name !== 'mixin') resolvedSelector = utils.getSelector(result.node.parent)

            this.resultMixins({
              type: 'include',
              line: result.line,
              column: result.column,
              selector: result.node.parent.params,
              resolvedSelector: resolvedSelector,
              value: result.word
            })
            break;
          case 'extend':
            resolvedSelector = utils.getSelector(result.node.parent)
            this.resultMixins({
              type: 'extend',
              line: result.line,
              column: result.column,
              selector: result.node.parent.params,
              resolvedSelector: resolvedSelector,
              value: result.word
            })
            break;
          case 'rule':
            this.resultMixins({
              type: 'placeholder',
              line: result.line,
              column: result.column,
              selector: result.word,
              value: result.word
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
        if(result.node.type === 'rule') {
          resolvedSelector = utils.getSelector(result.node)
          this.warningResult({
            selector: result.node.selector,
            resolvedSelector: resolvedSelector,
            line: result.line,
            column: result.column,
            rule: result.rule,
            word: (!result.word || result.word.type === 'selector') ? null : result.word,
          })
        } else if(result.node.type === 'decl') {
          resolvedSelector = utils.getSelector(result.node.parent)
          this.warningResult({
            selector: result.node.parent.selector,
            resolvedSelector: resolvedSelector,
            line: result.line,
            column: result.column,
            rule: result.rule,
            word: `${result.node.prop}:${result.node.value}`
          })
        } else {
          if(!result.node.name.includes(excludingNames)) resolvedSelector = utils.getSelector(result.node.parent)
          this.warningResult({
            selector: result.node.parent.selector,
            resolvedSelector: resolvedSelector,
            line: result.line,
            column: result.column,
            rule: result.rule,
            word: result.word,
          })
        }
        break
    }
  }

  addPostcssResult(message) {
    const result = message

    switch (result.plugin) {
      case 'postcss-code-duplication':
        result.type1.forEach(dupl => {
          this.resultDuplications({
            type: 1,
            origin: dupl.origin,
            duplication: dupl.duplication
          })
        })
        result.type2.forEach(dupl => {
          // no implementation yet
        })
        result.type3.forEach(dupl => {
          this.resultDuplications({
            type: 3,
            origin: dupl.origin,
            duplication: dupl.duplication
          })
        })
        result.type4.forEach(dupl => {
          this.resultDuplications({
            type: 4,
            origin: dupl.origin
          })
        })
        result.type5.forEach(dupl => {
          this.resultDuplications({
            type: 5,
            origin: dupl.origin
          })
        })
        break
      case 'postcss-cssstats':
        this.resultStats({
          size: result.stats.size,
          gzip: result.stats.gzipSize,
          rules: { 
            total: result.stats.rules.total, 
            size: result.stats.rules.size, 
            selectorByRuleSizes: result.stats.rules.selectorByRuleSizes
          },
          selectors: {
            total: result.stats.selectors.total,
            type: result.stats.selectors.type,
            class: result.stats.selectors.class,
            id: result.stats.selectors.id,
            pseudoClass: result.stats.selectors.pseudoClass,
            pseudoElement: result.stats.selectors.pseudoElement,
            values: result.stats.selectors.values,
            specificity: result.stats.selectors.specificity,
            getSpecificityGraph: result.stats.selectors.getSpecificityGraph(),
            getSpecificityValues: result.stats.selectors.getSpecificityValues(),
            getSortedSpecificity: result.stats.selectors.getSortedSpecificity(),
            getRepeatedValues: result.stats.selectors.getRepeatedValues()
          },
          declarations: {
            total: result.stats.declarations.total,
            unique: result.stats.declarations.unique,
            properties: result.stats.declarations.properties,
            getPropertyResets: result.stats.declarations.getPropertyResets(),
            getUniquePropertyCount: result.stats.declarations.getUniquePropertyCount(),
            getPropertyValueCount: result.stats.declarations.getPropertyValueCount(),
            getVendorPrefixed: result.stats.declarations.getVendorPrefixed(),
            getAllFontSizes: result.stats.declarations.getAllFontSizes(),
            getAllFontFamilies: result.stats.declarations.getAllFontFamilies()
          },
          mediaQueries: { 
            total: result.stats.mediaQueries.total, 
            unique: result.stats.mediaQueries.unique, 
            values: result.stats.mediaQueries.values, 
            contents: result.stats.mediaQueries.contents
          }
        })
        break
      case 'postcss-selector-stats':
        // TODO: speicher das result unter /stats[1] als neues Object oder Array ab. Eher array, dann bleibt es so.
        // TODO: als nächstes muss dann "nur" noch in Selectors.vue auf das Array zugegriffen werden und die Chart mit den Infos angereichert werden.
        const lineNumbers = utils.countFileLines(utils.getCssFilenames()[0])
        this.resultStats({
          selectors: result.stats,
          lines: lineNumbers
        })
        break;
      default:
        // we should not get here
        // dont save anything
        break;
    }
  }

  writeResults(timestamp) {
    const replacer = (key, value) => {
      const originalObject = this[key];
      if(originalObject instanceof Map) {
        return {
          dataType: 'Map',
          value: Array.from(originalObject.entries()), // or with spread: value: [...originalObject]
        };
      } else {
        return value;
      }
    }

    let data = JSON.stringify(this.result, replacer, 2)

    fs.writeFile(`${this.savePath}/${timestamp}.json`, data, (err) => {
      if (err) throw err
      // maybe trigger the dashboard stuff?

      console.log("writeFile() finished")
    })

  }
}

module.exports = Saver