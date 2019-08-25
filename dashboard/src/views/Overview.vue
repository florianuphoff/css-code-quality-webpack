<template>
  <div class="home">
    <div class="content">
      <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>

      <p>Welche Elemente?</p>
      <p>Statistische Diagramme, etc</p>
      <p>Stats</p>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
  },
});
</script>
