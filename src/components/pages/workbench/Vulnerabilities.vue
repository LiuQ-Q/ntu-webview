<template>
  <b-container>
    <div class="mb-5">
      <h1>漏洞</h1>
    </div>
    <b-table
      :fields="[
        { key: 'all', label: '总览' },
        { key: 'cve', label: 'CVE' },
        { key: 'bug', label: 'Bug' },
        { key: 'warn', label: '警告' },
      ]" 
      :items='items'
      class="vulnerabilities-overview text-center"
    >
      <template slot="all">
        <highcharts :options="options" :styles="style"></highcharts>
      </template>

      <template slot="cve">
        <highcharts :options="options" :styles="style"></highcharts>
      </template>

      <template slot="bug">
        <highcharts :options="options" :styles="style"></highcharts>
      </template>

      <template slot="warn">
        <p>未发现问题</p>
      </template>
    </b-table>

    <b-table 
      :fields="[
        { key: 'project', label: '项目' },
        { key: 'cve', label: 'CVE' },
        { key: 'bug', label: 'Bug' },
        { key: 'warn', label: '安全警告' },
        { key: 'last', label: '最后扫描' },
        { key: 'scan', label: '情况' },
      ]"
      :items="projectItems"
      class="vulnerabilities-by-project"
    >
      <template slot="thead-top">
        <h4>按漏洞分类</h4>
      </template>
      <template slot="project" slot-scope="data">
        <b-link to="/projects/1">{{ data.item.project }}</b-link>
      </template>
      <template slot="scan">
        <b-link to="/projects/1/vulnerabilities/1">查看</b-link>
      </template>
    </b-table>

    <b-table 
      :fields="[
        { key: 'num', label: '问题编号' },
        { key: 'style', label: '类型' },
        { key: 'level', label: '危险程度' },
        { key: 'affect', label: '受影响项目' }
      ]"
      :items='libraryItems'
      class="vulnerabilities-by-library"
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
        { project: 'binary_test', cve: 5, bug: 20, warn: 0, last: '2天前' },
        { project: 'binary_test', cve: 5, bug: 20, warn: 0, last: '2天前' },
      ],
      libraryItems: [
        { num: 'CVE-2222-2222', style: 'CVE', level: '超高', affect: 1 },
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
.vulnerabilities-overview {
  td {
    width: 25%;
  }
}
.vulnerabilities-by-project {
  td {
    width: 16.66%;
  }
}
.vulnerabilities-by-library {
  td {
    width: 25%;
  }
}
</style>
