<template>
  <b-container>
    <div class="mb-5">
      <h1>许可证详情</h1>
    </div>

    <b-table 
      :fields="[
        {key: 'name', label: '许可证名称'},
        {key: 'style', label: '类型'},
        {key: 'status', label: '状态'},
        {key: 'library', label: '组件'},
        {key: 'score', label: '打分'},
        {key: 'detail', label: '详情'},
      ]" 
      :items='licenseResultItems'
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h4>许可证清单</h4>
          </th>
          <th colspan="5">&nbsp;</th>
        </tr>  
      </template>

      <template slot="detail">
        <b-link to="/projects/1/licenses/1/issue/1">查看</b-link>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      licenseResultItems: [
        {
          name: 'GNU Lesser General Public License v2.1 or later',
          style: '受限',
          status: 'N.A.',
          library: 'ffmpeg',
          score: 8
        }
      ]
    }
  }
}
</script>

<style>

</style>
