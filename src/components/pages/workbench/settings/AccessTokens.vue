<template>
  <div class="mt-3">
    <b-form class="signin-form">
      <b-form-group label="创建令牌">
        <b-form-input 
          placeholder="名称" 
          style="width:50%;"
          v-model="email"
        ></b-form-input>
      </b-form-group>
      <b-button>创建</b-button>
    </b-form>

    <b-table
      :items="items"
      :fields="[
        { key: 'name', label: '名称' },
        { key: 'permission', label: '创建者' },
        { key: 'action', label: '操作' },
      ]"
      class="mt-3"
    >

    </b-table>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
