<template>
  <b-container class="project-manage">
    <div class="mb-5">
      <h1>项目</h1>
    </div>

    <b-tabs content-class="mt-3">
      <b-tab 
        title="Github" 
        active
      >
        <b-button>连接</b-button>
      </b-tab>

      <b-tab title="Gitlab">
        <b-button>连接</b-button>
      </b-tab>

      <b-tab title="Bitbucket">
        <b-button>连接</b-button>
      </b-tab>

      <b-tab title="本地上传">
        <b-button @click="$bvModal.show('add-new-project')">添加本地项目</b-button>
        <b-modal 
          id="add-new-project"
          hide-footer
        >
          <template slot="modal-title">添加新项目</template>

          <b-form class="signin-form">
            <b-form-group label="名称:">
              <b-form-input></b-form-input>
            </b-form-group>

            <b-form-group label="小组">
              <b-form-select
                v-model="projectTeam"
                class="mb-2"
              >
                <option value="test1">test1</option>
              </b-form-select>
            </b-form-group>

            <b-form-group label="简介:">
              <b-form-textarea
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </b-form>

          <b-button 
            class="mt-3" 
            block
            @click="addNewProject"
          >添加</b-button>
        </b-modal>
        <b-table
          :fields="[
            { key: 'name', label: '已添加项目' },
            { key: 'manage', label: '操作' }
          ]"
          :items="projectList"
          class="mt-3"
        >
          <template 
            slot="name" 
            slot-scope="data"
          >
            <b-link :to="`projects/${data.item.id}`">{{ data.item.fullname }}</b-link>
          </template>

          <template 
            slot="manage"
            slot-scope="data"
          >
            <b-link 
              v-if="data.item['can_scan']"
              @click="deleteProject(data.item.id)"
            >隐藏</b-link>
            <b-link 
              v-if="!data.item['can_scan']"
              @click="updateProject(data.item.id)"
            >恢复</b-link>
          </template>
        </b-table>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      projectTeam: '',
      addedProjects: [
        { name: 'test1' },
        { name: 'test2' },
        { name: 'test3' },
      ],

      orgId: this.$route.params.orgId,
      projectList: []
    }
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    async getProjectList() {
      this.projectList = (await this.$backend.orgs.projects.getList(this.orgId)).results;
      console.log(this.projectList);
      
    },
    addNewProject() {

    },
    async deleteProject(projectId) {
      this.$backend.orgs.projects.deleteById(this.orgId, projectId);
      this.projectList = (await this.$backend.orgs.projects.getList(this.orgId)).results;
    },
    async updateProject(projectId) {
      this.$backend.orgs.projects.updateById(this.orgId, projectId);
      this.projectList = (await this.$backend.orgs.projects.getList(this.orgId)).results;
    }
  }
}
</script>

<style lang="less">
.project-manage {
  .nav-tabs {
    .nav-item {
      float: left;
    }
    
    &:after {
      content: "";
      display: block;
      height: 0;
      clear:both;
      visibility: hidden;
    }
  }
}
</style>
