<template>
  <b-container>
    <div class="mb-5">
      <h1>总览</h1>
    </div>
    <b-table
      :fields="[
        { key: 'agency', label: '机构' },
        { key: 'project', label: '项目' },
        { key: 'user', label: '用户' },
        { key: 'scan', label: '扫描' },
      ]" 
      :items='items'
      bordered
      class="dashboard-overview text-center"
    >
      <template slot="project" slot-scope="data">
        <b-link to="/projects">{{ data.item.project }}</b-link>
      </template>
      <template slot="user" slot-scope="data">
        <b-link to="/settings">{{ data.item.user }}</b-link>
      </template>
      <template slot="scan" slot-scope="data">
        <b-link to="/projects">{{ data.item.scan }}</b-link>
      </template>
    </b-table>

    <b-table
      :fields="[
        { key: 'project', label: '项目情况' },
        { key: 'vulnerabilities', label: '漏洞警报' },
        { key: 'licenses', label: '许可证警报' },
      ]" 
      :items='items'
      bordered
      class="dashboard-alarm text-center mt-5"
    >
      <template slot="libraries">
        <p>项目总数</p>
        <p>已使用二进制流量</p>
      </template>
      <template slot="project">
        <highcharts :options="options"></highcharts>
        <b-table
          :fields="[
            { key: 'name', label: '名称' },
            { key: 'lang', label: '语言' },
            { key: 'problem', label: '问题' },
          ]" 
          :items='items'
        >
          <template slot="name">
            <b-link to='/projects/1'>binary-test</b-link>
          </template>
          <template slot="lang">-</template>
          <template slot="problem">0</template>
        </b-table>
      </template>
      <template slot="vulnerabilities">
        <highcharts :options="options"></highcharts>
        <b-table
          :fields="[
            { key: 'name', label: '名称' },
            { key: 'lang', label: '语言' },
            { key: 'problem', label: '问题' },
          ]" 
          :items='items'
        >
          <template slot="name">
            <b-link to='/projects/1'>binary-test</b-link>
          </template>
          <template slot="lang">-</template>
          <template slot="problem">0</template>
        </b-table>
      </template>
      <template slot="licenses">
        <highcharts :options="options"></highcharts>
        <b-table
          :fields="[
            { key: 'name', label: '名称' },
            { key: 'lang', label: '语言' },
            { key: 'problem', label: '问题' },
          ]" 
          :items='items'
        >
          <template slot="name">
            <b-link to='/projects/1'>binary-test</b-link>
          </template>
          <template slot="lang">-</template>
          <template slot="problem">0</template>
        </b-table>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {agency: 'test1', project: '2/25', user: '1/25', scan: '0/999'}
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
      }
    }
  }
}
</script>

<style lang='less'>
.dashboard-overview {
  td {
    width: 25%;
  }
}
.dashboard-alarm {
  td {
    width: 33.33%;
  }
}
</style>
