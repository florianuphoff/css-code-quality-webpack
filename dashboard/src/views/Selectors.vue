<template>
  <div class="selectors">
    <div class="content">
      <SelectorHierarchy v-bind:selectorData=selectorData />
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SelectorHierarchy from '@/components/SelectorHierarchy.vue'; // @ is an alias to /src
// import json from '@/results/data.json'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    SelectorHierarchy
  },
  data() {
    return {
      results: {},
      selectorData: {}
    };
  },
  methods: {
    async fetchHierarchyChartData() {
      // return well formatted data
      fetch('/results/data.json')
      .then(response => response.json())
      .then(data => {
        this.results = data

        const selectorList = this.results.stats[0].selectors.values
        const wellformedSelectors = this.parseSelectors(selectorList)

        this.selectorData = wellformedSelectors

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


          // children.forEach(e => {
            
            // for(var i = 0; i < sList.children.length; i++) {
            //   // 
            //   if (sList.children[i].name === parentSelector) {
            //     if(sList.children[i].children.length) {
            //       for(var i = 0; i < sList.children[i].children.length; i++) {

            //       }
            //     } else {
            //       sList.children[i].children.push({ "name": e, "children": [] })
            //     }
            //     break;
            //   }
            // }
          // })
        }
        
      });
      
      return sList
    },
    generateChildren(children, parentIndex, sList) {
      children = this.cleanArray(children, '+')
      children = this.cleanArray(children, '>')
      children = this.cleanArray(children, '~')

      // falls bestimmte sorte an selektoren -> skip fürs erste
      if(children[0] === '+' || children[0] === '>' || children[0] === '~') {
        // sonderfall
        // darf nicht passiere durchs cleaning im schritt vorher
      } else {
        // keine kinder oder kind nicht da
        
        if(sList.children[parentIndex].children.length == 0 || sList.children[parentIndex].children.filter(e => e.name === children[0]).length <= 0) {
          let struct = {}

          // bei einem Kind = puhse sofort
          if(children.length === 1) {
            sList.children[parentIndex].children.push({ "name": children[0], children: [] })
          } else {
            console.log(JSON.stringify(children))
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
  
            sList.children[parentIndex].children.push(struct)
          }
        } // wenn child[0] ein Treffer ist, dann suche weiter bis kein Treffer da ist (vllt findDeep nur auf dem Teilstück?) 
        else if(sList.children[parentIndex].children.filter(e => e.name === children[0]).length > 0) {
          // console.log(JSON.stringify(children))
          
        }
        


        // wenn kinder nicht vorhanden oder kind nicht vorhanden
        // pushe neues kind
        // if(!sList.children[parentIndex].children && sList.children[parentIndex].children.filter(e => e.name === children[0]).length <= 0) {
        //   sList.children[i].children.push({ "name": children[0], "children": [] })
        //   return this.generateChildren(children.slice(1),)
        // }

        // sList.children[parentIndex].children.forEach(child)

        // for(var i = 0; i < sList.children[parentIndex].children.length; i++) { 
        //   if (selectorList.children[i].name === children) {
            
        //   }
        // }
        // if(finished) {
        //   return null
        // }
      }
    },
    // find selector names recursevly
    findDeep: function(data, selector) {
      return data.some(function(e) {
        if(e.name == selector) return true;
        else if(e.children) return this.findDeep(e.children, selector)
      })
    },
    cleanArray: function(array, operator) {
      let index = array.indexOf(operator)
      if (index > -1) {
        array[index+1] = `${operator} ${array[index+1]}`
        array.splice(index, 1)
      }
      return array
    }
  },
  mounted() {
    this.fetchHierarchyChartData();
  },
});
</script>
