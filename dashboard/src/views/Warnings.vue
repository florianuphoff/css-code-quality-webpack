<template>
  <div class="selectors">
    <div class="hierarchy-container">
      <SelectorHierarchy v-bind:chartData=chartData type='fulldupl' />
      <SelectorHierarchy v-bind:chartData=chartData type='partialdupl' />
      <SelectorHierarchy v-bind:chartData=chartData type='warnings' />
      <!-- <ButterflyChortChart v-bind:chordData=chordData /> -->
      <div class="tooltipContainer"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SelectorHierarchy from '@/components/SelectorHierarchy.vue'; // @ is an alias to /src
// import ButterflyChortChart from '@/components/ButterflyChortChart.vue'; // @ is an alias to /src
// import SpecificityChart from '@/components/SpecificityChart.vue'; // @ is an alias to /src
// import Heatmap from '@/components/Heatmap.vue'
import { calculate } from 'specificity';
// import json from '@/results/data.json'; // @ is an alias to /src


export default Vue.extend({
  name: 'warnings',
  components: {
    SelectorHierarchy,
    // ButterflyChortChart,
    // SpecificityChart,
    // Heatmap
  },
  data() {
    return {
      results: {},
      chartData: {
        duplications: {},
        fulldupl: {},
        smelly: {}
      },
      // chordData: {
      //   data: [],
      //   names: [],
      //   offset: 0
      // },
    };
  },
  methods: {
    // butterFlyData() {
    //   let data = []
    //   let mixins = []
    //   let mixinsNames = []
    //   let includes = []
    //   let mixinIncludes = []
    //   let includeNames = []
    //   let placeholder = []
    //   let placeholderNames = []
    //   let extend = []
    //   let extendNames = []

    //   this.results.mixins.forEach(report => {
    //     if(report.type === 'include') {
    //       includes.push(report)


    //       if(report.selector) {
    //         // case: mixin includes another mixin
    //         // this is the mixin name
    //         // save the usage and add it later the matrix

    //         //save the mixin to Names
    //         // TODO: add usage reference from mixin to mixin
    //         mixinsNames.push(report.selector.split('(')[0])
    //       } else {

    //         includeNames.push(report.resolvedSelector)
    //       }
    //     } else if(report.type === 'mixin') {
    //       mixins.push(report)
    //       mixinsNames.push(report.selector.split('(')[0])
    //     } else if(report.type === 'extend') {
    //       extend.push(report)

    //       if(!report.value.includes('%')) {
    //         extendNames.push(report.resolvedSelector)            
    //         placeholderNames.push(report.value)
    //       } else if(report.resolvedSelector.includes('%')) {
    //         // placeholder extends placeholder
    //         placeholderNames.push(report.value)          
    //         placeholderNames.push(report.resolvedSelector)
    //       } else {
    //         extendNames.push(report.resolvedSelector)            
    //       }
    //     } else if(report.type === 'placeholder') {
    //       placeholderNames.push(report.selector)
    //     }
    //   });

    //   placeholderNames = [...new Set(placeholderNames)]
    //   extendNames = [...new Set(extendNames)]
    //   const mNames = [...new Set(mixinsNames) ,'' , includeNames , ''].flat();
    //   const eNames = [placeholderNames ,'' , extendNames , ''].flat(); //uncomment for butterfly
    //   // const eNames = [placeholderNames, extendNames].flat();

    //   // TODO: es fehlt die Matrix

    //   let eMatrix = []
    //   for (let j = 0; j < eNames.length; j++) {
    //     eMatrix.push(new Array(eNames.length))
    //     eMatrix[j].fill(0)
    //   }
    //   let respondents = 0
    //   for (let k = 0; k < eNames.length; k++) {
    //     let name = eNames[k]
    //     extend.forEach(report => {
    //       let index = 0
    //       let hit = false
    //       if(name === report.resolvedSelector) {
    //         // placeholder extends placeholder
    //         // find s in eNames
    //         index = eNames.indexOf(report.value)
    //         eMatrix[k][index] = 1
    //         respondents += 1
    //       } else if(name === report.value) {
    //         index = eNames.indexOf(report.resolvedSelector)
    //         eMatrix[k][index] = 1
    //         respondents += 1
    //       }
    //     })
    //   }

    //   const emptyPerc = 0.2; // What % of the circle should become empty
    //   const emptyStroke = Math.round(respondents * emptyPerc)
    //   const offset = (2 * Math.PI) * (emptyStroke / (respondents + emptyStroke)) / 4
    //   let eIndex = 0
    //   for (let l = 0; l < eNames.length; l++) {
    //     if(eNames[l] === '') {
    //       eIndex = l
    //       eMatrix[l][eNames.length-1] = emptyStroke
    //       break;
    //     }
    //   }
    //   eMatrix[eMatrix.length-1][eIndex] = emptyStroke

    //   this.chordData.data = eMatrix
    //   this.chordData.names = eNames
    //   this.chordData.offset = offset
    //   log(eMatrix)
    // },
    cData() {
      // this.chartData.general = this.parseSelectors(this.generalData(), "general")
      this.chartData.fulldupl = this.parseSelectors(this.duplicationData('safe'), "fullDuplication")
      this.chartData.duplications = this.parseSelectors(this.duplicationData('unsafe'), "duplication")
      this.chartData.smelly = this.parseSelectors(this.smellyData(), "smelly")
    },
    duplicationData(filter) {
      const mode = filter
      let dSelectors = []
      let uniqueRef = 0

      this.results.duplications.forEach(duplicationObject => {
        // safe == only full duplications
        if((mode === 'safe' && duplicationObject.type === 0) || (mode === 'unsafe' && duplicationObject.type !== 0)) {
          dSelectors.push({ selector: duplicationObject.origin.selector, 
          data: {
            category: "duplication", 
            type: duplicationObject.type, 
            ref: uniqueRef, 
            oLine: duplicationObject.originLine, 
            oFile: duplicationObject.originFile,
            dLine: duplicationObject.duplLine, 
            dFile: duplicationObject.duplFile
          } 
        })
        if(duplicationObject.duplication) {
          dSelectors.push({
            selector: duplicationObject.duplication.selector, 
            data: {
              category: "duplication", 
              type: duplicationObject.type, 
              ref: uniqueRef,
              oLine: duplicationObject.originLine, 
              oFile: duplicationObject.originFile,
              dLine: duplicationObject.duplLine, 
              dFile: duplicationObject.duplFile
            } 
          })
        }
        uniqueRef++
        }
      });
      if(mode == 'unsafe') {
        this.results.warnings.forEach(warning => {
          if(warning.rule === 'no-duplicate-selectors' || warning.rule === 'scss/selector-no-redundant-nesting-selector' || warning.rule === 'declaration-block-no-duplicate-properties' || warning.rule === 'declaration-block-no-shorthand-property-overrides') {
            dSelectors.push({ selector: warning.resolvedSelector, data: { category: "duplication" } })
          }
        })
      }
      return dSelectors
    },
    generalData() {
      let data = []
      this.results.stats[0].selectors.values.forEach(sel => {
        data.push({ selector: sel, category: "general", data: {} })
      })
      return data
    },
    generateRule(plugin) {
      let rule = ''
      switch (plugin) {
        case 'selector-type-no-unknown':
          rule = 'Unbekannter Typ'
          break;
        case 'selector-pseudo-element-no-unknown':
          rule = 'Unbekanntes Pseudoelement'
          break;
        case 'selector-pseudo-class-no-unknown':
          rule = 'Unbekannte Pseudoklasse'
          break;
        case 'no-unknown-animations':
          rule = 'Unbekannte Animation'
          break;
        case 'no-descending-specificity':
          rule = 'Keine absteigende Spezifität'
          break;
        case 'max-nesting-depth':
          rule = 'Maximale Verschachtelungstiefe überschritten'
          break;
        case 'selector-max-id':
          rule = 'Maximale Anzahl an IDs überschritten'
          break;
        case 'selector-max-type':
          rule = 'Maximale Anzahl an Typen überschritten'
          break;
        case 'selector-max-class':
          rule = 'Maximale Anzahl an Klassen überschritten'
          break;
        case 'selector-max-compound-selectors':
          rule = 'Zu viele compound-Selektoren'
          break;
        case 'selector-no-qualifying-type':
          rule = 'Überqualifizierter Typ-Selektor'
          break;
        case 'shorthand-property-no-redundant-values':
          rule = 'Redundante Shorthand-Properties'
          break;
        case 'scss/at-extend-no-missing-placeholder':
          rule = 'Fehlender Placeholder'
          break;
        case 'length-zero-no-unit':
          rule = 'Maßeinheit bei 0'
          break;
        case 'plugin/no-low-performance-animation-properties':
          rule = 'Low-performance Animationen'
          break;
        case 'plugin/declaration-block-no-ignored-properties':
          rule = 'Ignorierte Property'
          break;
        case 'plugin/no-undoing-styles':
          rule = 'Zurückgesetzte Property'
          break;
        case 'selector-attribute-operator-blacklist':
          rule = 'Unerlaubter Attributselektor'
          break;
        case 'block-no-empty':
          rule = 'Leerer Selektor'
          break;
        case 'scss/selector-no-redundant-nesting-selector':
          rule = 'Redundant verschachtelter Selektor'
          break;
        case 'no-duplicate-selectors':
          rule = 'Duplizierter Selektorenname'
          break;
        case 'declaration-block-no-duplicate-properties':
          rule = 'Duplizierte Deklaration'
          break;
        case 'declaration-block-no-shorthand-property-overrides':
          rule = 'Redundante Shorthand-Property'
          break;
        default:
          rule = 'Unbekannte Warnung'
      }
      return rule
    },
    smellyData() {
      let sData = []

      this.results.warnings.forEach(warning => {
        const ruleName = this.generateRule(warning.rule)
        let category = ''
        switch(warning.rule) {
          case 'selector-type-no-unknown':
          case 'selector-pseudo-element-no-unknown':
          case 'selector-pseudo-class-no-unknown':
          case 'no-unknown-animations':
            category = 'syntax'
            break;
          case 'no-descending-specificity':
          case 'max-nesting-depth':
          case 'selector-max-id':
          case 'selector-max-type':
          case 'selector-max-class':
          case 'selector-max-compound-selectors':
          case 'selector-no-qualifying-type':
          case 'shorthand-property-no-redundant-values':
            category = 'specificity'
            break;
          case 'scss/at-extend-no-missing-placeholder':
          case 'length-zero-no-unit':
            category = 'style'
            break;
          case 'plugin/no-low-performance-animation-properties':
          case 'plugin/declaration-block-no-ignored-properties':
          case 'plugin/no-undoing-styles':
          case 'selector-attribute-operator-blacklist':
          case 'block-no-empty':
            category = 'performance'
            break;
          case 'scss/selector-no-redundant-nesting-selector':
          case 'no-duplicate-selectors':
          case 'declaration-block-no-duplicate-properties':
          case 'declaration-block-no-shorthand-property-overrides':
            category = 'dupl'
            break;
          default:
            // should not get here
            category = ''
        }
        if(warning.resolvedSelector !== '') {
          const file = warning.file.split('/')
          sData.push({ selector: warning.resolvedSelector, data: { category: category, rule: ruleName, file: file.slice(Math.max(file.length - 3, 0)).join('/'), line: warning.line, property: warning.word } })
        }
      })

      return sData
    },
    async fetchHierarchyChartData() {
      // return well formatted data
      fetch('/dashboard/results/data.json')
        .then(response => response.json())
        .then(data => {
          this.results = data
          this.cData()
        })
    },
    parseSelectors: function(selectorList, dType) {
      // TODO: Es muss für jeden Eintrag die category hinterlegt werden!!!
      // dh Algorithmus anpassen

      const type = dType
      let sList = {"name":"root", "children": []}
      selectorList.forEach(entry => {
        if(!entry.selector) console.error(entry)
        const seperatedSelectors = entry.selector.split(' ')
        const parentSelector = seperatedSelectors[0]
        
        const children = seperatedSelectors.slice(1)
        const parentEntry = sList.children.filter(e => e.name === parentSelector)

        // root level und kein pseudo element im selektor
        if(parentEntry.length <= 0 && !seperatedSelectors[0].includes(':')) {
          if(children.length) {
            sList.children.push({ "name": seperatedSelectors[0], "children": [], 'data': [] })
          } else {
            sList.children.push({ "name": seperatedSelectors[0], "children": [], 'data': [entry.data] })
          }
        // es gibt ein Treffer und keine Kinder
        // füge data hinzu
        } else if (parentEntry.length > 0 && children.length < 1 && (entry.category !== 'general')) {
          parentEntry[0].data.push(entry.data)
        }

        // root level und pseudo element
        if(parentSelector.includes(':')) {
          // pS[0] = parent; pS[1] = pseudo element
          const pS = entry.selector.split(':')
          
          // falls parent nicht gefunden
          if(!sList.children.filter(e => e.name === pS[0]).length) {
            sList.children.push({ "name": pS[0], "children": [], 'data': [] })
            // packe pseudo element direkt als kind hinzu
            // es kann hier keine kinder geben
            sList.children[sList.children.length-1].children.push({ "name": `:${pS[1]}`, "children": [], 'data': [entry.data] })
          } else {
            // parent vorhanden, also finden und child hinzufügen falls nicht vorhanden
            for(var i = 0; i < sList.children.length; i++) {
              if (sList.children[i].name === pS[0]) {
                const hit = sList.children[i].children.filter(e => e.name === `:${pS[1]}`)
                if(hit.length <= 0) {
                  sList.children[i].children.push({ "name": `:${pS[1]}`, "children": [], 'data': [entry.data] })
                } else {
                  hit[0].data.push(entry.data)
                }
                break;
              }
            }
          }
        }

        let index = 0
        for(var i = 0; i < sList.children.length; i++) {
          // 
          if (sList.children[i].name === parentSelector) {
            index = i
          }
        }
        // children vorhanden, also hinzufügen
        if(children.length) {
          this.generateChildren(children, index, sList, entry.data)
        }
        
      });
      
      return sList
    },
    generateChildren(children, parentIndex, sList, data) {
      children = this.cleanArray(children, '+')
      children = this.cleanArray(children, '>')
      children = this.cleanArray(children, '~')
      children = this.separatePseudos(children)
      // hole direkt das parent-parent element
      const subParentIndex = sList.children[parentIndex].children.filter(e => e.name === children[0]).length

      // falls bestimmte sorte an selektoren -> skip fürs erste
      if(children[0] === '+' || children[0] === '>' || children[0] === '~') {
        // sonderfall
        // darf nicht passieren durchs cleaning im schritt vorher
      } else {
        // keine kinder oder kind nicht da
        if(sList.children[parentIndex].children.length <= 0 || subParentIndex <= 0) {
          // bei einem Kind = puhse sofort
          if(children.length === 1) {
            sList.children[parentIndex].children.push({ "name": children[0], children: [], 'data': [data] })
          } else {
            // mehrere Kinder = erstelle Konstrukt --- bottom-up Ansatz
            this.addToArray(children, sList.children[parentIndex].children, data)
          }
        } // wenn child[0] ein Treffer ist, dann suche weiter bis kein Treffer da ist 
        else if(subParentIndex > 0) {
          // remove first child = its the parent
          // nur hier können Kategorien mehrfach auftreten
          this.recursiveAdd(sList.children[parentIndex], children, data)
        }
      }
    },
    recursiveAdd(tree, selector, data) {
      tree.children.forEach(subtree => {
        const parent = selector[0]
        if(subtree.name === parent) {
          selector = selector.slice(1)
          const selectorHit = subtree.children.filter(e => e.name === selector[0])
          if(subtree.children.length === 0 && selector.length > 0) {
            return this.addToArray(selector, subtree.children, data) 
          } else if(selectorHit.length <= 0 && selector.length > 0) {
            return this.addToArray(selector, subtree.children, data) 
          } else if(selectorHit.length > 0 && selector.length === 1) {
            selectorHit[0].data.push(data)
            return 
          } else if(selectorHit.length <= 0 && selector.length <= 0) {
            subtree.data.push(data)
            return
          }
          return this.recursiveAdd(subtree, selector, data)
        }
      })
    },
    cleanArray: function(array, operator) {
      let index = array.indexOf(operator)
      if (index > -1) {
        array[index+1] = `${operator} ${array[index+1]}`
        array.splice(index, 1)
      }
      return array
    },
    addToArray: function(children, array, data) {
      if(children.length === 1) {
        array.push({ "name": children[0], children: [], 'data': [data] })
      } else {
        let struct = {}
        let tmpStruct = {}
        // mehrere Kinder = erstelle Konstrukt --- bottom-up Ansatz
        for(var i = children.length-1; i >= 0; i--) {
          if(i == children.length-1) {
            tmpStruct = { "name": children[i], children: [], 'data': [data] }
          } else {
            struct = { "name": children[i], children: [tmpStruct], 'data': [] }
            tmpStruct = struct
          }
        }
        array.push(struct)
      }
    },
    separatePseudos(array) {
      let sepArr = []
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.includes(':')) {
          let pS = element.split(':')
          pS[1] = `:${pS[1]}`
          sepArr = sepArr.concat(pS)
        } else {
          sepArr.push(element)
        }
      }
      return sepArr
    }
  },
  mounted() {
    this.fetchHierarchyChartData();
  },
});
</script>

<style scoped>
.tooltipContainer {
  position: absolute;
  max-width: 250px;
  padding: 5px 8px;
  border: 1px solid black;		
  pointer-events: none;

  background-color: rgba(255, 255, 255, 0.92);

  font-size: 12px;
}
</style>

