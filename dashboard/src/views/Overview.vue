<template>
  <div class="home">
    <div class="content">
      <SpiderChart v-bind:spiderChartData=spiderChartData />


      <p>Welche Elemente?</p>
      <p>Statistische Diagramme, etc</p>
      <p>Stats</p>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SpiderChart from '@/components/SpiderChart.vue'; // @ is an alias to /src
// import json from '@/results/data.json'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    SpiderChart
  },
  data() {
    return {
      results: {},
      spiderChartData: [],
      barChartData: {}
    };
  },
  methods: {
    async fetchSpiderChartData() {
      fetch('/results/data.json')
      .then(response => response.json())
      .then(data => {
        this.results = data

        const nestingMap = new Map(this.results.nesting.value)

        // nesting
        let percentageOfValidNestings = 0
        let lN = 0
        nestingMap.forEach((value, key) => {
          if(value <= 3) lN++
        })
        percentageOfValidNestings = Math.round(((lN / nestingMap.size) * 100)*100)/100

        // unique selectors
        const uSelectors = [...new Set(this.results.stats[0].selectors.values)].length
        const percentageOfUniqueSelectors = Math.round(((uSelectors / this.results.stats[0].selectors.values.length) * 100)*100)/100

        // specificity
        let percentageOfUnspecificSelectors = 0
        let tHS = 0
        this.results.stats[0].selectors.getSpecificityGraph.forEach(specificity => {
          if (specificity > 2 && specificity < 10) {
            tHS++
          } else if(specificity > 11 && specificity < 20) {
            tHS++            
          } else if(specificity > 21 && specificity < 30) {
            tHS++
          } else if(specificity > 31 && specificity < 100) {
            tHS++            
          } else if(specificity >= 102) {
            tHS++
          } 
        });

        percentageOfUnspecificSelectors = Math.round((((this.results.stats[0].selectors.getSpecificityGraph.length - tHS) / this.results.stats[0].selectors.getSpecificityGraph.length) * 100)*100)/100

        // clean properties
        const declarationsCount = this.results.stats[0].declarations.total

        let dDecl = []
        let cleanProps = 0
        let ignoredCount = 0
        let undoneCount = 0

        
        // duplikate
        const uniqueDeclsCount = this.results.stats[0].declarations.unique
        console.log(uniqueDeclsCount)
        for (let [key, value] of Object.entries(this.results.stats[0].declarations.properties)) {
          value.forEach(element => {
            dDecl.push(`${key}:${element}`)
          });
        }

        let duplicates = dDecl.reduce(function(acc, el, i, arr) {
          if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
        }, []);

        let faultyDecl = [...new Set(duplicates)]

        // undoing
        this.results.warnings.forEach(warning => {
          if(warning.rule === 'plugin/no-undoing-styles') {
            if(faultyDecl.indexOf(warning.word) === -1) {
              faultyDecl.push(warning.word)
              undoneCount++
            }
          }
        });

        // ignored
        this.results.warnings.forEach(warning => {
          if(warning.rule === 'plugin/declaration-block-no-ignored-properties') {
            if(faultyDecl.indexOf(warning.word) === -1) {
              faultyDecl.push(warning.word)
              ignoredCount++
            }
          }
        });
        
        cleanProps = Math.round((((declarationsCount - faultyDecl.length) / declarationsCount) * 100)*100)/100

        this.spiderChartData = [cleanProps, percentageOfValidNestings, percentageOfUnspecificSelectors, percentageOfUniqueSelectors]
      });
    }
  },
  mounted() {
    this.fetchSpiderChartData();
  },
});
</script>
