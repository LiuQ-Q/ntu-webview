<template>
  <div id="app">
    <my-header id="header"></my-header>
    <div id="sidebar">
      <side-bar></side-bar>
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import myHeader from '../components/Header.vue';
import sideBar from '../components/SideBar.vue';

export default {
  components: {
    myHeader,
    sideBar
  },
  mounted() {
    //console.log(this.axios.get('https://easy-mock.com/mock/5c1dfd98e8bfa547414a5278/bili/othersList?id=1'));
  }
}
</script>

<style lang='less'>
#sidebar {
  position: fixed;
  width: 250px;
  height: 100%;
  background-color: #32C2CD;
}

#content {
  position: fixed;
  left: 250px;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
  background-color: #E6E6E6;
}
</style>
