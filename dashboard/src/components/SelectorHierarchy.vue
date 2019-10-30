<template>
  <div :class="classList">
    <div class="v-box__header">
      {{ heading }}
      <div class="tooltip-icon" 
        v-tooltip='{content: tooltipText, placement: "right", targetClasses: ["cq-tooltip"]}' 
      >
        <font-awesome-icon icon="question-circle" />
      </div>
    </div>
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
    <div v-if="type === 'partialdupl'" class="pdupl">
      <div class="pdupl-legend legend">
        <h5 class="v-box__header legend-header">Details</h5>
        <div class="legend-content d-legend">
          <div class="placeholder">
            Über ein Element hovern, um Informationen zu sehen.
          </div>
          <div class="d-content"></div>
        </div>
      </div>
    </div>
    <div class="v-box__chart selector-chart v-box__content" :id="type"></div>
  </div>
</template>


<script>
import Vue from 'vue';
import IntendedTree from '@/assets/IntendedTree'

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHourglassHalf, faCode, faMagic, faChartLine, faCopy, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHourglassHalf, faCode, faMagic, faChartLine, faCopy, faQuestionCircle)

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
      dSet: 'g',   
    }
  },
  computed: {
    classList() {
      return `${this.type} v-box`
    },
    heading() {
      let headline = ''
      if(this.type === 'fulldupl') {
        headline = 'Vollständige Duplikationen'
      } else if(this.type === 'partialdupl') {
        headline = 'Teilduplizierte Selektoren'
      } else {
        headline = 'Fehlerbehaftete Selektoren'
      }
      return headline
    },
    tooltipText() {
      let tip = ''
      if(this.type === 'fulldupl') {
        tip = `
        In diesem Graphen befinden Selektoren, die unabhängig des Selektornamens vollständig dupliziert sind. Die Reihenfolge der Deklarationen sind irrelevant.
        <br/>Ein Selektor besteht aus mindestens einem compound selector. Ein compound-Selektor ist eine Verkettung von mindestens einem einfachen Selektor (Tag, Klasse, ID, Attribut, etc.).
        <br/>Eine vollständige Duplizierung sollte aufgelöst werden, indem die unterschiedlichen Selektoren vereinheitlicht werden.
        <br/>Es werden betroffene Selektoren hervorgehoben, wenn der Zeiger der Maus über einen Selektor steht.
        <br/><br/>
        <br/>Eine Duplizierung wird immer im letzten compound-Selektor angezeigt, sodass im Graphen manche Punkte weiß ausgefüllt sind.
        Beispiel eines Duplikates: <code>.foo .bar</code><br/>
        Es gibt zwei compound-Selektoren: <code>.foo</code> und <code>.bar</code> <br/>
        <code>.bar</code> wird im Graphen als Kindelement von <code>.foo</code> dargestellt und ist mit rot hervorgehoben.
        <br/><br/>
        Die Reihenfolge der Selektoren basiert auf den generierten Warnungen.
        `
      } else if(this.type === 'partialdupl') {
        tip = `
        In diesem Graphen befinden sich Selektoren, deren compound-Selektoren oder Deklarationen dupliziert sind. Die Duplikate müssen nicht aufgelöst werden, sondern erfordern eine genaue Betrachtung, ob sich eine Konsolidierung lohnt.
        <br/><br/>
        Es gibt verschiedene Typen einer Duplizierung:
        <br/><span style="color:#f88f17">Typ 1</span>: Eine Deklaration ist vollständig dupliziert (orange)
        <br/>Typ 2: Dieser Typ wird derzeitig nicht unterstützt.
        <br/><span style="color:#f5c423">Typ 3</span>: Eine Deklaration existiert als shorthand-Property und ausgeschriebenen Properties (gelb)
        <br/><span style="color:#1ee2d8">Typ 4</span>: Eine Deklaration ist gleich einem Teil einer shorthand-Property. Gültig nur im selben Selektor, um false-positives zu vermeiden (türkis)
        <br/><span style="color:#4cd118">Typ 5</span>: Eine shorthand-Property ist gleich einem Teil einer shorthand-Property. Gültig nur im selben Selektor, um false-positives zu vermeiden (grün)
        <br/><span style="color:#153291">Blau</span> markierte Selektoren bedeuten, dass der Selektorname mehrfach genutzt wurde.
        <br/><br/>
        Ein Selektor kann mehrere Duplikatstypen aufweisen. Es wird immer der allgemeinere Duplikatstyp farblich markiert (Typ1 - Typ 5).
        Es werden betroffene Selektoren hervorgehoben, wenn der Zeiger der Maus über einen Selektor steht.
        <br/><br/>
        Die Reihenfolge der Selektoren basiert auf den generierten Warnungen.
        `
      } else {
        // warnings
        tip = `
        In diesem Graph befinden sich Selektoren mit Warnungen. 
        Die Warnungen sind zur schnellen Identifizerung in fünf Kategorien unterteilt.
        Informationen zur Warnung erscheinen, wenn die Maus über ein Symbol fährt.
        <br/><br/>
        Die Reihenfolge der Selektoren basiert auf den generierten Warnungen.
        `
      }
      return tip
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
        case 'fulldupl':
          iTree.$onInit(this.chartData.fulldupl, this.type)
          break;
        case 'partialdupl':
          iTree.$onInit(this.chartData.duplications, this.type)
          break;
        case 'warnings':
          iTree.$onInit(this.chartData.smelly, this.type)
          break;
        default:
          // fulldupl
          iTree.$onInit(this.chartData.fulldupl, this.type)
      }
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.fulldupl {
  grid-column: 1 / 2;
  grid-row: 1 / span 3;
}

.partialdupl {
  position: relative;
  grid-column: 2 / 3;
  grid-row: 1 / span 3;
}

.warnings {
  position: relative;
  grid-column: 3 / 4;
  grid-row: 1 / span 3;
}

.selector-chart .node circle {
  stroke: #000000;
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
  /* fill: #858484; */
  fill: #c03118;
}

.spec,
.spec path {
  /* fill: #858484; */
  fill: #c03118;
}

.style,
.style path {
  /* fill: #858484; */
  fill: #c03118;  
}

.performance,
.performance path {
  /* fill: #858484; */
  fill: #c03118;
}

.dupl,
.dupl path {
  /* fill: #858484; */
  fill: #c03118;
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

.pdupl {
  position: absolute;
  right: 2%;
  top: 50px;
  height: 100%;
}

.pdupl-legend {
  position: sticky;
  top: 30px !important;
  left: 0 !important;
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

.d-legend {
  font-size: 12px;
}

.typeundefined {
  fill: #153291 !important;
}

.type5 {
  fill: #4cd118 !important;
}

.type4 {
  fill: #1ee2d8 !important;
}

.type3 {
  fill: #f5c423 !important;
}

.type0 {
  fill: #ce1919 !important;  
}

.type1 {
  fill: #f88f17 !important; 
}

.darken {
  fill-opacity: 0.1;
}

.darken text {
  fill-opacity: 0.4 !important;
}

.duplHover {
  fill-opacity: 1 !important;
}

.duplHover text {
  fill-opacity: 1 !important;
}

</style>
