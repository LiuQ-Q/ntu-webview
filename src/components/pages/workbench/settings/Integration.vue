<template>
  <div class="mt-5">
    <b-table
      :items="items"
      :fields="[
        { key: 'name', label: '名称' },
        { key: 'status', label: '状态' },
        { key: 'action', label: '操作' },
      ]"
    >
      <template slot="action">
        <b-link @click="$bvModal.show('create-integration')">创建</b-link>

        <b-modal 
          id="create-integration"
          hide-footer
        >
          <template slot="modal-title">创建JIRA集成</template>
          <b-form>
            <p>类型:&nbsp;JIRA</p>
            <b-form-group label="服务器URL:">
              <b-form-input></b-form-input>
            </b-form-group>
          </b-form>

          <b-button 
            class="mt-3" 
            block
            @click="creatIntegration"
          >创建</b-button>
        </b-modal>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { name: 'JIRA', status: '未连接' }
      ]
    }
  },
  methods: {
    creatIntegration() {

    }
  }
}
</script>

<style>

</style>
