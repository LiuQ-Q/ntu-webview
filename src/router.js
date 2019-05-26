import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './pages/Home.vue';
import SignIn from './pages/SignIn.vue';

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/signin',
      component: SignIn
    },
    {
      path: '/home',
      component: Home,
      children: [
        
      ]
    }
  ]
});