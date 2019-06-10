<template>
  <b-container>
    <div class="mb-3">
      <h1>许可证政策</h1>
    </div>

    <!-- <b-button 
      size="sm"
      class="mb-3"
      @click="$bvModal.show('modal-add-policy')"
    >添加政策</b-button> -->

    <b-table
      :fields="[
        { key: 'approve', label: '被允许的' },
        { key: 'flag', label: '被标记的' },
        { key: 'deny', label: '受限的' },
      ]"
      :items="[{}]"
      class="license-policy-list"
      small
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h3>许可证</h3>
          </th>
          <th colspan="2">&nbsp;</th>
        </tr>  
      </template>
      
      <template slot="approve">
        <div
          v-if="approvePolicy.length !== 0"
          v-for="(policy, index) in approvePolicy"
          :key="index"
        >{{ policy['item_name'] }}</div>
        <div v-if="approvePolicy.length === 0">无</div>
      </template>

      <template slot="flag">
        <div
          v-if="flagPolicy.length !== 0"
          v-for="(policy, index) in flagPolicy"
          :key="index"
        >{{ policy['item_name'] }}</div>
        <div v-if="flagPolicy.length === 0">无</div>
      </template>

      <template slot="deny">
        <div
          v-if="denyPolicy.length !== 0"
          v-for="(policy, index) in denyPolicy"
          :key="index"
        >{{ policy['item_name'] }}</div>
        <div v-if="denyPolicy.length === 0">无</div>
      </template>
    </b-table>
    
    <b-table
      :fields="[
        { key: 'approve', label: '被允许的' },
        { key: 'flag', label: '被标记的' },
        { key: 'deny', label: '受限的' },
      ]"
      :items="[{}]"
      class="license-policy-list"
      small
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h3>许可证属性</h3>
          </th>
          <th colspan="2">&nbsp;</th>
        </tr>  
      </template>

      <template slot="approve">
        <div
          v-if="approvePolicyAttr.length !== 0"
          v-for="(policy, index) in approvePolicyAttr"
          :key="index"
        >{{ policy['item_name'] }}</div>
        <div v-if="approvePolicyAttr.length === 0">无</div>
      </template>

      <template slot="flag">
        <div
          v-if="flagPolicyAttr.length !== 0"
          v-for="(policy, index) in flagPolicyAttr"
          :key="index"
        >{{ policy['item_name'] }}</div>
        <div v-if="flagPolicyAttr.length === 0">无</div>
      </template>

      <template slot="deny">
        <div
          v-if="denyPolicyAttr.length !== 0"
          v-for="(policy, index) in denyPolicyAttr"
          :key="index"
        >{{ policy['item_name'] }}</div>
        <div v-if="denyPolicyAttr.length === 0">无</div>
      </template>
    </b-table>

    <b-modal 
      id="modal-add-policy"
      ref="modal-add-policy"
      scrollable 
      hide-footer
    >
      
    </b-modal>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      orgsLicensePolicies: [],
      licenseList: [],
      licenseAttributes: [],
      policyRules: [],
      approvePolicy: [],
      flagPolicy: [],
      denyPolicy: [],
      approvePolicyAttr: [],
      flagPolicyAttr: [],
      denyPolicyAttr: [],
    }
  },
  computed: {
    orgId() {
      return this.$route.params.orgId;
    },
    policyId() {
      return this.$route.params.policyId;
    },
  },
  mounted() {
    this.getOrgsLicensePolicies();
    this.getLicenseList();
    this.getLicenseAttributes();
    this.getPolicyRules();
  },
  methods: {
    getOrgsLicensePolicies() {
      // 许可证政策
      this.$backend.orgs.getByIdMode(this.orgId, 'license-policies').then(res => {
        this.orgsLicensePolicies = res.results;
        // console.log(res);
      
      });
    },
    getLicenseList() {
      // 添加许可证相关
      this.$backend.licenses.getList().then(res => {
        this.licenseList = res.results;
        // console.log(res);
        
      })
    },
    getLicenseAttributes() {
      // 添加许可证属性相关
      this.$backend.licenses.attributes.getList().then(res => {
        this.licenseAttributes = res.results;
        // console.log(res);
        
      })
    },
    getPolicyRules() {
      // 列表相关
      this.$backend.orgs.licensePolicies.getByIdMode(this.orgId, this.policyId, 'license-policy-rules').then(res => {
        this.policyRules = res.results;
        console.log(this.policyRules);
        res.results.forEach((ele, i) => {
          if (ele['rule_type'] === 'license') {
            switch (ele['action']) {
              case 'approve':
                this.approvePolicy.push(ele);
                break;

              case 'flag':
                this.flagPolicy.push(ele);
                break;

              case 'deny':
                this.denyPolicy.push(ele);
                break;
            
              default:
                break;
            }
          } else if (ele['rule_type'] === '') {
            switch (ele['action']) {
              case 'appove':
                this.approvePolicyAttr.push(ele);
                break;
                
              case 'flag':
                this.flagPolicyAttr.push(ele);
                break;

              case 'deny':
                this.denyPolicyAttr.push(ele);
                break;
            
              default:
                break;
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.license-policy-list {
  td {
    width: 33.33%;
    div {
      height: 50px;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
