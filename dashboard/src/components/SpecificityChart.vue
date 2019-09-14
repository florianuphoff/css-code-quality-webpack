<template>
  <div class="v-box w-2-3 specificity">
    <div class="v-box__header">Spezifizitätsgraph</div>
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
            text: 'Ort im Quellcode'
          }
        },
        tooltip: {
        },
        yAxis: {
          title: {
            text: 'Specificity'
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
        return `Selector: <b>${values[this.x].selector}</b><br>
            Specificity: <b>${yAxis[this.y]}</b>`;
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
