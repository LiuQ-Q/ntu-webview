<template>
	<div class="highcharts-container"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsDrilldown from 'highcharts/modules/drilldown';
// import Highcharts3D from 'highcharts/highcharts-3d';

HighchartsMore(Highcharts);
// HighchartsDrilldown(Highcharts);
// Highcharts3D(Highcharts);

export default {
	props: ['options', 'styles'],
	name: 'highcharts',
	data() {
		return {
			chart: null,
			compareOptionStatus: true
		};
	},
	mounted() {
		this.initChart();
	},
	watch: {
		options: {
			handler(val, oldVal) {

				if (val.chart.type === 'pie') {
					this.compareOptions(val, oldVal);

					if (!this.compareOptionStatus) {
						this.chart.destroy();
						this.initChart();
						this.compareOptionStatus = true;
					}
				}

				if (val.chart.type === 'column') {
					this.initChart();
				}
			}
		}
	},
	methods: {
		initChart() {
			this.chart = new Highcharts.Chart(this.$el, this.options);
		},
		compareOptions(val, oldVal) {
			val.series.forEach((serie, serieIndex) => {
				serie.data.forEach((data, dataIndex) => {
					if (data.toString() !== oldVal.series[serieIndex].data[dataIndex].toString()) {
						this.compareOptionStatus = false;
					}
				});
			});
		}
	}
};
</script>

<style>

</style>