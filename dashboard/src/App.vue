<template>
  <div id="app">
    <MainNav/>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue';
import MainNav from '@/components/MainNav.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'app',
  components: {
    MainNav,
  },
});
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
