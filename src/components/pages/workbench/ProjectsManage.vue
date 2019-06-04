<template>
  <b-container class="project-manage">
    <div class="mb-5">
      <h1>项目</h1>
    </div>
      <b-button
         variant="primary"
        @click="$bvModal.show('add-new-project')"
      >添加本地项目</b-button>
      
      <b-modal 
        id="add-new-project"
        ref="add-new-project"
        hide-footer
      >
        <template slot="modal-title">添加新项目</template>

        <b-form class="signin-form">
          <b-form-group label="名称:">
            <b-form-input
              v-model="projectName"
              :state="Boolean(projectName)"
              aria-describedby="add-project-feedback"
            ></b-form-input>
            <b-form-invalid-feedback id="add-project-feedback">
              名称不能为空!
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="小组">
            <b-form-select
              v-model="projectTeam"
              class="mb-2"
            >
              <option 
                v-for="(team, index) in teamList"
                :key="index"
                :value="team.id"
              >{{ team.name }}</option>

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
          @click="createProject"
        >下一步</b-button>
      </b-modal>

      <b-modal
        ref="upload-file"
        hide-footer
      >
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="选择文件..."
          drop-placeholder="将文件放在这..."
        ></b-form-file>
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
            style="color:red;"
          >恢复</b-link>
        </template>
      </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      projectName: '',
      projectTeam: '',
      projectAbstract: '',
      file: {},

      orgId: this.$route.params.orgId,
      projectList: [],
      teamList: []
    }
  },
  watch: {
    file() {
      console.log(this.file);
      
    }
  },
  mounted() {
    this.getProjectList();
    this.getTeamList();
  },
  methods: {
    async getProjectList() {
      this.projectList = (await this.$backend.orgs.projects.getList(this.orgId)).results;
    },
    async getTeamList() {
      this.teamList = (await this.$backend.orgs.teams.getList(this.orgId)).results;
      this.projectTeam = this.teamList[0].id;
    },
    
    async deleteProject(projectId) {
      this.$backend.orgs.projects.deleteById(this.orgId, projectId);
      // this.projectList = (await this.$backend.orgs.projects.getList(this.orgId)).results;
      this.$router.go(0);
    },
    async updateProject(projectId) {
      this.$backend.orgs.projects.updateById(this.orgId, projectId);
      // this.projectList = (await this.$backend.orgs.projects.getList(this.orgId)).results;
      this.$router.go(0);
    },
    createProject() {
      this.$backend.orgs.projects.create(this.orgId, this.projectName, this.projectTeam, this.projectAbstract, 'upload');

      this.$backend.orgs.projects.getList(this.orgId).then(res => {
        this.projectList = res.results;
      })

      this.$refs['add-new-project'].hide();
      this.$refs['upload-file'].show();
    },
    uploadFile() {
      
    },
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
