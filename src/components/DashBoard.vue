<template>
  <b-container>
    <div>
      <h1>总览</h1>
    </div>
    <div>
      <b-card
        v-for="(item, index) in items"
        :key="index"
        style="float:left;width:23%;margin:1%;"
        class="my-4"
      ><h4><a href="">{{ item.title }}</a></h4>{{ item.abstract }}</b-card>
    </div>
    <div>
      <b-card style="float:left;width:31.33%;margin:1%;">
        <highcharts-component :options="options" :styles="style" ref="simpleChart"></highcharts-component>
      </b-card>
      <b-card style="float:left;width:31.33%;margin:1%;">
        <highcharts-component :options="options" :styles="style" ref="simpleChart"></highcharts-component>          
      </b-card>
      <b-card style="float:left;width:31.33%;margin:1%;">
        <highcharts-component :options="options" :styles="style" ref="simpleChart"></highcharts-component>          
      </b-card>
    </div>
  </b-container>
</template>

<script>
import highchartsComponent from './Highcharts.vue';

export default {
  components: {
    highchartsComponent
  },
  data() {
    return {
      options: {
        chart: {
          type: 'pie'
        },
        title: {
          text: null
        },
        plotOptions: {
          pie: {
            shadow: false,
            showInLegend: true
          }
        },
        series: [{
          data: [
            ['未扫描', 2],
            ['未更新', 0],
            ['已更新', 3]
          ]
        }],
        pie: {
          showInLegend: true
        }
      },
      style: {
        height: 300,
        width: 300,
      },
      items: [
        {
          title: 'test1',
          abstract: 'Default organization for test1'
        },
        {
          title: '扫描',
          abstract: '0/99999'
        },
        {
          title: '项目',
          abstract: '2'
        },
        {
          title: '用户',
          abstract: '1'
        },
      ]
    }
  }
}
</script>

<style>

</style>
