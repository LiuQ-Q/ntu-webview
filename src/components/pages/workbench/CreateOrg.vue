<template>
  <b-container>
    <div class="mb-5">
      <h1>创建机构</h1>
    </div>

    <b-form style="width:50%;">
      <b-form-group label="机构名称:">
        <b-form-input
          v-model="orgName"
          :state="orgNameState"
          aria-describedby="create-org-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="create-org-feedback">
          名称至少2个字符!
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="简介:">
        <b-form-textarea
          rows="6"
          max-rows="6"
          v-model="orgDesc"
        ></b-form-textarea>
      </b-form-group>

      <b-button 
        variant="primary"
        @click="createOrg"
      >创建</b-button>
    </b-form>
  </b-container>
</template>

<script>
export default {
  computed: {
    orgNameState() {
      return this.orgName ? true : false
    }
  },
  data() {
    return {
      orgName: '',
      orgDesc: ''
    }
  },
  methods: {
    createOrg() {
      this.$backend.orgs.create(this.orgName, this.orgDesc).then(res => {
        console.log(res);
        
      });
    }
  }
}
</script>

<style>

</style>
