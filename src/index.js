import Vue from 'vue';
import App from './components/App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import i18n from './i18n';
import backend from './plugins/backend';
import highcharts from './plugins/highcharts';

Vue.use(BootstrapVue);
Vue.use(backend);
Vue.use(highcharts);

import './assets/css/main.less';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'classlist-polyfill';
import 'js-polyfills/html';

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
