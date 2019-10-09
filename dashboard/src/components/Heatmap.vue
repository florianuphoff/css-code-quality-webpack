<template>
  <div class="v-box w-2-3 heatmap">
    <div class="v-box__header">SCSS Selektorenverteilung
      <div class="tooltip-icon" 
        v-tooltip='{content: help, placement: "right", targetClasses: ["cq-tooltip"],}' 
      >
        <font-awesome-icon icon="question-circle" />
      </div>
    </div>
    <div class="v-box__chart  v-box__content heatmap-node">
      <highcharts :options="chartOptions" :updateArgs="updateArgs" ></highcharts>
    </div>
  </div>
</template>


<script>
import Vue from 'vue';
import {Chart} from 'highcharts-vue'

import Highcharts from 'highcharts'
import heatmap from 'highcharts/modules/heatmap'

heatmap(Highcharts)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faQuestionCircle)

export default Vue.extend({
  name: 'Heatmap',
  components: {
    highcharts: Chart,
    FontAwesomeIcon
  },
  props: {
    heatMapData: {
      type: Object,
      required: true
    }
  },
  watch: {
    heatMapData: {
      handler: function(data) {
        this.heatMapData = data

        this.chartOptions.xAxis.categories = this.heatMapData.xAxis
        this.chartOptions.yAxis.max = this.heatMapData.yAxis      
        this.chartOptions.series[0].data = this.heatMapData.dataseries
        this.tooltipCallback(this.heatMapData.xAxis)
      },
      deep: true
    }
    // dataseries(data) {
    //   this.dataseries = data
    // },
    // // specificityValues(data) {
    // //   this.specificityValues = data
    // //   // this.tooltipCallback(this.specificityValues, this.yAxis)
    // // },
    // yAxis(data) {
    //   this.yAxis = data
    // },
    // xAxis(data) {
    //   this.xAxis = data
    // }
  },
  computed: {
    clientWidth() {
      return document.querySelector('.specificity').clientWidth
    },
  },
  data() {
    return {
      help: 'Alle SCSS Selektoren werden in der Heatmap gruppiert dargestellt. Die Kategorie "zu spezifisch" ergibt sich aus den übrigen möglichen Werten der Spezifizität. Selektoren aus dem Spezifizitätsgraphen werden hier hervorgehoben. Häufig entsteht eine hohe Spezifizität durch den intensiven Gebrauch der Verschachtelung in SCSS.',
      updateArgs: [true, true, {duration: 500}],
      chartOptions: {
        series: [{
          name: 'Selektoren',
          data: this.heatMapData.dataseries,
          borderWidth: 1,
          borderColor: '#aaa',
          states: {
            hover: {
              color: 'rgba(43, 145, 43, 0.5)',
            }
          }
        }],
        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },
        title: {
          text: ''
        },
        xAxis: {
          title: {
            text: 'Spezifizität'
          },
          categories: this.heatMapData.xAxis,
        },
        tooltip: {
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
        yAxis: {
          title: {
            text: 'Verschachtelungstiefe'
          },
          labels: {
            align: 'right'
          },
          max: this.heatMapData.yAxis
        },
        colorAxis: {
          stops: [
            // [0, '#ffffff'],
            [0, '#ffffff'],
            [0.15, '#3060cf'],
            [0.30, '#fffbbc'],
            [0.9, '#c4463a']
          ],
          min: 0,
        },
      }
    }
  },
  methods: {
    tooltipCallback(xaxis) {
      this.chartOptions.tooltip.formatter = function() {
        return `<b>Selektoren: </b>${this.point.value}<br>
                <b>Spezifizität: </b>${xaxis[this.point.x]}<br>
                <b>Verschachtelungstiefe: </b>${this.y}`;
      }
    },
  },
  mounted() {
    this.chartOptions.chart.width = this.clientWidth
  }
});
</script>

<style scoped>
.heatmap {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
}

</style>
