<template>
  <div class="v-box w-1-2 relative">
    <div class="v-box__header">Fehlerbehaftete Selektoren</div>
    <div class="v-box absolute data-picker">
      <button class="data-picker__btn" @click="drawChart('gerenal')">General</button>
      <button class="data-picker__btn" @click="drawChart('duplications')">Duplications</button>
      <button class="data-picker__btn" @click="drawChart('smelly')">Smelly</button>
    </div>
    <div class="v-box__chart selector-chart" id="selectorChart"></div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import * as d3 from "d3";
import IntendedTree from '@/assets/IntendedTree'

export default Vue.extend({
  
  name: 'SelectorHierarchy',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },

  watch: {
    chartData: {
      handler: function(data) {
        this.chartData = data
        this.drawChart('general')
      },
      deep: true
    }
  },
  methods: {
    drawChart: function(type) {
      const chart = document.querySelector('#selectorChart')
      if(chart.childNodes.length) {
        chart.removeChild(chart.childNodes[0])
      }
      let d = {}
      switch(type) {
        case 'general':
          d = this.chartData.general
          break;
        case 'duplications':
          d = this.chartData.duplications
          break;
        case 'smelly':
          d = this.chartData.smelly
          break;
        default:
          // general
          d = this.chartData.general
      }
      let iTree = new IntendedTree();
      iTree.$onInit(d)
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.selector-chart .node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 1px;
}

.selector-chart .node text {
  font: 14px sans-serif;
}

.selector-chart .link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1px;
}
</style>
