<template>
  <div id="app">
    <my-header id="header"></my-header>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import myHeader from './workbench/Header.vue';

export default {
  components: {
    myHeader,
  }
}
</script>

<style lang="less">
  #content {
    padding-top: 20px;
  }
</style>
