<template>
  <b-container>
    <div class="mb-5">
      <h1>许可证问题详情</h1>
    </div>

    <b-table
      :fields="[
        { key: 'problem', label: '总览' },
        { key: 'deal', label: '对此问题的处理' },
      ]" 
      :items="[{}]"
      class="license-detail-overview"
    >
      <template 
        v-if="licenseIssues['license_name'] !== undefined"
      slot="problem"
      >
        <p>许可证:&nbsp;{{ licenseIssues['license_name'] }}</p>
        <p>类型:&nbsp;{{ category[licenseIssues['license_category']] }}</p>
        <p>许可证政策:&nbsp;{{ licenseIssues['license_desc'] }}</p>
        <p>受影响的组件:&nbsp;{{ licenseIssues['library_desc'] }}</p>
        <p>政策合规性:&nbsp;{{ licenseIssues['license_policy']['license_policy'] }}</p>
        <p>综合打分:&nbsp;{{ licenseIssues['license_score'] }}</p>
      </template>

      <template slot="deal">
        <p class="mb-2">状态:</p>
        <b-form-select
          v-model="priority"
          size='sm'
          class="mb-2"
          style="width:50%;"
        >
          <option value="none">未设置</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </b-form-select>

        <p class="mb-2">优先级:</p>
        <b-form-select
          v-model="actionType"
          size='sm'
          class="mb-2"
          style="width:50%;"
        >
          <option value="none">未设置</option>
          <option value="ignore">忽略</option>
          <option value="to_be_fixed">待修复</option>
          <option value="fixed">已修复</option>
        </b-form-select>

        <p class="mb-2">负责人:</p>
        <b-form-select
          v-model="assignee"
          size='sm'
          class="mb-2"
          style="width:50%;"
        >
          <option value="none">未设置</option>
          <option
            v-for="(member, index) in teamsMembers" 
            :key="index"
            :value="member['org_member'].user.username"
          >{{ member['org_member'].user.username }}</option>
        </b-form-select>

        <p>评价:</p>
        <b-form-textarea
          v-model="comment"
          placeholder="请添加评价..."
          rows="3"
          max-rows="6"
          class="mb-3"
        ></b-form-textarea>

        <b-button style="float:left;">提交</b-button>

        <b-dropdown text="操作" style="float:left;" class="ml-3">
          
        </b-dropdown>
      </template>
    </b-table>

    <b-table 
      :fields="[
        {key: 'allowed', label: '被允许的许可证属性'},
        {key: 'require', label: '要求的许可证属性'},
        {key: 'limit', label: '受限的许可证属性'},
      ]"
      :items="[{}]"
      class="license-detail-attributes"
    >
      <template slot="allowed" slot-scope="data">
        <p
          v-for="(allowedLicense, index) in attributesAllowed"
          :key="index"
        >{{ allowedLicense }}</p>
      </template>

      <template slot="require" slot-scope="data">
        <p
          v-for="(requireLicense, index) in attributesRequired"
          :key="index"
        >{{ requireLicense }}</p>
      </template>

      <template slot="limit" slot-scope="data">
        <p
          v-for="(limitLicense, index) in attributesRestricted"
          :key="index"
        >{{ limitLicense }}</p>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      actionType: '',
      priority: '',
      assignee: '',
      comment: '',

      orgId: this.$route.params.orgId,
      projectId: this.$route.params.projectId,
      scanId: this.$route.params.scanId,
      issueId: this.$route.params.issueId,
      licenseIssues: {},
      issuesLastAction: {},
      teamsMembers: [],
      attributesAllowed: [],
      attributesRestricted: [],
      attributesRequired: [],
      category: {
        Permissive: '允许的',
        Restrictive: '受限的',
      }
    }
  },
  mounted() {
    this.getLicenseIssues();
    this.getIssuesLastAction();
    this.getTeamsMembers();
    this.getAttributes();
  },
  methods: {
    async getLicenseIssues() {
      this.licenseIssues = await this.$backend.scans.licenseIssues.getById(this.scanId, this.issueId);
    },
    async getIssuesLastAction() {
      this.issuesLastAction = await this.$backend.scans.licenseIssues.getById(this.scanId, this.issueId, 'last-action');

      this.actionType = this.issuesLastAction['action_type'];
      this.priority = this.issuesLastAction['priority'];
      this.assignee = this.issuesLastAction['assignee'];
      this.comment = this.issuesLastAction['comment'];
    },
    async getTeamsMembers() {
      this.teamsMembers = (await this.$backend.teams.members.getList(this.orgId)).results;
    },
    async getAttributes() {
      const attributes = await this.$backend.scans.licenseIssues.getById(this.scanId, this.issueId, 'attributes' );

      attributes.forEach(ele => {
        switch (ele.category) {
          case 'allowed':
            this.attributesAllowed.push(ele.attribute.name);
            break;

          case 'restricted':
            this.attributesRestricted.push(ele.attribute.name);
            break;

          case 'required':
            this.attributesRequired.push(ele.attribute.name);
            break;
        
          default:
            break;
        }
      });
    },
  }
}
</script>

<style lang="less">
.license-detail-overview {
  td {
    width: 50%;
  }
}
.license-detail-attributes {
  td {
    width: 33.33%;
  }
}
</style>
