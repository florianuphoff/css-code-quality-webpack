import Vue from 'vue';
import Router from 'vue-router';
import Overview from './views/Overview.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview,
    },
    {
      path: '/warnings',
      name: 'warnings',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "selectors" */ './views/Warnings.vue'),
    },
    {
      path: '/specificity',
      name: 'specificity',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "properties" */ './views/Specificity.vue'),
    },
  ],
});
