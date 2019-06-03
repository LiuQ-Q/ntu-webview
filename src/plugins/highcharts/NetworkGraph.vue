<template>
  <div class="graph-container"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsDrilldown from 'highcharts/modules/drilldown';
// import Highcharts3D from 'highcharts/highcharts-3d';

HighchartsMore(Highcharts)
// HighchartsDrilldown(Highcharts);
// Highcharts3D(Highcharts);

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
            if (link[0] === 'Proto Indo-European') {
              nodes['Proto Indo-European'] = {
                id: 'Proto Indo-European',
                marker: {
                  radius: 20
                }
              };
              nodes[link[1]] = {
                id: link[1],
                marker: {
                  radius: 10
                },
                color: colors[i++]
              };
            } else if (nodes[link[0]] && nodes[link[0]].color) {
              nodes[link[1]] = {
                id: link[1],
                color: nodes[link[0]].color
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