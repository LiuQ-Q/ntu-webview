import Vue from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import i18n from './i18n';
import backend from './backend';

Vue.use(BootstrapVue);
Vue.use(backend);

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
