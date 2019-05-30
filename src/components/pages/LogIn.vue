<template>
  <b-card class="login">
    <b-form @submit.prevent="login" class="login-form">
      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input id="input-2" v-model="username" placeholder="Enter name"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input id="input-2" v-model="password" placeholder="password"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">denglu</b-button>
      <b-button variant="success" @click="getList">huoqu</b-button>
    </b-form>
    {{teams}}
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      teams: []
    };
  },
  methods: {
    async login() {
      try {
        await this.$backend.logIn(this.username, this.password);
      } catch (error) {
        console.log(error)
      }
    },
    async getList() {
      this.teams = await this.$backend.orgs.getList();
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

