<template>
    <b-card class="signin">
      <b-form @submit.prevent="signin">
        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input id="input-2" v-model="username" required placeholder="Enter name"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input id="input-2" v-model="password" required placeholder="password"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">denglu</b-button>
        <b-button variant="success" @click="getTeamList">huoqu</b-button>
      </b-form>
      {{teams}}
    </b-card>
</template>

<script>
export default {
  data() {
    return {
      username: 'test1@scantist.com',
      password: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',
      teams: []
    };
  },
  methods: {
    async signin() {
      try {
        await this.$xhr.signIn(this.username, this.password);
      } catch (error) {
        console.log(error)
      }
    },
    async getTeamList() {
      this.teams = await this.$xhr.getTeamList();
    }
  }
}
</script>

<style lang="less">
.signin {
  width: 500px;
	position: absolute;
	top: 50%;   
	left: 50%;
	transform: translate(-50%, -50%);   
}
</style>

