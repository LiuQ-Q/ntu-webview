<template>
  <b-container>
    <div class="mb-5">
      <h1>项目详情</h1>
    </div>

    <b-table
      :items="items"
      :fields="[
        { key: 'message', label: '信息' },
        { key: 'scan', label: '扫描设置' },
        { key: 'license', label: '许可证政策' },
        { key: 'upload', label: '文件上传' },
      ]"
      class="project-detail-message"
    >
      <template slot="message" slot-scope="data">
        <p>
          <small>项目名称:&nbsp;{{ projectById['name'] }}</small>
          <!-- <b-link class="ml-5">隐藏项目</b-link> -->
        </p>
        <p><small>拥有者:&nbsp;{{ projectById['owner_name'] }}</small></p>
        <p><small>来源:&nbsp;{{ projectById['provider'] }}</small></p>
        <p><small>创建时间:&nbsp;{{ format(projectById['created']) }}</small></p>
      </template>

      <template slot="scan">
        <b-form-checkbox
          v-model="regularScan"
          switch
        >定期扫描</b-form-checkbox>

        <b-form-select
          v-model="regularScanStyle"
          size='sm'
          class="my-2"
          :disabled="!regularScan"
        >
          <option value="source">源代码</option>
          <option value="binary">二进制</option>
        </b-form-select>

        <b-form-checkbox
          switch
          disabled
        >事件驱动扫描</b-form-checkbox>

        <b-form-select
          v-model="driveScanStyle"
          size='sm'
          class="my-2"
          disabled
        >
          <option value="pull">拉取操作</option>
        </b-form-select>
      </template>

      <template slot="license">
        <p class="mb-2">当前政策</p>

        <b-form-select
          v-model="licensePolicy"
          size='sm'
          class="mb-2"
        >
          <option 
            v-for="(policy, index) in orgsLicensePolicies"
            :key="index"
            :value="policy['policy_code']"
          >{{ policy['name'] }}</option>
        </b-form-select>

        <b-link @click="$bvModal.show('modal-policy')">添加新政策</b-link>

        <b-modal 
          id="modal-policy"
          hide-footer
        >
          <template slot="modal-title">添加新政策</template>

          <b-form class="signin-form">
            <b-form-group label="名称:">
              <b-form-input></b-form-input>
            </b-form-group>

            <b-form-group label="简介:">
              <b-form-textarea
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </b-form>

          <b-button class="mt-3" block>添加</b-button>
        </b-modal>
      </template>

      <template slot="upload">
        <p>已上传文件:&nbsp;{{ projectUploads['filename'] }}</p>
        <p>文件大小:&nbsp;{{ Math.round(projectUploads['file_size'] * 100000) / 100 }}KB</p>
        <p>上传者:&nbsp;{{ projectUploads['uploader_name'] }}</p>
        <p>上传时间:&nbsp;{{ format(projectUploads['created']) }}</p>

        <b-button
          variant="primary"
          :disabled="!file"
          @click="fileUpload"
        >上传新文件</b-button>
        <b-form-file
          v-model="file"
          class="mt-3"
          value="aaa"
          plain
        ></b-form-file>
      </template>
    </b-table>

    <b-table
      :fields="[
        { key: 'id', label: '编号' },
        { key: 'source', label: '来源' },
        { key: 'branch', label: '分支' },
        { key: 'status', label: '状态' },
        { key: 'time', label: '时间' },
        { key: 'library', label: '组件' },
        { key: 'vulnerability', label: '漏洞' },
        { key: 'license', label: '许可证' },
        { key: 'report', label: '报告' },
        { key: 'check', label: '选择' },
      ]"
      :items="projectScans"
      class="text-center"
      small
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h5>扫描历史</h5>
          </th>
          <th colspan="8">&nbsp;</th>
          <th>
            <b-button 
              @click="compare"
              :disabled="projectSelected.length < 2"
            >比较</b-button>
          </th>
        </tr>  
      </template>

      <template 
        slot="status" 
        slot-scope="data"
      >
        <b-link @click="openScanStatus(data.item.id)">{{ scanStatus[data.item.status] }}</b-link>
      </template>

      <template 
        slot="library"
        slot-scope="data"
      >
        <b-link
          v-if="data.item['status'] === 'finished'" 
          :to="`projects/${data.item.project}/libraries/${data.item.id}`"
        >查看</b-link>
      </template>

      <template 
        slot="vulnerability"
        slot-scope="data"
      >
        <b-link
          v-if="data.item['status'] === 'finished'" 
          :to="`projects/${data.item.project}/vulnerabilities/${data.item.id}`"
        >查看</b-link>
      </template>

      <template 
        slot="license"
        slot-scope="data"
      >
        <b-link
          v-if="data.item['status'] === 'finished'" 
          :to="`projects/${data.item.project}/licenses/${data.item.id}`"
        >查看</b-link>
      </template>

      <template 
        slot="report"
        slot-scope="data"
      >
        <b-link
          v-if="data.item['status'] === 'finished' && data.item['vul_report_status'] !== 'N.A.'"
        >下载</b-link>
        <b-link
          v-if="data.item['status'] === 'finished' && data.item['vul_report_status'] === 'N.A.'"
        >导出</b-link>
      </template>

      <template 
        slot="check" 
        slot-scope="data"
      >
        <b-check
          v-model="projectSelected"
          :value="data.item.id"
          :disabled="(projectSelected.length > 4 && !projectSelected.includes(data.item.id)) || data.item['status'] !== 'finished'"
        ></b-check>
      </template>
    </b-table>

    <b-modal 
      ref="modal-scan-status"
      scrollable 
      hide-footer
    >
      <p
        v-for="(log, index) in scansLog"
        :key="index"
      >{{ log['log'] }}</p>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          name: 'binary_test',
          createTime: 'May 7th 2019, 7:37:49 pm',
          owner: 'test1',
          supplier: 'Upload'
        }
      ],
      regularScan: false,
      regularScanStyle: 'source',
      driveScanStyle: 'pull',

      file: null,
      licensePolicy: '',
      projectSelected: [],
      orgId: this.$route.params.orgId,
      projectId: this.$route.params.projectId,
      projectScans: [], // 扫描历史相关
      projectScanPolicies: {},
      projectById: {}, // 项目信息
      orgsSourcecode: {},
      orgsLicensePolicies: [], // 许可证政策
      projectUploads: {}, // 文件相关信息
      scanStatus: {
        'failed': '失败',
        'finished': '成功'
      },
      scansLog: {}
    }
  },
  mounted() {
    this.getProjectScans();
    this.getProjectScanPolicies();
    this.getProjectById();
    this.getProjectLicensePolicies();
    this.getOrgsSourcecode();
    this.getOrgsLicensePolicies();
    this.getProjectUploads();
  },
  methods: {
    async getProjectScans() {
      // 扫描历史列表
      this.projectScans = (await this.$backend.projects.scans.getList(this.projectId)).results;
      // console.log(this.projectScans);
    },
    async getProjectById() {
      // 项目信息
      this.projectById = await this.$backend.projects.getById(this.projectId);
      // console.log(this.projectById);
    },
    async getProjectScanPolicies() {
      // 
      this.projectScanPolicies = await this.$backend.projects.getById(this.projectId, 'scan-policies');
      // console.log(this.projectScanPolicies);
    },
    async getProjectLicensePolicies() {
      // 当前使用的政策
      this.licensePolicy = (await this.$backend.projects.getById(this.projectId, 'license-policies')).results[0]['license_policy'];
    },
    async getOrgsSourcecode() {
      // 
      this.orgsSourcecode = await this.$backend.orgs.getById(this.orgId, 'sourcecode-usage');
      // console.log(this.orgsSourcecode);
    },
    async getOrgsLicensePolicies() {
      // 许可证政策
      this.orgsLicensePolicies = (await this.$backend.orgs.getById(this.orgId, 'license-policies')).results;
      // console.log(this.orgsLicensePolicies);
    },
    async getProjectUploads() {
      // 上传文件相关
      this.projectUploads = (await this.$backend.projects.getById(this.projectId, 'uploads')).results[0];
      // console.log(this.projectUploads);
    },
    
    async fileUpload() {

    },
    async openScanStatus(scanId) {
      console.log(scanId);
      
      this.scansLog = await this.$backend.scans.getById(scanId, 'logs');
      console.log(this.scansLog);
      
      this.$refs['modal-scan-status'].show();
    },
    compare() {
      this.$router.push('24/compare/1&2&3&4')
    }
  }
}
</script>

<style lang="less">
.project-detail-message {
  td {
    width: 24%;
  }

  td:nth-child(1) {
    width: 28%;
  }
}
</style>
