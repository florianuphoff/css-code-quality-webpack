<template>
  <svg :height="radius * 2" :width="radius * 2">
       <circle
         stroke="#ff8a00"
         :stroke-dasharray="circumference + ' ' + circumference"
         :style="{ strokeDashoffset: strokeDashoffset }"
         :stroke-width="stroke"
         fill="transparent"
         :r="normalizedRadius"
         :cx="radius"
         :cy="radius"
      />
    </svg>
</template>


<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'ProgressRing',
  props: {
    radius: Number,
    percentage: Number,
    stroke: Number,
    type: String
  },
  data() {
    const normalizedRadius = this.radius - this.stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return {
      normalizedRadius,
      circumference
    };
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - this.percentage / 100 * this.circumference;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
