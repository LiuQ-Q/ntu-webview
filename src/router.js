import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn.vue';
import Home from './components/pages/workbench.vue';

import DashBoard from './components/pages/workbench/DashBoard.vue';
import Projects from './components/pages/workbench/Projects.vue';
import Libraries from './components/pages/workbench/Libraries.vue';
import Vulnerabilities from './components/pages/workbench/Vulnerabilities.vue'
import Licenses from './components/pages/workbench/Licenses.vue';

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
        },
        {
          path: '/libraries',
          component: Libraries
        },
        {
          path: '/vulnerabilities',
          component: Vulnerabilities
        },
        {
          path: '/licenses',
          component: Licenses
        }
      ]
    }
  ]
});