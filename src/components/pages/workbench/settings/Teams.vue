<template>
  <div>
    <b-button 
      class="my-3"
      @click="$bvModal.show('create-team')"
    >创建</b-button>

    <b-modal 
      id="create-team"
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
      :items="items"
      :fields="[
        { key: 'name', label: '名称' },
        { key: 'abstract', label: '简介' }
      ]"
      bordered
    >
      <template slot="name" slot-scope="data">
        <b-link to="/settings/teams/1">{{ data.item.name }}</b-link>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  computed: {
    teamNameState() {
      return this.teamName ? true : false;
    }
  },
  data() {
    return {
      items: [
        { name: 'test1', abstract: 'Default team for organization test1' }
      ],
      teamName: ''
    }
  },
  methods: {
    creatTeam() {

    }
  }
}
</script>

<style>

</style>
