<template>
  <div>
    <b-navbar 
      type="dark" 
      variant="dark"
    >
      <a href="/">
        <img 
          src="../../../assets/img/logo.png" 
          class="rounded-circle mr-3" 
          style="width:40px;"
        >
      </a>

      <b-navbar-brand href="/" style="margin-right:0;">{{ $t('header') }}</b-navbar-brand>

      <b-link
        v-for="(nav, index) in navs"
        :key="index"
        :to="`/workbench/${orgId}/${nav.url}`"
        class="ml-4"
        style="color:rgba(255, 255, 255, 0.5);"
      ><i 
        :class="`${nav.icon} pr-2`"
        style="color:#ddd;"
      ></i>{{ nav.name }}</b-link>

      <b-navbar-nav class="ml-auto" style="float:right;"> 
        <b-nav-item-dropdown right style="float:right;">
          <template slot="button-content">
            <i class="fas fa-user" style="color:#ddd;"></i>
          </template>
          <b-dropdown-item to="user">用户设置</b-dropdown-item>
          <b-dropdown-item @click="logOut">退出</b-dropdown-item>
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
          :text="orgName"
          left
        >
          <b-dropdown-item
            v-for="(org, index) in orgList"
            :key="index"
            @click="pageJump(org.id)"
          >{{ org.name }}</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item :to="`/workbench/${orgId}/settings`">机构设置</b-dropdown-item>
          <b-dropdown-item :to="`/workbench/${orgId}/createorg`">创建机构</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>
    </b-container>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      orgName: '',
      navs: [
        { name: '总览', url: 'dashboard', icon: 'fas fa-align-center' },
        { name: '项目', url: 'projects', icon: 'fas fa-project-diagram' },
        { name: '组件', url: 'libraries', icon: 'fas fa-cogs' },
        { name: '漏洞', url: 'vulnerabilities', icon: 'fas fa-bug' },
        { name: '许可证', url: 'licenses', icon: 'fas fa-award' },
        { name: '关系表', url: 'relational-tables', icon: 'fas fa-list-ul' }
      ],
      orgList: []
    }
  },
  computed: {
    orgId() {
      return this.$route.params.orgId;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    init() {
      this.getOrgList();
      this.getOrgById();
    },
    getOrgList() {
      this.$backend.orgs.getList().then(res => {
        this.orgList = res.results;
      });
    },
    getOrgById() {
      this.$backend.orgs.getById(this.$route.params.orgId).then(res => {
        this.orgName = res.name;
      });
    },
    logOut() {
      Cookies.remove('NTU_Token');
      this.$router.push('/login');
    },
    pageJump(id) {
      this.$router.push(`/workbench/${id}/dashboard`);
      this.$router.go(0);
    }
  }
}
</script>

<style lang="less">

</style>
