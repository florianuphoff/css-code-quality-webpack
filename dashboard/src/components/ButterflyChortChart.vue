<template>
  <div class="v-box w-2-3">
    <div class="v-box__header">Mixin-Extend-Benutzung</div>
    <div class="v-box__chart sass-usage-chart" id="sassUsageChart"></div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import ButterflyChord from '@/assets/ButterflyChord'

export default Vue.extend({
  
  name: 'ButterflyChortChart',
  props: {
    chordData: {
      type: Array,
      required: true
    }
  },
  // data() {
    
  // },
  watch: {
  },
  methods: {
    drawChart: function(type) {
      console.log("IMPLEMENTATION MISSING")

      ButterflyChord.draw('#sassUsageChart', [], {})
    }
  },
  mounted() {
    this.drawChart()
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
