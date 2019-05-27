<template>
  <b-container>
    <div class="mb-5">
      <h1>项目</h1>
    </div>
    <b-table :fields='projectsFields' :items='projectsItems'>
      <template slot="thead-top">
        <tr>
          <th>
            <h3>项目列表</h3>
          </th>
          <th>
            <b-button>添加项目</b-button>
          </th>
          <th colspan="5">&nbsp;</th>
        </tr>  
      </template>
      <template slot="name" slot-scope="data">
        <b-link>{{ data.item.name }}</b-link>
      </template>
      <template slot="libraries">
        <b-link>查看</b-link>
      </template>
      <template slot="vulnerabilities">
        <b-link>查看</b-link>
      </template>
      <template slot="licenses">
        <b-link>查看</b-link>
      </template>
      <template slot="manage">
        <b-link>查看</b-link>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      projectsFields: [
        {key: 'name', label: '名称'},
        {key: 'last_update', label: '最后更新'},
        {key: 'status', label: '扫描状态'},
        {key: 'libraries', label: '组件'},
        {key: 'vulnerabilities', label: '漏洞'},
        {key: 'licenses', label: '许可证'},
        {key: 'manage', label: '操作'},
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
      ]
    }
  }
}
</script>

<style>

</style>
