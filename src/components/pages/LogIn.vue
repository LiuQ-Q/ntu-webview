<template>
  <b-card class="login">
    <b-form @submit.prevent="login" class="login-form">
      <b-form-group id="input-group-1" label="邮箱:" label-for="input-2">
        <b-form-input id="input-1" v-model="username" placeholder="Enter name"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="密码:" label-for="input-2">
        <b-form-input id="input-2" v-model="password" type="password" placeholder="password"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">登录</b-button>
      <!-- <b-button variant="success" @click="getList">获取</b-button> -->
    </b-form>
  </b-card>
</template>

<script>
import { sha256 } from 'js-sha256';

export default {
  data() {
    return {
      username: 'test1@scantist.com',
      password: '',
      orgId: '',
    };
  },
  methods: {
    async login() {
      try {
        await this.$backend.logIn(this.username, this.password);

        this.orgId = (await this.$backend.orgs.getList()).results[0].id;
        
        this.$router.push(`/workbench/${this.orgId}/dashboard`);
      } catch (error) {
        console.log(error)
      }
    },
    async getList() {
      this.teams = await this.$backend.orgs.sourcecodeUsage.getList(10);
    }
  }
}
</script>

<style lang="less">
.login {
  width: 500px;
  margin: 200px auto;
}
</style>

