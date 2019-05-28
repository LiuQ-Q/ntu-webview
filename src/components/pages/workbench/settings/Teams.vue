<template>
  <div>
    <b-button class="my-3">创建</b-button>
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
  data() {
    return {
      items: [
        { name: 'test1', abstract: 'Default team for organization test1' }
      ]
    }
  }
}
</script>

<style>

</style>
