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

export default Vue.extend({
  name: 'Heatmap',
  components: {
    highcharts: Chart
  },
  props: {
    dataseries: {
      type: Array,
      required: true
    },
    // specificityValues: {
    //   type: Array,
    //   required: true
    // },
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
    // specificityValues(data) {
    //   this.specificityValues = data
    //   // this.tooltipCallback(this.specificityValues, this.yAxis)      
    // },
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
          data: this.dataseries,
          borderWidth: 1,
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
          categories: [1,2,10,11,20,21,40,41,200],
          tickmarkPlacement: 'on',
          endOnTick: false,
          maxPadding: 0
        },
        tooltip: {
        },
        yAxis: {
          title: {
            text: 'Verschachtelungstiefe'
          },
          labels: {
            align: 'right'
          },
          max: this.yAxis,
          tickAmount: 1
        },
        colorAxis: {
          min: 0,
          minColor: '#62c0ff',
          maxColor: '#da1b60'
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
