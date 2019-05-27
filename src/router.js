import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './pages/SignIn.vue';
import Home from './pages/Home.vue';

import DashBoard from './components/DashBoard.vue';
import Projects from './components/Projects.vue';

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
        {
          path: '/',
          redirect: '/dashboard'
        },
        {
          path: '/dashboard',
          component: DashBoard
        },
        {
          path: '/projects',
          component: Projects
        }
      ]
    }
  ]
});