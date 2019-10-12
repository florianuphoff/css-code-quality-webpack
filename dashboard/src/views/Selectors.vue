<template>
  <div class="selectors">
    <div class="container">
      <SelectorHierarchy v-bind:chartData=chartData type='general' />
      <SelectorHierarchy v-bind:chartData=chartData type='duplications' />
      <SelectorHierarchy v-bind:chartData=chartData type='warnings' />
      <!-- <SelectorHierarchy v-bind:chartData=chartData /> -->
      <!-- <SpecificityChart :dataseries=dataseries :yAxis=yAxis :xAxis=xAxis :specificityValues=specificityValues />
      <Heatmap :heatMapData=heatMapData /> -->
      <!-- <ButterflyChortChart v-bind:chordData=chordData /> -->
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import SelectorHierarchy from '@/components/SelectorHierarchy.vue'; // @ is an alias to /src
import ButterflyChortChart from '@/components/ButterflyChortChart.vue'; // @ is an alias to /src
// import SpecificityChart from '@/components/SpecificityChart.vue'; // @ is an alias to /src
// import Heatmap from '@/components/Heatmap.vue'
import { calculate } from 'specificity';
// import json from '@/results/data.json'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    SelectorHierarchy,
    ButterflyChortChart,
    // SpecificityChart,
    // Heatmap
  },
  data() {
    return {
      results: {},
      chartData: {
        duplications: {},
        general: {},
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
      this.chartData.general = this.parseSelectors(this.generalData(), "general")
      this.chartData.duplications = this.parseSelectors(this.duplicationData(), "duplication")
      this.chartData.smelly = this.parseSelectors(this.smellyData(), "smelly")

    },
    duplicationData() {
      let dSelectors = []

      this.results.duplications.forEach(duplicationObject => {
        dSelectors.push(duplicationObject.origin.selector)
        if(duplicationObject.duplication) {
          dSelectors.push(duplicationObject.duplication.selector)
        }
      });
      this.results.warnings.forEach(warning => {
        if(warning.rule === 'no-duplicate-selectors') {
          dSelectors.push(warning.resolvedSelector)
        }
      })
      return dSelectors
    },
    generalData() {
      return this.results.stats[0].selectors.values
    },
    smellyData() {
      let sData = []

      this.results.warnings.forEach(warning => {
        if(warning.rule === 'block-no-empty') {
          sData.push(warning.resolvedSelector)
        } else if (warning.rule === 'no-descending-specificity') {
          sData.push(warning.resolvedSelector)
        } else if (warning.rule === 'selector-pseudo-class-no-unknown') {
          sData.push(warning.resolvedSelector)
        } else if (warning.rule === 'selector-type-no-unknown') {
          sData.push(warning.resolvedSelector)
        } else if (warning.rule === 'max-nesting-depth') {
          sData.push(warning.resolvedSelector)
        } else if (warning.rule === 'selector-max-compound-selectors') {
          sData.push(warning.resolvedSelector)
        } else if (warning.rule === 'selector-max-id') {
          sData.push(warning.resolvedSelector)
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
        this.duplications = this.results.duplications
        this.cData()
      })
    },
    parseSelectors: function(selectors, dType) {
      const type = dType
      let sList = {"name":"root", "children": []}
      selectors.forEach(selector => {
        const seperatedSelectors = selector.split(' ')
        const parentSelector = seperatedSelectors[0]
        
        const children = seperatedSelectors.slice(1)

        if(sList.children.filter(e => e.name === parentSelector).length <= 0 && !seperatedSelectors[0].includes(':')) {
          sList.children.push({ "name": seperatedSelectors[0], "children": [] })
        }

        // nest pseudo elements inside selector
        if(seperatedSelectors[0].includes(':')) {
          const pS = selector.split(':')
          // parent noch nicht da
          if(!sList.children.filter(e => e.name === pS[0]).length) {
            sList.children.push({ "name": pS[0], "children": [] })
            // todo: packe DATAINFOS hierhin
            sList.children[sList.children.length-1].children.push({ "name": `:${pS[1]}`, "children": [] })            
          } else {
            // parent vorhanden, also finden und child hinzufügen
            for(var i = 0; i < sList.children.length; i++) {
              if (sList.children[i].name === pS[0]) {
                // todo: packe DATAINFOS hierhin - falls !children.length
                // denn gibts keine children
                sList.children[i].children.push({ "name": `:${pS[1]}`, "children": [] })
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
          this.generateChildren(children, index, sList)
        }
        
      });
      
      return sList
    },
    generateChildren(children, parentIndex, sList) {
      children = this.cleanArray(children, '+')
      children = this.cleanArray(children, '>')
      children = this.cleanArray(children, '~')
      children = this.separatePseudos(children)
      const subParentIndex = sList.children[parentIndex].children.filter(e => e.name === children[0]).length

      // falls bestimmte sorte an selektoren -> skip fürs erste
      if(children[0] === '+' || children[0] === '>' || children[0] === '~') {
        // sonderfall
        // darf nicht passiere durchs cleaning im schritt vorher
      } else {
        // keine kinder oder kind nicht da
        if(sList.children[parentIndex].children.length == 0 || subParentIndex <= 0) {
          // bei einem Kind = puhse sofort
          if(children.length === 1) {
            // todo: packe DATAINFOS hierhin
            sList.children[parentIndex].children.push({ "name": children[0], children: [] })
          } else {
            // mehrere Kinder = erstelle Konstrukt --- bottom-up Ansatz
            this.addToArray(children, sList.children[parentIndex].children)
          }
        } // wenn child[0] ein Treffer ist, dann suche weiter bis kein Treffer da ist 
        else if(subParentIndex > 0) {
          // remove first child = its the parent
          this.recursiveAdd(sList.children[parentIndex], children)
          // this.findDeepAndCreate(sList.children[parentIndex].children, children)
        }
      }
    },
    recursiveAdd(tree, selector, hit) {
      tree.children.forEach(subtree => {
        if(selector[0] === subtree.name) {
          parent = selector[0]
          selector = selector.slice(1)
          if(subtree.children.length === 0) {
            return this.addToArray(selector, subtree.children) 
          } else if(subtree.children.filter(e => e.name === selector[0]).length <= 0) {
            return this.addToArray(selector, subtree.children) 
          } else if(subtree.children.filter(e => e.name === selector[0]).length > 0 && selector.length === 1) {
            return 
          }
          return this.recursiveAdd(subtree, selector, true)
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
    addToArray: function(children, array) {
      if(children.length === 1) {
        array.push({ "name": children[0], children: [] })
      } else {
        let struct = {}
        let tmpStruct = {}
        // mehrere Kinder = erstelle Konstrukt --- bottom-up Ansatz
        for(var i = children.length-1; i >= 0; i--) {
          if(i == children.length-1) {
            // todo: packe DATAINFOS hierhin
            tmpStruct = { "name": children[i], children: [] }
          } else {
            struct = { "name": children[i], children: [tmpStruct] }
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
