<template>
  <b-container>
    <div class="mb-5">
      <h1>组件扫描结果</h1>
    </div>

    <b-table
      :fields="[
        { key: 'libraries', label: '统计' },
        { key: 'vulnerabilities', label: '漏洞' },
        { key: 'licenses', label: '许可证' },
      ]" 
      :items='items'
      class="library-result-overview"
    >
      <template slot="libraries">
        <p>组件数量</p>
        <p>已发现漏洞</p>
        <p>存在问题的许可证</p>
      </template>

      <template slot="vulnerabilities">
        <highcharts :options="options" :styles="style"></highcharts>
      </template>

      <template slot="licenses">
        <highcharts :options="options" :styles="style"></highcharts>
      </template>
    </b-table>

    <b-table 
      :fields="[
        {key: 'name', label: '名称'},
        {key: 'version', label: '版本'},
        {key: 'module', label: '模组'},
        {key: 'vulnerabilities', label: '漏洞'},
        {key: 'licenses', label: '许可证'},
        {key: 'detail', label: '详情'},
      ]" 
      :items='librariesItems'
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h5>组件清单</h5>
          </th>
          <th colspan="5"></th>
        </tr>  
      </template>
      <template slot="detail">
        <b-link to="/projects/1/libraries/1/issue/1">查看</b-link>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
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
        {}
      ],
      librariesItems: [
        {
          name: 'aaaaa',
          version: '1.1.1',
          module: 'a.elf',
          vulnerabilities: '10',
          licenses: 'LGPL-2.1-or-later'
        },
        {
          name: 'bbbbb',
          version: '2.2.2',
          module: 'bbb',
          vulnerabilities: '15',
          licenses: 'LGPL-2.1-or-later'
        }
      ]
    }
  }
}
</script>

<style lang="less">
.library-result-overview {
  td {
    width: 33.33%;
  }
}
</style>
