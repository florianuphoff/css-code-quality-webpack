<template>
  <div class="v-box w-1-2">
    <div class="v-box__header">Fehlerbehaftete Selektoren</div>
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
    selectorData: function (data) {
      this.selectorData = data
      this.drawChart(this.selectorData)
    }
  },
  methods: {
    drawChart: function(data) {
      let iTree = new IntendedTree();
      iTree.$onInit(data)
    }
  }
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
