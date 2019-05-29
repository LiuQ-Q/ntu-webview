<template>
  <b-container>
    <div class="mb-5">
      <h1>项目</h1>
    </div>

    <b-table
      :fields="[
        { key: 'libraries', label: '概览' },
        { key: 'vulnerabilities', label: '漏洞' },
      ]" 
      :items='items'
      class="projects-overview"
    >
      <template slot="libraries">
        <p>项目总数</p>
        <p>已使用二进制流量</p>
      </template>
      <template slot="vulnerabilities">
        <highcharts :options="options" :styles="style"></highcharts>
      </template>
    </b-table>

    <b-table 
      :fields="[
        {key: 'name', label: '名称'},
        {key: 'last_update', label: '最后更新'},
        {key: 'status', label: '扫描状态'},
        {key: 'libraries', label: '组件'},
        {key: 'vulnerabilities', label: '漏洞'},
        {key: 'licenses', label: '许可证'},
        {key: 'manage', label: '操作'},
      ]" 
      :items='projectsItems'
      class="text-center"
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h4>项目列表</h4>
          </th>
          <th>
            <b-button to="/manage">添加项目</b-button>
          </th>
          <th colspan="5">&nbsp;</th>
        </tr>  
      </template>
      <template 
        slot="name" 
        slot-scope="data"
      >
        <b-link to="/projects/1">{{ data.item.name }}</b-link>
      </template>
      <template slot="libraries">
        <b-link to="/projects/1/libraries/1">查看</b-link>
      </template>
      <template slot="vulnerabilities">
        <b-link to="/projects/1/vulnerabilities/1">查看</b-link>
      </template>
      <template slot="licenses">
        <b-link to="/projects/1/licenses/1">查看</b-link>
      </template>
      <template 
        slot="manage" 
        slot-scope="data"
      >
        <b-link @click="$bvModal.show(`modalaa-scan-${data.item.name}`)">开始扫描</b-link>

        <b-modal 
          :id="`modalaa-scan-${data.item.name}`"
          hide-footer
        >
          <template slot="modal-title">扫描设置</template>

          <p>项目名:&nbsp;{{ data.item.name }}</p>

          <b-form-select
            v-model="scanSetting"
            size='sm'
            class="mb-2"
          >
            <option value="source">源代码</option>
            <option value="binary">二进制</option>
          </b-form-select>

          <b-button class="mt-3" block>开始扫描</b-button>
        </b-modal>
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
      projectsItems: [
        {
          name: 'war_test',
          last_update: '2天前',
          status: '未扫描',
        },
        {
          name: 'binary_test',
          last_update: '4天前',
          status: '未扫描',
        },
      ],
      scanSetting: ''
    }
  }
}
</script>

<style lang='less'>
.projects-overview {
  td {
    width: 50%;
  }
}
</style>
