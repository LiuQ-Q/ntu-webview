<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand href="#">{{ $t('header') }}</b-navbar-brand>
      <b-navbar-nav class="ml-auto" style="float:right;"> 
        <b-nav-item-dropdown right>
          <template slot="button-content">语言</template>
          <b-dropdown-item @click="$i18n.locale='zh'">中文</b-dropdown-item>
          <b-dropdown-item @click="$i18n.locale='en'">English</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right>
          <template slot="button-content">用户</template>
          <b-dropdown-item>用户信息</b-dropdown-item>
          <b-dropdown-item>退出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">

</style>
