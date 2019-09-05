<template>
  <div class="chart w-1-2">
    <div id="chart"></div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import * as d3 from "d3";
import IntendedTree from '@/assets/IntendedTree'

export default Vue.extend({
  
  name: 'SelectorHierarchy',
  props: {
    selectorData: {
      type: Object,
      required: true
    },
  },
  computed: {
    chartData() {
      // return formatted data
      return {}
    },
  },
  watch: {
    // update data
    spiderChartData: function (data) {
      this.spiderChartData = data
      this.drawChart(this.chartData)
    }
  },
  methods: {
    drawChart: function(data) {

      let iTree = new IntendedTree();
      iTree.$onInit(data);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
