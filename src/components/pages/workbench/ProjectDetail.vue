<template>
  <b-container>
    <div class="mb-5">
      <h1>项目详情</h1>
    </div>

    <b-table
      :items="[{}]"
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
        <b-dropdown 
          text="操作"
          size="sm"
        >
          <b-dropdown-item
            v-if="projectById['can_scan']"
            @click="deleteProject(projectId)"
          >隐藏</b-dropdown-item>
            
          <b-dropdown-item
            v-if="!projectById['can_scan']"
            @click="updateProject(projectId)"
          >取消隐藏</b-dropdown-item>
        </b-dropdown>
      </template>

      <template slot="scan">
        <b-form-checkbox
          v-model="regularScanStatus"
          switch
        >定期扫描</b-form-checkbox>

        <b-form-select
          v-model="policyCode"
          size='sm'
          class="my-2"
          :disabled="!regularScanStatus"
        >
          <option value="1">源代码</option>
          <option value="2">二进制</option>
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

        <div>
          <b-link @click="$bvModal.show('modal-policy')">添加新政策</b-link>
        </div>
        <div v-if="!defaultPolicyCode.includes(licensePolicy)">
          <b-link @click="deletePolicy">删除政策</b-link>
        </div>

        <b-modal 
          id="modal-policy"
          ref="modal-policy-ref"
          hide-footer
        >
          <template slot="modal-title">添加新政策</template>

          <b-form class="signin-form">
            <b-form-group label="名称:">
              <b-form-input
                v-model="policyName"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="简介:">
              <b-form-textarea
                rows="3"
                max-rows="6"
                v-model="policyDesc"
              ></b-form-textarea>
            </b-form-group>
          </b-form>

          <b-button
            size="sm" 
            class="mt-3" 
            block
            @click="addNewPolicy"
          >添加</b-button>
        </b-modal>
      </template>

      <template slot="upload">
        <p>已上传文件:&nbsp;{{ projectUploads['filename'] }}</p>
        <p>文件大小:&nbsp;{{ Math.round(projectUploads['file_size'] * 100000) / 100 }}KB</p>
        <p>上传者:&nbsp;{{ projectUploads['uploader_name'] }}</p>
        <p>上传时间:&nbsp;{{ format(projectUploads['created']) }}</p>

        <b-button
          size="sm"
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
              size="sm"
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
          :to="`${data.item.project}/libraries/${data.item.id}`"
        >查看</b-link>
      </template>

      <template 
        slot="vulnerability"
        slot-scope="data"
      >
        <b-link
          v-if="data.item['status'] === 'finished'" 
          :to="`${data.item.project}/vulnerabilities/${data.item.id}`"
        >查看</b-link>
      </template>

      <template 
        slot="license"
        slot-scope="data"
      >
        <b-link
          v-if="data.item['status'] === 'finished'" 
          :to="`${data.item.project}/licenses/${data.item.id}`"
        >查看</b-link>
      </template>

      <template 
        slot="report"
        slot-scope="data"
      >
        <b-link
          v-if="data.item['status'] === 'finished' && data.item['vul_report_status'] !== 'N.A.'"
          @click="downloadRepo(data.item.id)"
        >下载</b-link>
        <b-link
          v-if="data.item['status'] === 'finished' && data.item['vul_report_status'] === 'N.A.'"
          @click="exportRepo(data.item.id)"
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
      regularScanStatus: false,
      policyCode: '',
      driveScanStyle: 'pull',

      file: null,
      licensePolicy: '',
      defaultPolicyCode: [],
      projectSelected: [],
      scheduledId: '',
      projectScans: [], // 扫描历史相关
      projectScanPolicies: [],
      projectById: {}, // 项目信息
      orgsSourcecode: {},
      orgsLicensePolicies: [], // 许可证政策
      projectUploads: {}, // 文件相关信息
      scanStatus: {
        'failed': '失败',
        'finished': '成功'
      },
      scansLog: {},
      policyName: '',
      policyDesc: ''
    }
  },
  computed: {
    orgId() {
      return this.$route.params.orgId;
    },
    projectId() {
      return this.$route.params.projectId;
    },
  },
  watch: {
    regularScanStatus() {
      this.regularScan();
    },
    licensePolicy() {
      this.policySetting();
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
      // 扫描设置相关
      this.projectScanPolicies = (await this.$backend.projects.getByIdMode(this.projectId, 'scan-policies')).results;

      this.projectScanPolicies.forEach((ele) => {
        if (ele['policy_type'] === 'scheduled') {
          this.scheduledId = ele.id;
          this.regularScanStatus = ele['in_use'];
          this.policyCode = ele['policy_code'];
        }
      });
    },
    async getProjectLicensePolicies() {
      // 当前使用的政策
      this.licensePolicy = (await this.$backend.projects.getByIdMode(this.projectId, 'license-policies')).results[0]['license_policy'];
      // console.log(this.licensePolicy);
      
    },
    async getOrgsSourcecode() {
      // 
      this.orgsSourcecode = await this.$backend.orgs.getByIdMode(this.orgId, 'sourcecode-usage');
      // console.log(this.orgsSourcecode);
    },
    async getOrgsLicensePolicies() {
      // 许可证政策
      this.orgsLicensePolicies = (await this.$backend.orgs.getByIdMode(this.orgId, 'license-policies')).results;
      this.$backend.orgs.getByIdMode(this.orgId, 'license-policies').then(res => {
        this.orgsLicensePolicies = res.results;

        res.results.forEach(ele => {
          if (ele['is_default']) {
            this.defaultPolicyCode.push(ele['policy_code']);
          }
        })
      });
    },
    async getProjectUploads() {
      // 上传文件相关
      this.projectUploads = (await this.$backend.projects.getByIdMode(this.projectId, 'uploads')).results[0];
      // console.log(this.projectUploads);
    },
    async openScanStatus(scanId) {
      this.scansLog = await this.$backend.scans.getByIdMode(scanId, 'logs');
      
      this.$refs['modal-scan-status'].show();
    },
    compare() {
      this.$router.push(`24/compare/${this.projectSelected.join('&')}`)
    },
    async deleteProject(projectId) {
      // 隐藏项目
      this.$backend.orgs.projects.deleteById(this.orgId, projectId);
      this.projectById = await this.$backend.projects.getById(this.projectId);
    },
    async updateProject(projectId) {
      // 取消隐藏项目
      this.$backend.orgs.projects.updateById(this.orgId, projectId);
      this.projectById = await this.$backend.projects.getById(this.projectId);
    },
    async regularScan() {
      this.$backend.projects.scanPolicies.updateById(this.projectId,this.scheduledId, this.regularScanStatus, this.policyCode);
    },
    policySetting() {
      this.$backend.projects.licensePolicies.updateById(this.projectId, this.licensePolicy);
    },
    addNewPolicy() {
      this.$backend.orgs.licensePolicies.create(this.orgId, this.policyName, this.policyDesc).then(res => {
        this.$backend.projects.licensePolicies.updateById(this.projectId, res['policy_code']).then(res => {
          this.getProjectLicensePolicies();
          this.getOrgsLicensePolicies();
          this.$refs['modal-policy-ref'].hide();
        });
      });
    },
    deletePolicy() {
      this.$backend.orgs.licensePolicies.delete(this.orgId, this.licensePolicy).then(res => {
        this.getProjectLicensePolicies();
        this.getOrgsLicensePolicies();
      });
    },
    downloadRepo(scanId) {
      this.$backend.export.licenseIssues.download(scanId);
      this.$backend.export.libraries.download(scanId);
      this.$backend.export.issues.download(scanId);

    },
    exportRepo(scanId) {
      this.$backend.export.licenseIssues.export(scanId);
      this.$backend.export.libraries.export(scanId);
      this.$backend.export.issues.export(scanId);
      this.getProjectScans();   
    },
    fileUpload() {
      console.log(this.file);
      
    },
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
