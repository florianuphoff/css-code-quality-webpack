<template>
  <div class="v-box w-2-3 heatmap">
    <div class="v-box__header">SCSS Selektorenverteilung</div>
    <div class="v-box__chart  v-box__content">
      <highcharts :options="chartOptions" :updateArgs="updateArgs" ></highcharts>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import {Chart} from 'highcharts-vue'

import Highcharts from 'highcharts'
import heatmap from 'highcharts/modules/heatmap'

heatmap(Highcharts)

export default Vue.extend({
  name: 'Heatmap',
  components: {
    highcharts: Chart
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
      updateArgs: [true, true, {duration: 500}],
      chartOptions: {
        series: [{
          name: 'Selektoren',
          data: this.heatMapData.dataseries,
          borderWidth: 1,
          borderColor: '#aaa'
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
