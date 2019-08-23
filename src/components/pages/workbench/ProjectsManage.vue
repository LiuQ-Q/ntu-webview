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

          <b-form-group label="类型">
            <b-form-select
              v-model="projectType"
              class="mb-2"
            >

              <option value="1">源代码</option>
              <option value="2">二进制</option>

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
        <b-button 
          class="mt-3" 
          block
          @click="uploadFile"
        >确定</b-button>
      </b-modal>

      <b-table
        :fields="[
          { key: 'name', label: '已添加项目' },
          { key: 'manage', label: '操作' }
        ]"
        :items="projectList"
        class="project-manage-list mt-3"
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
import dateFormat from 'dateformat';

export default {
  data() {
    return {
      projectName: '',
      projectTeam: '',
      projectType: '',
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
    getProjectList() {
      this.$backend.orgs.projects.getList(this.orgId).then(res => {
        this.projectList = res.results;
      console.log(this.projectList);
      });
      
    },
    getTeamList() {
      this.$backend.orgs.teams.getList(this.orgId).then(res => {
        this.teamList = res.results;
        this.projectTeam = res.results[0].id;
      })
    },
    
    deleteProject(projectId) {
      this.$backend.orgs.projects.deleteById(this.orgId, projectId).then(res => {
        this.getProjectList();
      })
    },
    updateProject(projectId) {
      this.$backend.orgs.projects.updateById(this.orgId, projectId).then(res => {
        this.getProjectList();
      });
    },
    createProject() {
      this.$backend.orgs.projects.create(this.orgId, this.projectName, this.projectTeam, this.projectAbstract, 'upload', this.projectType).then(res => {
        this.$refs['add-new-project'].hide();
        this.$refs['upload-file'].show();
      });

      this.$backend.orgs.projects.getList(this.orgId).then(res => {
        this.projectList = res.results;
      })
    },
    uploadFile() {
      const fileModified = dateFormat(this.file.lastModifiedDate, 'yyyy-mm-dd HH:mm:ss');
      const fileSize = this.file.size / (1024*1024);
      
      const formData = new FormData();
      formData.append('file', this.file);

      this.$backend.upload.create(formData).then(res => {
        this.$backend.orgs.projects.getList(this.orgId).then(res => {
          this.$backend.projects.uploads.create(res.results[0].id, this.file.name, fileModified, fileSize, this.file.name).then(res => {
            this.$bvToast.toast('文件上传成功', {
              title: null,
              variant: 'primary',
              toaster: 'b-toaster-top-center',
              autoHideDelay: 2000,
              noCloseButton: true,
              solid: true
            });
            this.$refs['upload-file'].hide();
            this.getProjectList();
          });
        });
      })

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

  .project-manage-list {
    width: 50%;

    td:nth-child(1) {
      width: 50%;
    }
  }
}
</style>
