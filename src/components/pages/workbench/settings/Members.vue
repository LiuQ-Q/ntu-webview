<template>
  <div class="mt-3">
    <b-form class="signin-form">
      <b-form-group label="输入您要邀请的新用户的邮箱">
        <b-form-input 
          placeholder="邮箱地址" 
          style="width:50%;"
          v-model="email"
        ></b-form-input>
      </b-form-group>
      <b-button @click="inviteMember">邀请</b-button>
    </b-form>

    <b-table
      :items="memberList"
      :fields="[
        { key: 'name', label: '名称' },
        { key: 'role', label: '权限' },
      ]"
      class="mt-3"
    >
      <template
        slot="name"
        slot-scope="data"
      >{{ data.item.user.username }}</template>

      <template
        slot="role"
        slot-scope="data"
      >{{ role[data.item.role] }}</template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      items: [
        {name: 'haha', permission: '拥有者'}
      ],

      memberList: [],
      role: {
        default: '拥有者',
        member: '组员'
      }
    }
  },
  computed: {
    teamNameState() {
      return this.teamName.length > 1 ? true : false;
    },
    orgId() {
      return this.$route.params.orgId;
    }
  },
  mounted() {
    this.getMemberList();
  },
  methods: {
    getMemberList() {
      this.$backend.orgs.members.getList(this.orgId).then(res => {
        this.memberList = res.results;
        console.log(res);
        
      });
    },
    inviteMember() {
      this.$backend.orgs.members.create(this.orgId, this.email).then(res => {
        this.$bvToast.toast('邀请成功', {
          title: null,
          variant: 'primary',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        })
      }, error => {
        this.$bvToast.toast('邀请失败', {
          title: null,
          variant: 'danger',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        })
      });

      this.getMemberList();
    }
  }
}
</script>

<style>

</style>
