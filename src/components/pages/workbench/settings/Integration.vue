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
        <b-link>创建</b-link>
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
  }
}
</script>

<style>

</style>
