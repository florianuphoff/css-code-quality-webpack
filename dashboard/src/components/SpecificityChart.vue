<template>
  <div class="v-box w-2-3 specificity">
    <div class="v-box__header">CSS Spezifitätsgraph
      <div class="tooltip-icon" 
        v-tooltip='{content: help, placement: "right", targetClasses: ["cq-tooltip"],}' 
      >
        <font-awesome-icon icon="question-circle" />
      </div>
    </div>
    <div class="v-box__chart  v-box__content spChart">
      <highcharts :options="chartOptions" :updateArgs="updateArgs" ></highcharts>
    </div>
  </div>
</template>


<script>
import Vue from 'vue';
import {Chart} from 'highcharts-vue'
import Highcharts from 'highcharts'

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faQuestionCircle)


export default Vue.extend({
  name: 'SpecificityChart',
  components: {
    highcharts: Chart,
    FontAwesomeIcon
  },
  props: {
    dataseries: {
      type: Array,
      required: true
    },
    specificityValues: {
      type: Array,
      required: true
    },
    yAxis: {
      type: Array,
      required: true
    },
    selectorList: {
      type: Array,
      required: true
    }
  },
  watch: {
    dataseries(data) {
      this.dataseries = data
      this.chartOptions.series[0].data = this.dataseries      
    },
    specificityValues(data) {
      this.specificityValues = data
      this.tooltipCallback(this.specificityValues, this.yAxis)      
    },
    yAxis(data) {
      this.yAxis = data
      this.chartOptions.yAxis.categories = this.yAxis      
    },
    selectorList(data) {
      this.selectorList = data
    }
  },
  computed: {
    clientWidth() {
      return document.querySelector('.specificity').clientWidth
    },
  },
  data() {
    return {
      help: `
      Der Spezifitätsgraph nach Harry Roberts zeigt den Verlauf der Spezifität zur Zeile im Quellcode. 
      <br/><br/>
      Leichte Auf- und Abstiege sind üblich. 
      Dennoch sollte der Graph einen klaren Aufwärtstrend haben. Je weiter am Ende Selektoren mit hoher Spezifität stehen, desto geringer können Seiteneffekte ausfallen.
      <br/>
      Frühe Spitzen im Graph können auf eine Fehlkonzeption im CSS Code deuten und Seiteneffekte wie Überschattungen von Selektoren durch eine sehr hohe Spezifität verursachen.
      <br/><br/>
      Selektoren sind zu spezifisch, wenn die Spezifität zwischen 2 und 10, 11 und 20, 31 und 100 oder über 101 liegt.
      <br/><br/>
      Maus gedrückt halten und über Zeilen ziehen, um die Auswahl zu vergrößern. (Zooming)
      `,
      updateArgs: [true, true, {duration: 500}],
      chartOptions: {
        series: [{
          name: 'Selektoren',
          color: '#da1b60',
          data: this.dataseries,
          lineWidth: 1,
          animation: false
        }],
        chart: {
          type: 'scatter',
          zoomType: 'x',
          spacingBottom: 15,
          spacingTop: 10,
          spacingLeft: 10,
          spacingRight: 10,
          height: 500,
        },
        title: {
          text: ''
        },
        xAxis: {
          title: {
            text: 'Zeile im Quellcode'
          },
          min: 0,
        },
        tooltip: {
        },
        yAxis: {
          title: {
            text: 'Spezifität'
          },
          categories: [1,2,10,11,20,21,40,41,200],
          labels: {
            align: 'right'
          },
          tickmarkPlacement: 'on',
          endOnTick: false,
          maxPadding: 0
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 2,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                lineWidthPlus: 0
              }
            }
          },
          series: {
            point: {
              events: {
                mouseOut: function (e) {
                  const chartToSync = Highcharts.charts.find(chart => {
                    if(chart) {
                      if(chart.renderTo.parentNode.classList.contains('heatmap-node')) return chart
                    }
                  })
                  const points = chartToSync.container.querySelectorAll('.point-hover')
                  points.forEach(point => {
                    point.classList.remove('point-hover')
                  })
                }
              }
            },
            pointStart: 0,
          }
        },
      }
    }
  },
  methods: {
    tooltipCallback(values, yAxis) {
      this.chartOptions.tooltip.formatter = function() {
        // wir können mehrere Treffer bei X haben, da mehrere Selektoren auf einer Zeile liegen können
        const hits = values.flatMap((entry, i) => entry.startsAt === this.x ? entry : []);
        const chartToSync = Highcharts.charts.find(chart => {
          if(chart) {
            if(chart.renderTo.parentNode.classList.contains('heatmap-node')) return chart
          }
        })
        const xaxis = [1,2,3,10,11,20,21,30,31,100,101,'zu spezifisch']

        let specificity = yAxis[this.y]
        const depth = hits[0].depth

        if ((specificity > 2 && specificity < 10) 
          || (specificity > 11 && specificity < 20) 
          || (specificity > 21 && specificity < 30) 
          || (specificity > 31 && specificity < 100) 
          || (specificity >= 102)) {
          specificity = 'zu spezifisch'
        }

        const xindex = xaxis.indexOf(specificity)

        const point = chartToSync.series[0].points.find(entry => entry.x === xindex && entry.y === depth);

        if(point) point.graphic.element.classList.add('point-hover')

        // ! point kann null sein denn -> Mixins werden durch das Plugin nicht aufgelöst 
        // ! -> es wird ja vor Compilezeit analysiert und da ist es nur ein Aufruf und keine Verschachtelung

        if(hits.length > 1) {
          let template = `<b>Mehrzeilige Selektoren: </b>`
          hits.forEach(entry => {
            template += `${entry.selector}, `
          });
          return `${template}<br>
                  <b>Datei: </b>${hits[0].origin.replace('webpack:///', '')}<br>
                  <b>Zeile: </b>${hits[0].startsAt}<br>
                  <b>Spezifität: </b>${yAxis[this.y]}<br>
                  <b>Verschachtelung: </b>${hits[0].depth}`;
        }

        return `<b>Selektor: </b>${hits[0].selector}<br>
                <b>Datei: </b>${hits[0].origin.replace('webpack:///', '')}<br>
                <b>Zeile: </b>${hits[0].startsAt}<br>
                <b>Spezifität: </b>${yAxis[this.y]}<br>
                <b>Verschachtelung: </b>${hits[0].depth}`;
      }
    },
  },
  mounted() {
    this.chartOptions.chart.width = this.clientWidth
  }
});
</script>

<style scoped>
.specificity {
  grid-column: 1 / 4;
  grid-row: 1 / 2;
}

</style>
