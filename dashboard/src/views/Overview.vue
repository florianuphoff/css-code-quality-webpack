<template>
  <div class="home">
    <div class="content">
      <!-- <SpiderChart v-bind:spiderChartData=spiderChartData /> -->
      <div class="v-box w-1-1">
        <div class="v-box__header">Code Qualität</div>
        <div class="cp v-box__content">
          <div class="cp-box">
            <div class="cp-box__header">Selektoren</div>
            <apexchart type=radialBar height=250 :options="chartOptions" :series="uSelectors" />
            <div class="cp-box__description">Prozentualer Anteil an Selektoren, die nicht dupliziert sind.</div>
          </div>  
          <div class="cp-box">
            <div class="cp-box__header">Deklarationen</div>
            <apexchart type=radialBar height=250 :options="chartOptions" :series="cp" />
            <div class="cp-box__description">Prozentualer Anteil an Deklarationen, die nicht dupliziert, ignoriert oder zurückgesetzt wurden.</div>
          </div>  
          <div class="cp-box">
            <div class="cp-box__header">Spezifizität</div>
            <apexchart type=radialBar height=250 :options="chartOptions" :series="unspecificSelectors" />
            <div class="cp-box__description">Prozentualer Anteil an Selektoren, deren Spezifizität bei >3, 10-12, 20-22, 30-33 und bei 100-102 liegt.</div>
          </div>  
          <div class="cp-box">
            <div class="cp-box__header">Verschachtelung</div>
            <apexchart type=radialBar height=250 :options="chartOptions" :series="vn" />
            <div class="cp-box__description">Prozentualer Anteil an Selektoren, deren Verschachtelungstiefe unter 4 liegt. Die empfohlene Verschachtelungstiefe liegt bei 3.</div>
          </div>  
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SpiderChart from '@/components/SpiderChart.vue'; // @ is an alias to /src
import ProgressRing from '@/components/ProgressRing.vue'; // @ is an alias to /src
import VueApexCharts from 'vue-apexcharts';
// import json from '@/results/data.json'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    SpiderChart,
    ProgressRing,
    apexchart: VueApexCharts
  },
  data() {
    return {
      results: {},
      spiderChartData: [],
      barChartData: {},
      cp: [0],
      uSelectors: [0],
      vn: [0],
      unspecificSelectors: [0],
      chartOptions: {
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#ccc",
              strokeWidth: '97%',
              margin: 2, // margin is in pixels
              shadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#999',
                opacity: 1,
                blur: 2
              }
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                offsetY: 0,
                fontSize: '22px'
              }
            },
          },
          
        },
        fill: {
          colors: ['#ff8a00']
        },
        labels: ['Average Results'],
      }
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

        this.cp[0] = cleanProps
        this.uSelectors[0] = percentageOfUniqueSelectors
        this.unspecificSelectors[0] = percentageOfUnspecificSelectors
        this.vn[0] = percentageOfValidNestings

        this.spiderChartData = [cleanProps, percentageOfValidNestings, percentageOfUnspecificSelectors, percentageOfUniqueSelectors]
      });
    }
  },
  mounted() {
    this.fetchSpiderChartData();
  },
});
</script>
