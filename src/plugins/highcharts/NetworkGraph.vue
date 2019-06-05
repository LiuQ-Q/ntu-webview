<template>
  <div id="container"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsDrilldown from 'highcharts/modules/drilldown';
// import Highcharts3D from 'highcharts/highcharts-3d';
import NetworkGraph from 'highcharts/modules/networkgraph';

HighchartsMore(Highcharts);
// HighchartsDrilldown(Highcharts);
// Highcharts3D(Highcharts);
NetworkGraph(Highcharts);

export default {
  props: ['options'],
  name: 'ngraph',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart();
  },
  watch: {
    options: {
      handler(val) {
        this.chart.destroy();
        this.initChart();
      }
    }
  },
  methods: {
    initChart() {
      Highcharts.addEvent(
        Highcharts.seriesTypes.networkgraph,
        'afterSetOptions',
        function (e) {
          var colors = Highcharts.getOptions().colors,
            i = 0,
            nodes = {};
          e.options.data.forEach(function (link) {
            if (link[0] === 'war_test') {
              nodes['war_test'] = {
                id: 'war_test',
                marker: {
                  radius: 30
                }
              };
              nodes[link[1]] = {
                id: link[1],
                marker: {
                  radius: 15
                },
                color: colors[3]
              };
            } else if (link[0] === 'binary_test') {
              nodes['binary_test'] = {
                id: 'binary_test',
                marker: {
                  radius: 30
                },
                color: colors[5]
              };
              nodes[link[1]] = {
                id: link[1],
                marker: {
                  radius: 15
                },
                color: colors[4]
              };
            }
          });
          e.options.nodes = Object.keys(nodes).map(function (id) {
            return nodes[id];
          });
        }
      );

      this.chart = new Highcharts.Chart(this.$el, this.options);
    }
  }
}
</script>

<style>

</style>