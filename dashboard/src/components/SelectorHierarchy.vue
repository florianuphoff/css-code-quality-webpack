<template>
  <div class="v-box hierarchy relative">
    <div class="v-box__header">Fehlerbehaftete Selektoren</div>
    <!-- <div class="v-box absolute data-picker">
      <h5 class="v-box__header">Dataset</h5>
      <button class="data-picker__btn general" @click="drawChart('gerenal')" v-bind:class="{ active: dSet === 'g' }" v-on:click="dSet = 'g'">General</button>
      <button class="data-picker__btn duplications" @click="drawChart('duplications')" v-bind:class="{ active: dSet === 'd' }" v-on:click="dSet = 'd'">Duplications</button>
      <button class="data-picker__btn smelly" @click="drawChart('smelly')" v-bind:class="{ active: dSet === 's' }" v-on:click="dSet = 's'">Smelly</button>
    </div> -->
    <div class="v-box__chart selector-chart v-box__content" id="selectorChart"></div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import IntendedTree from '@/assets/IntendedTree'

export default Vue.extend({
  
  name: 'SelectorHierarchy',
  props: {
    chartData: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      dSet: 'g'    
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
.hierarchy {
  grid-column: 1 / 2;
  grid-row: 1 / span 4;
}

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

h5 {
  margin: 0;
  padding: 5px;
  border-bottom: 1px solid #e7e7e7;
}

.active {
  color: #da1b60;
}

.data-picker {
  display: flex;
  flex-flow: column wrap;

  border: 1px solid #e7e7e7;  
  

  border-radius: 0;
  z-index: 2;
  top: 50px;
  right: 10px;

  width: 150px;
}

.data-picker__btn {
  background-color: #ffffff;
  width: 100%;
  height: 20px;
  border: 0;
  border-bottom: 1px solid #e7e7e7;
}

.data-picker__btn:last-of-type {
  border-bottom: 0;
}

.data-picker__btn:hover {
  cursor: pointer;
}

.data-picker__btn:not(.active):hover {
  color: #ff8a00;
}

</style>
