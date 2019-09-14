<template>
  <div class="v-box w-1-3">
    <div class="v-box__header">Komplexität</div>
    <div class="v-box__chart v-box__content" id="chart"></div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import * as d3 from "d3";
import RadarChart from '@/assets/radarchart.js'

export default Vue.extend({
  
  name: 'SpiderChart',
  props: {
    spiderChartData: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      cfg: {
        w: 250,
        h: 250,
        maxValue: 100,
        levels: 5,
        ExtraWidthX: 170,
        ExtraWidthY: 110
      }
    }
  },
  computed: {
    chartData() {
      return [[{
        area: "clean props", value: this.spiderChartData[0]
      }, {
        area: "valid nesting", value: this.spiderChartData[1]
      }, {
        area: "unspecific selectors", value: this.spiderChartData[2]
      }, {
        area: "unique selectors", value: this.spiderChartData[3]        
      }]]
    },
  },
  watch: {
    spiderChartData: function (data) {
      this.spiderChartData = data
      this.drawChart(this.chartData)
    }
  },
  methods: {
    drawChart: function(data) {
     RadarChart.draw("#chart", data, this.cfg)
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* #chart {
  position: absolute;
	top: 50px;
	left: 100px;
} */
.axis {
	font: 15px sans-serif;
}
.axis path,
.axis line {
  fill: none;
  stroke: #D4D8DA;
  stroke-width: 2px;
  shape-rendering: crispEdges;
}
</style>
