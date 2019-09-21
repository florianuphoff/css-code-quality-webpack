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
    // dataseries: {
    //   type: Array,
    //   required: true
    // },
    // specificityValues: {
    //   type: Array,
    //   required: true
    // },
    // yAxis: {
    //   type: Array,
    //   required: true
    // },
    // xAxis: {
    //   type: Array,
    //   required: true
    // }
  },
  watch: {
    heatMapData: {
      handler: function(data) {
        this.heatMapData = data

        console.log(data)
        console.log("HEATMAP: Data updated")
        this.chartOptions.xAxis.categories = this.heatMapData.xAxis
        this.chartOptions.yAxis.max = this.heatMapData.yAxis      
        this.chartOptions.series[0].data = this.heatMapData.dataseries
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
          borderColor: '#666666'
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
            [0, '#ffffff'],
            [0.05, '#62c0ff'],
            [0.15, '#1bda25'],
            [0.9, '#da1b60']
          ],
          min: 0,
        },
      }
    }
  },
  methods: {
    tooltipCallback(values, yAxis) {
      this.chartOptions.tooltip.formatter = function() {
        // wir können mehrere Treffer bei X haben, da mehrere Selektoren auf einer Zeile liegen können
        const hits = values.flatMap((entry, i) => entry.startsAt === this.x ? entry : []);

        if(hits.length > 1) {
          let template = `<b>Mehrzeilige Selektoren: </b>`
          hits.forEach(entry => {
            template += `${entry.selector}, `
          });
          return `${template}<br>
                  <b>Datei: </b>${hits[0].origin.replace('webpack:///', '')}<br>
                  <b>Zeile: </b>${hits[0].startsAt}</b><br>
                  <b>Spezifizität: </b>${yAxis[this.y]}`;
        }

        return `<b>Selektor: </b>${hits[0].selector}<br>
                <b>Datei: </b>${hits[0].origin.replace('webpack:///', '')}<br>
                <b>Zeile: </b>${hits[0].startsAt}</b><br>
                <b>Spezifizität: </b>${yAxis[this.y]}`;
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
  height: 100%;
}

</style>
