<template>
  <div class="home">
    <div class="content">
      <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->

      <p>Welche Elemente?</p>
      <p>Statistische Diagramme, etc</p>
      <p>Stats</p>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import HelloWorld from '@/components/HelloWord.vue'; // @ is an alias to /src
// import json from '@/results/data.json'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  data() {
    return {
      results: {},
      spiderChartData: {},
      barChartData: {}
    };
  },
  created() {
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
        let uSelectors = [...new Set(this.results.stats[0].selectors.values)].length

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

        // vielleicht die SpiderChart um drei erweitern? Es wird schwierig, gleiche Properties bei duplikate, undone und ignored zu filtern
        // Lösung: alle findings in ein Array packen, distinct() und dann hab ich die Anzahl an "dirty props"

        let dDecl = [];


        // duplikate
        // undoing
        let undoneCount = 0
        this.results.warnings.forEach(warning => {
          if(warning.rule === 'plugin/no-undoing-styles') {
            dDecl.push(warning.word)
            undoneCount++
          }
        });

        // ignored
        let ignoredCount = 0

        this.results.warnings.forEach(warning => {
          if(warning.rule === 'plugin/declaration-block-no-ignored-properties') {
            dDecl.push(warning.word)
            ignoredCount++
          }
        });

        console.log(dDecl);
        dDecl = [...new Set(dDecl)]
        console.log(dDecl);

        

        // welche daten werden für spiderChart genutzt? 

      });
    // load the results
    // maybe call a service for that? dl = new Dataloader('overview')
    // check that later
  },
});
</script>
