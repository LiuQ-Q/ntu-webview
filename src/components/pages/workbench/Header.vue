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
        class="ml-5"
        style="color:rgba(255, 255, 255, 0.5);"
      >{{ nav.name }}</b-link>

      <b-navbar-nav class="ml-auto" style="float:right;"> 
        <b-nav-item-dropdown right style="float:right;">
          <template slot="button-content">用户</template>
          <b-dropdown-item>用户信息</b-dropdown-item>
          <b-dropdown-item>退出</b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- <b-nav-item-dropdown right style="float:right;">
          <template slot="button-content">语言</template>
          <b-dropdown-item @click="$i18n.locale='zh'">中文</b-dropdown-item>
          <b-dropdown-item @click="$i18n.locale='en'">English</b-dropdown-item>
        </b-nav-item-dropdown> -->
      </b-navbar-nav>
    </b-navbar>
    <b-container>
      <b-nav tabs>
        <b-nav-item-dropdown
          text="test1"
          left
        >
          <b-dropdown-item>test1</b-dropdown-item>
          <b-dropdown-item>test2</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item to='/settings'>机构设置</b-dropdown-item>
          <b-dropdown-item to='/createorg'>创建机构</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navs: [
        { name: '总览', url: '#/dashboard' },
        { name: '项目', url: '#/projects' },
        { name: '组件', url: '#/libraries' },
        { name: '漏洞', url: '#/vulnerabilities' },
        { name: '许可证', url: '#/licenses' },
        { name: '关系网', url: '#/knowledge-graph' }
      ],
      orgList: []
    }
  },
  mounted() {
    this.getOrgList();
  },
  methods: {
    async getOrgList() {
      this.orgList = (await this.$backend.orgs.getList()).result;
      console.log(this.orgList);
    }
  }
}
</script>

<style lang="less">

</style>
