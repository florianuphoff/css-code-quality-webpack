<template>
  <div class="home">
    <div class="dashboard-container">
      <!-- <SpiderChart v-bind:spiderChartData=spiderChartData /> -->
      <div class="v-box cq">
        <div class="v-box__header">
          Code Qualität 
          <div class="tooltip-icon" 
            v-tooltip='{content: cqHelp, placement: "right", targetClasses: ["cq-tooltip"],}' 
          >
            <font-awesome-icon icon="question-circle" />
          </div>
        </div>
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
            <div class="cp-box__description">Prozentualer Anteil an Selektoren, deren Spezifizität zwischen 1-3, 10-11, 20-21, 30-31 oder 100-101 liegt.</div>
          </div>  
          <div class="cp-box">
            <div class="cp-box__header">Verschachtelung</div>
            <apexchart type=radialBar height=250 :options="chartOptions" :series="vn" />
            <div class="cp-box__description">Prozentualer Anteil an Selektoren, deren Verschachtelungstiefe unter 4 liegt. Die empfohlene Verschachtelungstiefe liegt bei 3.</div>
          </div>  
        </div>
      </div>
      
      <ColumnChart :dataseries=columnDataseries :categories=columnCategories />

      <div class="v-box text-stats">
        <div class="fact-box">
          <div class="fact">
            <div class="fact__header">
              <div class="fact__title">
                Dateien
              </div>
              <div class="fact__content">
                {{columnCategories.length}} 
              </div>
            </div>
            <div class="fact__icon">
              <font-awesome-icon icon="file-code" /> 
            </div>
          </div>
          <div class="fact">
          <div class="fact__header">
              <div class="fact__title">
                Selektoren
              </div>
              <div class="fact__content">
                {{textualData.scss}} 
              </div>
            </div>
            <div class="fact__icon">
              <font-awesome-icon icon="sitemap" />
            </div>
          </div>
          <div class="fact">
            <div class="fact__header">
              <div class="fact__title">
                Dateigröße
              </div>
              <div class="fact__content">
                {{size}} 
              </div>
            </div>
            <div class="fact__icon">
              <font-awesome-icon icon="file-alt" />
            </div>
          </div>
        </div>

        <div class="fact-box">
          <div class="fact">
            <div class="fact__header">
              <div class="fact__title">
                Größter Selektor
              </div>
              <div class="fact__content">
                {{textualData.lS.selector}} 
              </div>
            </div>
            <div class="fact__icon">
              <font-awesome-icon icon="chart-pie" />
            </div>
          </div>
          <div class="fact">
            <div class="fact__header">
              <div class="fact__title">
                Max. Spezifizität
              </div>
              <div class="fact__content">
                {{textualData.hS}} 
              </div>
            </div>
            <div class="fact__icon">
              <font-awesome-icon icon="chart-line" />
            </div>
          </div>
          <div class="fact">
            <div class="fact__header">
              <div class="fact__title">
                Warnungen
              </div>
              <div class="fact__content">
                {{textualData.warnings}} 
              </div>
            </div>
            <div class="fact__icon">
              <font-awesome-icon icon="exclamation-triangle" />
            </div>
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
import ColumnChart from '@/components/ColumnChart.vue';

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileCode, faSitemap, faExclamationTriangle, faChartLine, faChartPie, faQuestionCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFileCode, faSitemap, faExclamationTriangle, faChartLine, faChartPie, faQuestionCircle, faFileAlt)

export default Vue.extend({
  name: 'home',
  components: {
    SpiderChart,
    ProgressRing,
    apexchart: VueApexCharts,
    ColumnChart,
    FontAwesomeIcon,
  },
  computed: {
    size: function() {
      return `${Math.round(this.textualData.cssSize * 100) / 100} KB`
    }
  },
  data() {
    return {
      cqHelp: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mattis eros in orci viverra vulputate. Suspendisse at commodo lacus, laoreet dapibus sapien. Nulla consequat varius purus, vel porttitor lorem eleifend.",
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
          colors: [function({ value, seriesIndex, w }) {
            if(value <= 40) {
                return '#df2121'
            } else if (value > 40 && value < 90) {
                return '#f08e0d'
            } else {
                return '#15c015'
            }
          }]
        },
        labels: ['Average Results'],
      }, // hier kommen die restlichen data props
      columnDataseries: [],
      columnCategories: [],
      textualData: {
        scss: 0,
        cssSize: 0,
        lS: {},
        hS: 0,
        warnings: 0
      }
    };
  },
  methods: {
    infoData() {
      this.textualData.scss = this.results.nesting.length
      this.textualData.cssSize = this.results.stats[0].size / 1000

      this.textualData.lS = this.results.stats[0].rules.selectorByRuleSizes[0]
      this.textualData.hS = this.results.stats[0].selectors.specificity.max
      this.textualData.warnings = this.results.warnings.length
    },
    radialData() {
      const nestings = this.results.nesting

      // nesting
      let percentageOfValidNestings = 0
      let lN = 0
      nestings.forEach(nesting => {
        if(nesting.depth <= 3) lN++
      })
      percentageOfValidNestings = Math.round(((lN / nestings.length) * 100)*100)/100

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
    },
    columnData() {
      let cats = []
      let selectors = []

      this.results.stats[1].selectors.forEach(entry => {
        let file = entry.origin.replace('webpack:///', '')
        const index = cats.indexOf(file)
        if(index < 0) {
          // file noch nicht vorhanden
          cats.push(file)
          selectors.push(1)
        } else {
          // file vorhanden
          selectors[index] += 1
        }
      });


      let declarations = new Array(cats.length).fill(0)
      this.results.stats[0].rules.selectorByRuleSizes.forEach(el => {
        let selectorList = el.selector.split(',')
        const selector = selectorList[0].replace('\n','').trim()

        const hit = this.results.stats[1].selectors.find(entry => entry.selector === selector);

        if(hit) {
          const dIndex = cats.indexOf(hit.origin.replace('webpack:///', ''))
          declarations[dIndex] += el.declarations
        }
      })

      let warnings = new Array(cats.length).fill(0)

      this.results.warnings.forEach(warning => {
        if(warning.resolvedSelector) {
          let selectorList = warning.resolvedSelector.split(',')
          const selector = selectorList[0].replace('\n','').trim()
          const s = this.results.stats[1].selectors.find(entry => entry.selector === selector);

          if(s) {
            const dIndex = cats.indexOf(s.origin.replace('webpack:///', ''))
            warnings[dIndex] += 1
          }
        }
      });

      // speicher faulty selektoren pro stylesheet

      const data = [
        { 
          name: 'Selektoren',
          color: '#176bc0',
          data: selectors
        },
        { 
          name: "Properties",
          data: declarations
        },
        { 
          name: "Warnungen",
          color: '#d84930',
          data: warnings
        }
      ]

      this.columnDataseries = data
      this.columnCategories = cats
    },
    async fetchData() {
      fetch('/results/data.json')
      .then(response => response.json())
      .then(data => {
        this.results = data

        this.radialData()
        this.columnData()
        this.infoData()
      });
    }
  },
  mounted() {
    this.fetchData();
  },
});
</script>

<style scoped>
.cq {
  grid-column: 1 / 4;
  grid-row: 1 / 2;
}

.text-stats {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}

.text-stats .svg-inline--fa {
  font-size: 1.7em;
  color: #c4c4c4;
}
</style>

