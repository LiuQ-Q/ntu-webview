<template>
  <b-container>
    <div class="mb-5">
      <h1>许可证详情</h1>
    </div>

    <b-table 
      :fields="[
        {key: 'license_name', label: '许可证名称'},
        {key: 'category', label: '类型'},
        {key: 'action_type', label: '状态'},
        {key: 'library_name', label: '组件'},
        {key: 'license_score', label: '打分'},
        {key: 'detail', label: '详情'},
      ]" 
      :items='licenseIssues'
      class="license-result"
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h4>许可证清单</h4>
          </th>
          <th colspan="5">&nbsp;</th>
        </tr>  
      </template>

      <template 
        slot="category"
        slot-scope="data"
      >{{ category[data.item['license_category']] }}</template>

      <template 
        slot="detail"
        slot-scope="data"
      >
        <b-link :to="`${scanId}/issue/${data.item.id}`">查看</b-link>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      orgId: this.$route.params.orgId,
      projectId: this.$route.params.projectId,
      scanId: this.$route.params.scanId,
      licenseIssues: [],
      category: {
        Permissive: '允许的',
        Restrictive: '受限的',
      }
    }
  },
  mounted() {
    this.getLicenseIssues();
  },
  methods: {
    async getLicenseIssues() {
      this.licenseIssues = (await this.$backend.scans.licenseIssues.getList(this.scanId)).results;
    }
  }
}
</script>

<style lang="less">
.license-result {
  td:nth-child(1) {
    width: 35%;
  }
}
</style>
