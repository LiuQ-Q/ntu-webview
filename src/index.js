import Vue from 'vue';
import App from './components/App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import i18n from './i18n';
import backend from './plugins/backend';
import highcharts from './plugins/highcharts';
import d3 from './plugins/d3';
import mixin from './components/mixin';

Vue.use(BootstrapVue);
Vue.use(backend);
Vue.use(highcharts);
Vue.use(d3);

Vue.mixin(mixin);

import './assets/css/main.less';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'js-polyfills/html';
import 'js-polyfills/dom';



new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
