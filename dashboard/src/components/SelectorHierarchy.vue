<template>
  <div :class="classList">
    <div class="v-box__header">{{ heading }}</div>
    <div v-if="type === 'warnings'" class="absolute legend">
      <h5 class="v-box__header legend-header">Legende</h5>
      <div class="legend-content">
        <div class="legend-box">
          <font-awesome-icon icon="hourglass-half" class="performance legend-icon" /> : Performance
        </div>
        <div class="legend-box">
          <font-awesome-icon icon="code" class="syntax legend-icon" /> : Syntax
        </div>
        <div class="legend-box">      
          <font-awesome-icon icon="chart-line" class="spec legend-icon" /> : Spezifizität
        </div>
        <div class="legend-box">
          <font-awesome-icon icon="magic" class="style legend-icon" /> : Style
        </div>
        <div class="legend-box">
          <font-awesome-icon icon="copy" class="dupl legend-icon" /> : Duplizierung
        </div>
      </div>
    </div>
    <div class="v-box__chart selector-chart v-box__content" :id="type"></div>
  </div>
</template>


<script>
import Vue from 'vue';
import IntendedTree from '@/assets/IntendedTree'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHourglassHalf, faCode, faMagic, faChartLine, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHourglassHalf, faCode, faMagic, faChartLine, faCopy)

export default Vue.extend({
  name: 'SelectorHierarchy',
  components: {
    FontAwesomeIcon    
  },
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
  grid-row: 1 / span 3;
}

.duplications {
  grid-column: 2 / 3;
  grid-row: 1 / span 3;
}

.warnings {
  position: relative;
  grid-column: 3 / 4;
  grid-row: 1 / span 3;
}

.selector-chart .node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 1px;
}

.selector-chart .node text {
  font: 14px sans-serif;
}

.selector-chart .node text.fa-icon {
  font-family: "Font Awesome 5 Free";
}

.syntax,
.syntax path {
  fill: #d84930;
}

.spec,
.spec path {
  fill: #171ac0;
}

.style,
.style path {
  fill: #da1b60;  
}

.performance,
.performance path {
  fill: #1a9fd4;
}

.dupl,
.dupl path {
  fill: #176bc0;
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

.legend {
  display: flex;
  flex-flow: column wrap;
  width: 150px;
  right: 2%;
  top: 50px;
  border: 1px solid #e7e7e7;
}

.legend-box {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
}

.legend-content {
  padding: 2px 5px;
}

.legend-header {
  margin-bottom: 5px;
}

.legend-icon {
  margin-right: 10px;
}

</style>
