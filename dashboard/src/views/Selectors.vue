<template>
  <div class="selectors">
    <div class="content">
      <SelectorHierarchy v-bind:selectorData=selectorData/>
      <p>Welche Elemente?</p>
      <p>Statistische Diagramme, etc</p>
      <p>Stats</p>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SelectorHierarchy from '@/components/SelectorHierarchy.vue'; // @ is an alias to /src
// import json from '@/results/data.json'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    SelectorHierarchy
  },
  data() {
    return {
      selectorData: {}
    };
  },
  methods: {
    async fetchSpiderChartData() {
      // return well formatted data
    }
  },
  mounted() {
    this.fetchSpiderChartData();
  },
});
</script>
