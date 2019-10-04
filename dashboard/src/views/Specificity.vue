<template>
  <div class="properties">
    <div class="container">
      <SpecificityChart :dataseries=dataseries :yAxis=yAxis :specificityValues=specificityValues :selectorList=selectorList />
      <Heatmap :heatMapData=heatMapData />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { calculate } from 'specificity';
import SpecificityChart from '@/components/SpecificityChart.vue'; // @ is an alias to /src
import Heatmap from '@/components/Heatmap.vue';

export default Vue.extend({
  name: 'specificity',
  components: {
    SpecificityChart,
    Heatmap
  },
  data() {
    return {
      specificityValues: [],
      yAxis: [],
      xAxis: 0,
      dataseries: [],
      selectorList: [],
      heatMapData: {
        yAxis: [],
        xAxis: [],
        dataseries: []
      }
    }
  },
  methods: {
    async fetchHierarchyChartData() {
      // return well formatted data
      fetch('/results/data.json')
      .then(response => response.json())
      .then(data => {
        this.results = data

        this.specificityChartData()
        this.heatmapData()
      })
    },
    heatmapData() {
      const xaxis = [1,2,3,10,11,20,21,30,31,100,101,'zu spezifisch']
      let nestings = []
      let selectorList = []
      let yaxis = []

      // objekt für data series

      this.results.nesting.forEach(element => {
        if(element.selector.includes(',')) {
          const newSel = element.selector.split(',')
          newSel.forEach(el => {
            let sp = calculate(el)[0].specificity
            sp = parseInt(sp.replace(/,/g, ''), 10)
            selectorList.push({selector: el, depth: element.depth, specificity: sp})

          });
        } else {
          let sp = calculate(element.selector)[0].specificity
          sp = parseInt(sp.replace(/,/g, ''), 10)
          selectorList.push({selector: element.selector, depth: element.depth, specificity: sp})
        }
        nestings.push(element.depth)
      });

      // y achse
      nestings = [...new Set(nestings)]
      this.heatMapData.yAxis = nestings.length-1

      const entries = nestings.length * xaxis.length

      let dataseries = []
      for (let j = 0; j < xaxis.length; j++) {
        dataseries.push(new Array(nestings.length))
        nestings.forEach((depth,index) => {
          dataseries[j][index] = [j,depth,0]
        })
      }

      this.results.nesting.forEach(element => {
        if(element.selector.includes(',')) {
          const newSel = element.selector.split(',')
          newSel.forEach(el => {
            let sp = calculate(el)[0].specificity
            sp = parseInt(sp.replace(/,/g, ''), 10)
            const depth = element.depth

            let firstIndex = -1
            // falls true -> 'zu spezifisch'
            if ((sp > 2 && sp < 10) 
             || (sp > 11 && sp < 20) 
             || (sp > 21 && sp < 30) 
             || (sp > 31 && sp < 100) 
             || (sp >= 102)) {
              firstIndex = xaxis.indexOf('zu spezifisch')
            } else {
              firstIndex = xaxis.indexOf(sp)
            }
            let secondIndex = nestings.indexOf(element.depth)
            dataseries[firstIndex][secondIndex][2] += 1
          });
        } else {
          let sp = calculate(element.selector)[0].specificity
          sp = parseInt(sp.replace(/,/g, ''), 10)

          let firstIndex = -1
            // falls true -> 'zu spezifisch'
          if ((sp > 2 && sp < 10) 
            || (sp > 11 && sp < 20) 
            || (sp > 21 && sp < 30) 
            || (sp > 31 && sp < 100) 
            || (sp >= 102)) {
            firstIndex = xaxis.indexOf('zu spezifisch')
          } else {
            firstIndex = xaxis.indexOf(sp)
          }
          let secondIndex = nestings.indexOf(element.depth)
          dataseries[firstIndex][secondIndex][2] += 1
        }
      });

      dataseries = dataseries.flat()
      this.heatMapData.dataseries = dataseries
      this.heatMapData.xAxis = xaxis
    },
    specificityChartData() {
      this.yAxis = [...new Set(this.results.stats[0].selectors.getSpecificityGraph)].sort((a, b) => a - b)

      let selectorList = []
      this.results.nesting.forEach(element => {
        if(element.selector.includes(',')) {
          const newSel = element.selector.split(',')
          newSel.forEach(el => {
            let sp = calculate(el)[0].specificity
            sp = parseInt(sp.replace(/,/g, ''), 10)
            selectorList.push({selector: el, depth: element.depth, specificity: sp})
          })
        } else {
          let sp = calculate(element.selector)[0].specificity
          sp = parseInt(sp.replace(/,/g, ''), 10)
          selectorList.push({selector: element.selector, depth: element.depth, specificity: sp})
        }
      });
      console.log(selectorList)

      let ds = []
      this.results.stats[0].selectors.getSpecificityGraph.forEach((specificity, index) => {
        const lineNumber = this.results.stats[1].selectors[index].startsAt
        ds.push([lineNumber, this.yAxis.indexOf(specificity)])
      });

      let specificityValues = []
      this.results.stats[1].selectors.forEach(sel => {
        selectorList.flatMap((entry, i) => {
          if(entry.selector === sel.selector) {
            sel.depth = entry.depth
          }
        })
        specificityValues.push(sel)
      })

      this.specificityValues = specificityValues
      this.xAxis = this.results.stats[1].lines
      this.selectorList = selectorList
      this.dataseries = ds
    },
  },
  mounted() {
    this.fetchHierarchyChartData()
  },
});
</script>
