<template>
  <b-container>
    <div class="mb-5">
      <h1>组件</h1>
    </div>
    <b-table
      :fields="[
        { key: 'libraries', label: '组件' },
        { key: 'vulnerabilities', label: '漏洞' },
        { key: 'licenses', label: '许可证' },
      ]" 
      :items='items'
      class="libraries-overview"
    >
      <template slot="libraries">
        <p>组件数量:111</p>
        <p>存在漏洞的组件:11</p>
        <p>存在许可证问题的组件:11</p>
      </template>
      <template slot="vulnerabilities">
        <highcharts :options="options" :styles="style"></highcharts>
      </template>
      <template slot="licenses">
        <p>未发现问题</p>
      </template>
    </b-table>

    <b-table 
      :fields="[
        { key: 'project', label: '项目' },
        { key: 'library', label: '已搜到的组件' },
        { key: 'vulnerabilities', label: '漏洞' },
        { key: 'licenses', label: '许可证问题' },
        { key: 'last', label: '最后扫描' },
        { key: 'scan', label: '情况' },
      ]"
      :items="projectItems"
      class="libraries-by-project"
    >
      <template slot="thead-top">
        <h4>按项目分类</h4>
      </template>
      <template slot="project" slot-scope="data">
        <b-link to="/projects/1">{{ data.item.project }}</b-link>
      </template>
      <template slot="scan">
        <b-link to="/projects/1/libraries/1">查看</b-link>
      </template>
    </b-table>

    <b-table 
      :fields="[
        { key: 'library', label: '组件' },
        { key: 'module', label: '模组' },
        { key: 'version', label: '版本' },
        { key: 'vulnerabilities', label: '漏洞' },
        { key: 'licenses', label: '许可证' },
        { key: 'affect', label: '受影响项目' }
      ]"
      :items='libraryItems'
      class="libraries-by-library"
    >
      <template slot="thead-top">
        <h4>按组件分类</h4>
      </template>
      <template slot="scan">
        <b-link>查看</b-link>
      </template>
    </b-table>
  </b-container>
</template>

<script>

export default {
  data() {
    return {
      items: [
        {}
      ],
      projectItems: [
        { project: 'binary_test', library: 5, vulnerabilities: 20, licenses: 0, last: '2天前' },
        { project: 'binary_test', library: 5, vulnerabilities: 20, licenses: 0, last: '2天前' }
      ],
      libraryItems: [
        { library: 'binary_test', module: 'asd', version: '1.0', vulnerabilities: 20, licenses: 'asdf', affect: 1 },
        { library: 'binary_test', module: 'asd', version: '1.0', vulnerabilities: 20, licenses: 'asdf', affect: 1 },
      ],
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
      }
    }
  }
}
</script>

<style lang='less'>
.libraries-overview {
  td {
    width: 33.33%;
  }
}
.libraries-by-project {
  td {
    width: 16.66%;
  }
}
.libraries-by-library {
  td {
    width: 16.66%;
  }
}
</style>
