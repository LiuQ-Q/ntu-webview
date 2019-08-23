<template>
  <b-container>
    <div class="mb-5">
      <h1>总览</h1>
    </div>
    
    <b-table
      :fields="[
        { key: 'agency', label: '机构' },
        { key: 'project', label: '项目' },
        { key: 'user', label: '用户' },
        { key: 'scan', label: '扫描' },
      ]" 
      :items="[{}]"
      bordered
      class="dashboard-overview text-center"
    >
      <template slot="agency" slot-scope="data">{{ orgName }}</template>
      <template slot="project" slot-scope="data">
        <b-link to="projects">{{ projectList.length }}/{{ sourcecodeUsage !== undefined ? sourcecodeUsage['project_number_limit'] : '10' }}</b-link>
      </template>
      <template slot="user" slot-scope="data">
        <b-link to="settings">{{ memberList.count }}/{{ sourcecodeUsage !== undefined ? sourcecodeUsage['member_number_limit'] : '10' }}</b-link>
      </template>
      <template slot="scan" slot-scope="data">
        <b-link to="projects">0/{{ sourcecodeUsage !== undefined ? sourcecodeUsage['monthly_scan_limit'] : '999999' }}</b-link>
      </template>
    </b-table>

    <b-table
      :fields="[
        { key: 'project', label: '项目情况' },
        { key: 'vulnerabilities', label: '漏洞警报' },
        { key: 'licenses', label: '许可证警报' },
      ]" 
      :items="[{}]"
      bordered
      class="dashboard-alarm text-center mt-5"
    >
      <!-- 项目情况 -->
      <template slot="project">
        <highcharts 
          v-if="!(projectsOverview['never-scanned'] === 0 
            && projectsOverview['outdated'] === 0 
            && projectsOverview['up-to-date'] === 0)"
        :options="{
          credits: { enabled: false },
          chart: {
            type: 'pie'
          },
          title: {
            text: null
          },
          plotOptions: {
            pie: {
              showInLegend: true
            }
          },
          series: [{
            data: [
              ['未扫描', projectsOverview['never-scanned']],
              ['未更新', projectsOverview['outdated']],
              ['已更新', projectsOverview['up-to-date']]
            ]
          }],
          pie: {
            showInLegend: true
          }
        }"></highcharts>
        <span 
          v-if="projectsOverview['never-scanned'] === 0 
            && projectsOverview['outdated'] === 0 
            && projectsOverview['up-to-date'] === 0"
        >无项目</span>
        <b-table
          v-if="!(projectsOverview['never-scanned'] === 0 
            && projectsOverview['outdated'] === 0 
            && projectsOverview['up-to-date'] === 0)"
          :fields="[
            { key: 'name', label: '名称' },
            { key: 'status', label: '状态' },
          ]" 
          :items='projectList'
        >
          <template 
            slot="name" 
            slot-scope="data"
          >
            <b-link :to="`projects/${data.item.id}`">{{ data.item.name }}</b-link>
          </template>
          <template 
            slot="status" 
            slot-scope="data"
          >
            <div :style="`color:${data.item.status === 'up-to-date' ? '#74DA5F' : (data.item.status === 'never-scanned' ? 'red' : '#F7A35C')};`">{{ projectStatus[data.item.status] }}</div>
          </template>
        </b-table>
      </template>
      <!-- 漏洞警报 -->
      <template slot="vulnerabilities">
        <highcharts 
          v-if="!(issuesCount['critical'] === 0 
            && issuesCount['high'] === 0 
            && issuesCount['medium'] === 0 
            && issuesCount['low'] === 0 
            && issuesCount['none'] === 0)"
          :options="{
            credits: { enabled: false },
            chart: {
              type: 'pie'
            },
            title: {
              text: null
            },
            plotOptions: {
              pie: {
                showInLegend: true
              }
            },
            series: [{
              data: [
                ['超高风险', issuesCount['critical']],
                ['高风险', issuesCount['high']],
                ['中等风险', issuesCount['medium']],
                ['低风险', issuesCount['low']],
                ['未知', issuesCount['none']],
              ]
            }],
            pie: {
              showInLegend: true
            }
          }"></highcharts>

        <span 
          v-if="issuesCount['critical'] === 0 
            && issuesCount['high'] === 0 
            && issuesCount['medium'] === 0 
            && issuesCount['low'] === 0 
            && issuesCount['none'] === 0"
        >未发现问题</span>

        <b-table
          v-if="!(issuesCount['critical'] === 0 
            && issuesCount['high'] === 0 
            && issuesCount['medium'] === 0 
            && issuesCount['low'] === 0 
            && issuesCount['none'] === 0)"
          :fields="[
            { key: 'name', label: '名称' },
            { key: 'problem', label: '问题' },
          ]" 
          :items='latestCompletedScan'
        >
          <template 
            slot="name" 
            slot-scope="data"
          >
            <b-link :to="`projects/${data.item.project}`">{{ data.item['project_name'] }}</b-link>
          </template>

          <template 
            slot="problem"
            slot-scope="data"
          >{{ data.item['scan_issues_count'] }}</template>
        </b-table>
      </template>
      <!-- 许可证警报 -->
      <template slot="licenses">
        <highcharts
          v-if="!(licensesOverview['not_in_rules'] === 0 
            && licensesOverview['deny'] === 0 
            && licensesOverview['flag'] === 0 
            && licensesOverview['approve'] === 0)"
          :options="{
            credits: { enabled: false },
            chart: {
              type: 'pie'
            },
            title: {
              text: null
            },
            plotOptions: {
              pie: {
                showInLegend: true
              }
            },
            series: [{
              data: [
                ['未定义的', licensesOverview['not_in_rules']],
                ['受限的', licensesOverview['deny']],
                ['被标记的', licensesOverview['flag']],
                ['被允许的', licensesOverview['approve']],
              ]
            }],
            pie: {
              showInLegend: true
            }
          }"></highcharts>

        <span 
          v-if="licensesOverview['not_in_rules'] === 0 
            && licensesOverview['deny'] === 0 
            && licensesOverview['flag'] === 0 
            && licensesOverview['approve'] === 0"
        >未发现问题</span>

        <b-table
          v-if="!(licensesOverview['not_in_rules'] === 0 
            && licensesOverview['deny'] === 0 
            && licensesOverview['flag'] === 0 
            && licensesOverview['approve'] === 0)"
          :fields="[
            { key: 'name', label: '名称' },
            { key: 'problem', label: '问题' },
          ]" 
          :items='latestCompletedScan'
        >
          <template 
            slot="name" 
            slot-scope="data"
          >
            <b-link :to="`projects/${data.item.project}`">{{ data.item['project_name'] }}</b-link>
          </template>

          <template 
            slot="problem"
            slot-scope="data"
          >{{ data.item['license_issues_count'] }}</template>
        </b-table>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      orgName: '',
      sourcecodeUsage: {},
      projectStatus: {
        'never-scanned': '未扫描',
        'outdated': '未更新',
        'up-to-date': '已更新',
      },
      projectsOverview: {},
      projectList: [],
      latestCompletedScan: [],
      issuesCount: {
        none: 0,
        medium: 0,
        low: 0,
        high: 0,
        critical: 0
      },
      memberList: {},
      licensesOverview: {}
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
      this.getProjectsOverview();
      this.getProjectList();
      this.getIssuesSummary();
      this.getMemberList();
      this.getLicensesOverview();
      this.getSourcecodeUsage();
      this.getOrgById();
    },
    getProjectsOverview() {
      this.$backend.orgs.projects.getListMode(this.orgId, 'overview').then(res => {
        this.projectsOverview = res
      });
    },
    getProjectList() {
      this.$backend.orgs.projects.getList(this.orgId).then(res => {
        this.projectList = res.results.filter(project => {
          return project['can_scan']
        });
        console.log(this.projectList);
        
        this.projectList.forEach((result, index) => {
          if (result.latestCompletedScan) {
            this.latestCompletedScan.push(result.latestCompletedScan);
          }
        });
      });
    },
    getIssuesSummary() {
      this.$backend.orgs.issues.getListMode(this.orgId, 'issue-summary').then(res => {

        Object.keys(res).forEach((key) => {
          this.issuesCount.none += res[key].none;
          this.issuesCount.medium += res[key].medium;
          this.issuesCount.low += res[key].low;
          this.issuesCount.high += res[key].high;
          this.issuesCount.critical += res[key].critical;
        });
      });
      
    },
    getMemberList() {
      this.$backend.orgs.members.getList(this.orgId).then(res => {
        this.memberList = res;
      });
    },
    getLicensesOverview() {
      this.$backend.orgs.licenses.getListMode(this.orgId, 'overview').then(data => {
        this.licensesOverview = data;
      }, error => {
        this.licensesOverview = {};
      });
    },
    getSourcecodeUsage() {
      this.$backend.orgs.sourcecodeUsage.getList(this.orgId).then(res => {
        this.sourcecodeUsage = res.results[0];
      });
    },
    getOrgById() {
      this.$backend.orgs.getById(this.orgId).then(res => {
        this.orgName = res.name;
      });
    },
  }
}
</script>

<style lang='less'>
.dashboard-overview {
  td {
    width: 25%;
  }
}
.dashboard-alarm {
  td {
    width: 33.33%;
  }
}
</style>
