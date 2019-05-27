<template>
  <div>
    <b-navbar 
      type="dark" 
      variant="dark"
    >
      <b-navbar-brand 
        href="/"
      >{{ $t('header') }}</b-navbar-brand>
      <b-link
        v-for="(nav, index) in navs"
        :key="index"
        :href="nav.url"
        variant="outline-light"
        class="ml-5"
        style="color:rgba(255, 255, 255, 0.75)"
      >{{ nav.name }}</b-link>
      <b-navbar-nav class="ml-auto" style="float:right;"> 
        <!-- <b-nav-item-dropdown right>
          <template slot="button-content">语言</template>
          <b-dropdown-item @click="$i18n.locale='zh'">中文</b-dropdown-item>
          <b-dropdown-item @click="$i18n.locale='en'">English</b-dropdown-item>
        </b-nav-item-dropdown> -->
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
  data() {
    return {
      navs: [
        { name: '总览', url: '#/dashboard' },
        { name: '项目', url: '#/projects' },
        { name: '组件', url: '#' },
        { name: '漏洞', url: '#' },
        { name: '许可证', url: '#' },
        { name: '关系网', url: '#' }
      ]
    }
  }
}
</script>

<style lang="less">

</style>
