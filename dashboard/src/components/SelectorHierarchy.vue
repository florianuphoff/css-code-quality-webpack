<template>
  <div :class="classList">
    <div class="v-box__header">{{ heading }}</div>
    <!-- <div class="v-box absolute data-picker">
      <h5 class="v-box__header">Dataset</h5>
      <button class="data-picker__btn general" @click="drawChart('gerenal')" v-bind:class="{ active: dSet === 'g' }" v-on:click="dSet = 'g'">General</button>
      <button class="data-picker__btn duplications" @click="drawChart('duplications')" v-bind:class="{ active: dSet === 'd' }" v-on:click="dSet = 'd'">Duplications</button>
      <button class="data-picker__btn smelly" @click="drawChart('smelly')" v-bind:class="{ active: dSet === 's' }" v-on:click="dSet = 's'">Smelly</button>
    </div> -->
    <div class="v-box__chart selector-chart v-box__content" :id="type"></div>
  </div>
</template>


<script>
import Vue from 'vue';
import IntendedTree from '@/assets/IntendedTree'

export default Vue.extend({
  
  name: 'SelectorHierarchy',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dSet: 'g'    
    }
  },
  computed: {
    classList() {
      return `${this.type} v-box`
    },
    heading() {
      let headline = ''
      if(this.type === 'general') {
        headline = 'CSS Selektorbaum'
      } else if(this.type === 'duplications') {
        headline = 'Duplizierte Selektoren'
      } else {
        // warnings
        headline = 'Fehlerbehaftete Selektoren'
      }
      return headline
    }
  },
  watch: {
    chartData: {
      handler: function(data) {
        this.chartData = data
        this.drawChart()
      },
      deep: true
    }
  },
  methods: {
    drawChart: function() {
      let iTree = new IntendedTree();
      
      switch(this.type) {
        case 'general':
          iTree.$onInit(this.chartData.general, this.type)
          break;
        case 'duplications':
          iTree.$onInit(this.chartData.duplications, this.type)
          break;
        case 'warnings':
          iTree.$onInit(this.chartData.smelly, this.type)
          break;
        default:
          // general
          iTree.$onInit(this.chartData.general, this.type)
      }
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.general {
  grid-column: 1 / 2;
  grid-row: 1 / span 4;
}

.duplications {
  grid-column: 2 / 3;
  grid-row: 1 / span 4;
}

.warnings {
  grid-column: 3 / 4;
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
