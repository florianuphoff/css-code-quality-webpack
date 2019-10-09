<template>
  <div class="main-nav">
    <div class="main-nav__host"><router-link class="main-nav__home" to="/">(S)CSS Code Quality Dashboard</router-link></div>
    <div class="main-nav__link-box"><router-link class="main-nav__link overview" to="/"><font-awesome-icon icon="tachometer-alt" class="nav-icon" /> Dashboard</router-link></div>
    <div class="main-nav__link-box"><router-link class="main-nav__link selectors" to="/selectors"><font-awesome-icon icon="sitemap" class="nav-icon" /> Selektoren</router-link></div>
    <div class="main-nav__link-box"><router-link class="main-nav__link props" to="/specificity"><font-awesome-icon icon="chart-line" class="nav-icon" /> Spezifizität</router-link></div>
  </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSitemap, faSlidersH, faChartLine, faProjectDiagram, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHome, faSitemap, faSlidersH, faChartLine, faProjectDiagram, faTachometerAlt)

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

.main-nav__home {
  text-decoration: none;
  color: #363636;
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
  color: #5eaece;
}

.main-nav__link.overview.router-link-exact-active::after {
  border-color: #5eaece;
}

.selectors:hover, .selectors.router-link-exact-active {
  color: #5086bd;
  
}

.main-nav__link.selectors.router-link-exact-active::after {  
  border-color: #5086bd;
}

.props:hover, .props.router-link-exact-active {
  color: #4c5dbb;
}

.main-nav__link.props.router-link-exact-active::after {
  border-color: #4c5dbb;
}

.main-nav__link.router-link-exact-active::after {
  position: absolute;
  top: 95%;
  width: 97%;
  content: "";
  
  border-width: 2px;
  border-style: solid;
}

.nav-icon {
  font-size: 1.5em;
  margin-bottom: 5px;
}
</style>
