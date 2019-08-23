<template>
  <div>
    <b-button 
      class="my-3"
      @click="$bvModal.show('create-team')"
    >创建</b-button>

    <b-modal 
      id="create-team"
      ref="create-team"
      hide-footer
    >
      <template slot="modal-title">创建新小组</template>

      <b-form>
        <b-form-group label="名称:">
          <b-form-input
            v-model="teamName"
            :state="teamNameState"
            aria-describedby="create-team-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="create-team-feedback">名称不能为空!</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="简介:">
          <b-form-textarea
            v-model="teamDesc"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
      </b-form>

      <b-button 
        class="mt-3" 
        block
        @click="creatTeam"
      >创建</b-button>
    </b-modal>

    <b-table
      :items="teamList"
      :fields="[
        { key: 'name', label: '名称' },
        { key: 'description', label: '简介' },
        { key: 'action', label: '操作' },
      ]"
      bordered
    >
      <template slot="name" slot-scope="data">
        <b-link :to="`/workbench/1/settings/teams/${data.item.id}`">{{ data.item.name }}</b-link>
      </template>

      <template slot="action" slot-scope="data">
        <b-button
          v-if="data.item.id !== 1"
          size="sm"
          @click="deleteTeam(data.item.id)"
        >移除</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamName: '',
      teamDesc: '',

      teamList: []
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
    this.getTeameList();
  },
  methods: {
    getTeameList() {
      this.$backend.orgs.teams.getList(this.orgId).then(res => {
        this.teamList = res.results;
        // console.log(res);
        
      });
    },
    creatTeam() {
      this.$backend.orgs.teams.create(this.orgId, this.teamName, this.teamDesc).then(res => {
        this.getTeameList();
        this.$refs['create-team'].hide();
      });
    },
    deleteTeam(id) {
      this.$backend.orgs.teams.deleteById(this.orgId, id).then(res => {
        this.getTeameList();
      })
    }
  }
}
</script>

<style>

</style>
