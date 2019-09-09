<template>
  <div class="selectors">
    <div class="content">
      <SelectorHierarchy v-bind:chartData=chartData />
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SelectorHierarchy from '@/components/SelectorHierarchy.vue'; // @ is an alias to /src
// import json from '@/results/data.json'; // @ is an alias to /src

function log(s){
  console.log(s)
}

export default Vue.extend({
  name: 'home',
  components: {
    SelectorHierarchy
  },
  data() {
    return {
      results: {},
      chartData: {
        duplications: {},
        general: {},
        smelly: {}
      }
    };
  },
  methods: {
    cData() {
      this.chartData.general = this.parseSelectors(this.generalData())
      this.chartData.duplications = this.parseSelectors(this.duplicationData())
      this.chartData.smelly = this.parseSelectors(this.smellyData())
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
      fetch('/results/data.json')
      .then(response => response.json())
      .then(data => {
        this.results = data
        this.duplications = this.results.duplications
        this.cData()
      })
    },
    parseSelectors: function(selectors) {
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
            sList.children[sList.children.length-1].children.push({ "name": `:${pS[1]}`, "children": [] })            
          } else {
            // parent vorhanden, also finden und child hinzufügen
            for(var i = 0; i < sList.children.length; i++) {
              if (sList.children[i].name === pS[0]) {
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
    }
    ,
    // find selector names recursevly and add children on a no-match
    // findDeepAndCreate: function(data, selector, flag) {
    //   if(flag) {
    //   // erneuter aufruf mit einem Treffer
    //     return data.some((e) => {
    //       // parent wurde gefunden
    //       if(e.name == selector[0]) {
    //         // wieder ein match also nochmal aufrufen
    //         selector = selector.slice(1)
            
    //         // Falls das Parent Element keine kinder hat -> sofort pushen
    //         if(e.children.length === 0) {
    //           return this.addToArray(selector, e.children) 
    //         }

    //         // noch eine Runde drehen
    //         return this.findDeepAndCreate(e.children, selector, true)            
    //       } else {
    //         // kein match gefunden, also hier alle Children plazieren
    //         // Sonderfall!
    //         // Kind ist bereits vorhanden -> müsste beim Parent plaziert werden
    //         // wie finde ich heraus, ab wann der Sonderfall eintritt?
            
    //         return this.addToArray(selector, e.children)            
    //       }
    //     })
    //   } else {
    //     return data.some((e) => {
    //       if(e.name == selector[0]) {
    //         // we have a hit
    //         selector = selector.slice(1)

    //         //
            

    //         if(e.children.length === 0) {
    //           return this.addToArray(selector, e.children) 
    //         }
  
    //         return this.findDeepAndCreate(e.children, selector, true)
            
    //         // return this.findDeepAndCreate(e.children, selector)
    //       } else if(e.children) {
    //         return this.findDeepAndCreate(e.children, selector)
    //       }
    //     })
    //   }
    // },
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
