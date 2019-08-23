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
          <option value="ignored">忽略</option>
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

        <b-button 
          style="float:left;"
          @click="submit"
        >提交</b-button>
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
      issueType: '',

      orgId: this.$route.params.orgId,
      projectId: this.$route.params.projectId,
      scanId: this.$route.params.scanId,
      issueId: this.$route.params.issueId,
      licenseIssues: {},
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
      this.$backend.scans.licenseIssues.getByIdMode(this.scanId, this.issueId, 'last-action').then(res => {
        if (JSON.stringify(res) === "{}") {
          this.actionType = "none";
          this.priority = "none";
          this.assignee = "none";
          this.issueType = "license";
        } else {
          this.actionType = res['action_type'];
          this.priority = res['priority'];
          this.assignee = res['assignee'];
          this.comment = res['comment'];
          this.issueType = res['issue_type'];
        }
      });

    },
    async getTeamsMembers() {
      this.teamsMembers = (await this.$backend.teams.members.getList(this.orgId)).results;
    },
    async getAttributes() {
      const attributes = await this.$backend.scans.licenseIssues.getByIdMode(this.scanId, this.issueId, 'attributes' );

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
    submit() {
      this.$backend.scans.actions.create(this.scanId, this.issueId, this.issueType, this.priority, this.actionType, this.assignee, this.comment).then(res => {
        this.$bvToast.toast('提交成功', {
          title: null,
          variant: 'primary',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        })
      }, error => {
        console.log(error);
        this.$bvToast.toast('提交失败', {
          title: null,
          variant: 'danger',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        })
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
