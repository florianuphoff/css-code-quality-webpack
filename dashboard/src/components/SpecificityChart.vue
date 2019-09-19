<template>
  <div class="v-box w-2-3 specificity">
    <div class="v-box__header">CSS Spezifizitätsgraph</div>
    <div class="v-box__chart  v-box__content">
      <highcharts :options="chartOptions" :updateArgs="updateArgs" ></highcharts>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import {Chart} from 'highcharts-vue'

export default Vue.extend({
  name: 'SpecificityChart',
  components: {
    highcharts: Chart
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
    xAxis: {
      type: Number,
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
    xAxis(data) {
      this.xAxis = data
      this.chartOptions.xAxis.max = this.xAxis
    }
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
          height: 700
        },
        title: {
          text: ''
        },
        xAxis: {
          title: {
            text: 'Zeile im Quellcode'
          },
          max: this.xAxis,
          tickAmount: 10
        },
        tooltip: {
        },
        yAxis: {
          title: {
            text: 'Spezifizität'
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
.specificity {
  height: 100%;
}

</style>
