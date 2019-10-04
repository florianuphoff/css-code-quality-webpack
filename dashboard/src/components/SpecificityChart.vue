<template>
  <div class="v-box w-2-3 specificity">
    <div class="v-box__header">CSS Spezifizitätsgraph</div>
    <div class="v-box__chart  v-box__content spChart">
      <highcharts :options="chartOptions" :updateArgs="updateArgs" ></highcharts>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import {Chart} from 'highcharts-vue'
import Highcharts from 'highcharts'

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
    },
    selectorList: {
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
    },
    selectorList(data) {
      this.selectorList = data
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
          height: 500,
        },
        title: {
          text: ''
        },
        xAxis: {
          title: {
            text: 'Zeile im Quellcode'
          },
          min: 0,
        },
        tooltip: {
        },
        yAxis: {
          title: {
            text: 'Spezifizität'
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
          },
          series: {
            point: {
              events: {
                mouseOut: function (e) {
                  const chartToSync = Highcharts.charts[1];
                  const points = chartToSync.container.querySelectorAll('.point-hover')
                  points.forEach(point => {
                    point.classList.remove('point-hover')
                  })
                }
              }
            },
            pointStart: 0,
          }
        },
      }
    }
  },
  methods: {
    tooltipCallback(values, yAxis) {
      this.chartOptions.tooltip.formatter = function() {
        // wir können mehrere Treffer bei X haben, da mehrere Selektoren auf einer Zeile liegen können
        const hits = values.flatMap((entry, i) => entry.startsAt === this.x ? entry : []);
        const chartToSync = Highcharts.charts[1];
        const xaxis = [1,2,3,10,11,20,21,30,31,100,101,'zu spezifisch']

        let specificity = yAxis[this.y]
        const depth = hits[0].depth

        if ((specificity > 2 && specificity < 10) 
          || (specificity > 11 && specificity < 20) 
          || (specificity > 21 && specificity < 30) 
          || (specificity > 31 && specificity < 100) 
          || (specificity >= 102)) {
          specificity = 'zu spezifisch'
        }

        const xindex = xaxis.indexOf(specificity)

        const point = chartToSync.series[0].points.find(entry => entry.x === xindex && entry.y === depth);

        if(point) point.graphic.element.classList.add('point-hover')

        // ! point kann null sein denn -> Mixins werden durch das Plugin nicht aufgelöst 
        // ! -> es wird ja vor Compilezeit analysiert und da ist es nur ein Aufruf und keine Verschachtelung

        if(hits.length > 1) {
          let template = `<b>Mehrzeilige Selektoren: </b>`
          hits.forEach(entry => {
            template += `${entry.selector}, `
          });
          return `${template}<br>
                  <b>Datei: </b>${hits[0].origin.replace('webpack:///', '')}<br>
                  <b>Zeile: </b>${hits[0].startsAt}<br>
                  <b>Spezifizität: </b>${yAxis[this.y]}<br>
                  <b>Verschachtelung: </b>${hits[0].depth}`;
        }

        return `<b>Selektor: </b>${hits[0].selector}<br>
                <b>Datei: </b>${hits[0].origin.replace('webpack:///', '')}<br>
                <b>Zeile: </b>${hits[0].startsAt}<br>
                <b>Spezifizität: </b>${yAxis[this.y]}<br>
                <b>Verschachtelung: </b>${hits[0].depth}`;
      }
    },
    addListener() {
      document.querySelector('.selectors').addEventListener('click', () => {
        console.log("clicked")        
        // for( var i = 0; i < Highcharts.charts.length; i++){ 
        //   if ( Highcharts.charts[i] === undefined) {
        //     Highcharts.charts.splice(i, 1); 
        //   }
        // }
        // console.log(Highcharts.charts)
      })
      document.querySelector('.overview').addEventListener('click', () => {
        console.log("clicked")
        // for( var i = 0; i < Highcharts.charts.length; i++){ 
        //   if ( Highcharts.charts[i] === undefined) {
        //     Highcharts.charts.splice(i, 1); 
        //   }
        // }
        // console.log(Highcharts.charts)
      })
    }
  },
  mounted() {
    console.log("called")
    console.log(Highcharts.charts)
    for( var i = 0; i < Highcharts.charts.length; i++){ 
      if ( Highcharts.charts[i] === undefined || Object.keys(Highcharts.charts[i]).length === 0) {
        Highcharts.charts.splice(i, 1); 
        i--;
      }
    }
    this.chartOptions.chart.width = this.clientWidth
    this.addListener()
  }
});
</script>

<style scoped>
.specificity {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

</style>
