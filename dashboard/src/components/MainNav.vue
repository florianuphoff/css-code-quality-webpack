<template>
  <div class="main-nav">
    <div class="main-nav__host">(S)CSS Code Quality Dashboard</div>
    <div class="main-nav__link-box"><router-link class="main-nav__link overview" to="/"><font-awesome-icon icon="home" /> Dashboard</router-link></div>
    <div class="main-nav__link-box"><router-link class="main-nav__link selectors" to="/selectors"><font-awesome-icon icon="sitemap" /> Selektoren</router-link></div>
    <div class="main-nav__link-box"><router-link class="main-nav__link props" to="/specificity"><font-awesome-icon icon="chart-line" /> Spezifizität</router-link></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSitemap, faSlidersH, faChartLine, faProjectDiagram } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHome, faSitemap, faSlidersH, faChartLine, faProjectDiagram)

export default Vue.extend({
  name: 'MainNav',
  components: {
    FontAwesomeIcon,
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-nav {
  min-height: 80px;

  display: flex;
  flex-flow: row nowrap;


  background-color: #ffffff;
  border-bottom: 1px solid #8d8d8d;
}

.main-nav__host {
  display: flex;
  align-items: center;
  padding: 15px;
  border-right: 1px solid #8d8d8d;
}

.main-nav__link-box {
  min-height: 80px;
  min-width: 90px;
}

.main-nav__link {
  display: flex;
  flex-flow: column wrap;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #2c3e50;
  position: relative;
  text-decoration: none;
  border-right: 1px solid #8d8d8d;
  transition: 0.2s;
}

.overview:hover, .overview.router-link-exact-active {
  color: #1a9fd4;
}

.main-nav__link.overview.router-link-exact-active::after {
  border-color: #1a9fd4;
}

.selectors:hover, .selectors.router-link-exact-active {
  color: #176bc0;
  
}

.main-nav__link.selectors.router-link-exact-active::after {  
  border-color: #176bc0;
}

.props:hover, .props.router-link-exact-active {
  color: #171ac0;
}

.main-nav__link.props.router-link-exact-active::after {
  border-color: #171ac0;
}

.main-nav__link.router-link-exact-active::after {
  position: absolute;
  top: 95%;
  width: 97%;
  content: "";
  
  border-width: 2px;
  border-style: solid;
}
</style>
