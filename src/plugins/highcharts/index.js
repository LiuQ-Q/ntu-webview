import Highcharts from './Highcharts.vue';
import NetworkGraph from './NetworkGraph.vue';

export default function install(Vue) {
  Vue.component('highcharts', Highcharts);
  Vue.component('networkgraph', NetworkGraph);
}