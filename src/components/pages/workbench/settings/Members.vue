<template>
  <div class="mt-3">
    <b-form class="signin-form">
      <b-form-group label="输入您要邀请的新用户的邮箱">
        <b-form-input 
          placeholder="邮箱地址" 
          style="width:50%;"
          v-model="email"
        ></b-form-input>
      </b-form-group>
      <b-button>邀请</b-button>
    </b-form>

    <b-table
      :items="items"
      :fields="[
        { key: 'name', label: '名称' },
        { key: 'permission', label: '权限' },
      ]"
      class="mt-3"
    >

    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      items: [
        {name: 'haha', permission: '拥有者'}
      ]
    }
  }
}
</script>

<style>

</style>
