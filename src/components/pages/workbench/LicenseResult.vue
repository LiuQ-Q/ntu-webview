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
          <th>
            <b-button
              size="sm"
              v-if="scansById['lic_report_status'] !== 'N.A.'"
              @click="downloadRepo"
            >下载</b-button>
            <b-button
              size="sm"
              v-if="scansById['lic_report_status'] === 'N.A.'"
              @click="exportRepo"
            >导出</b-button>
          </th>
          <th colspan="4">&nbsp;</th>
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
      },
      scansById: {}
    }
  },
  mounted() {
    this.getLicenseIssues();
    this.getScansById();
  },
  methods: {
    async getLicenseIssues() {
      this.licenseIssues = (await this.$backend.scans.licenseIssues.getList(this.scanId)).results;
    },
    getScansById() {
      // 扫描详细信息
      this.$backend.scans.getById(this.scanId).then(res => {
        this.scansById = res;
      });
    },
    downloadRepo() {

    },
    exportRepo() {
      this.$backend.export.issues.export(this.scanId);
      this.getScansById();   
    },
  }
}
</script>

<style lang="less">
.license-result {
  td:nth-child(1) {
    width: 25%;
  }
}
</style>
