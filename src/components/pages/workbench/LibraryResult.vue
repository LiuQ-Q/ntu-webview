<template>
  <b-container>
    <div class="mb-5">
      <h1>组件扫描结果</h1>
    </div>

    <b-table
      :fields="[
        { key: 'overview', label: '总览' },
        { key: 'vulnerabilities', label: '漏洞' },
        { key: 'licenses', label: '许可证' },
      ]" 
      :items='items'
      class="library-result-overview"
    >
      <template slot="overview">
        <p>项目名称:&nbsp;{{ scansOverview['project_name'] }}</p>
        <p>组件数量:&nbsp;{{ scansOverview['library_count'] }}</p>
        <p>已发现组件漏洞:&nbsp;{{ scansOverview['vulnerable_libraries_count'] }}</p>
        <p>已发现许可证问题的组件:&nbsp;{{ scansOverview['library_with_lic_issue'] }}</p>
      </template>

      <template slot="vulnerabilities">
        <highcharts
          v-if="scansOverview['total_scan_issues'] !== 0 && scansOverview['scan_issues_overview'] !== undefined"
          :options="{
            chart: {
              type: 'pie'
            },
            title: {
              text: null
            },
            plotOptions: {
              pie: {
                shadow: false,
                showInLegend: true
              }
            },
            series: [{
              data: [
                ['超高风险', scansOverview['scan_issues_overview']['critical_scan_issues']],
                ['高风险', scansOverview['scan_issues_overview']['high_scan_issues']],
                ['中等风险', scansOverview['scan_issues_overview']['medium_scan_issues']],
                ['低风险', scansOverview['scan_issues_overview']['low_scan_issues']],
                ['未知', scansOverview['scan_issues_overview']['none_scan_issues']],
              ]
            }],
            pie: {
              showInLegend: true
            }
          }"
        ></highcharts>
        <span v-if="scansOverview['total_scan_issues'] === 0">未发现问题</span>
      </template>

      <template slot="licenses">
        <highcharts
          v-if="scansOverview['library_with_lic_issue'] !== 0 && scansOverview['license_issues_overview'] !== undefined"
          :options="{
            chart: {
              type: 'pie'
            },
            title: {
              text: null
            },
            plotOptions: {
              pie: {
                shadow: false,
                showInLegend: true
              }
            },
            series: [{
              data: [
                ['受限的', scansOverview['license_issues_overview']['deny']],
                ['被标记的', scansOverview['license_issues_overview']['flag']],
                ['被允许的', scansOverview['license_issues_overview']['approve']],
              ]
            }],
            pie: {
              showInLegend: true
            }
          }"
        ></highcharts>
        <span v-if="scansOverview['library_with_lic_issue'] === 0">未发现问题</span>
      </template>
    </b-table>

    <b-table 
      :fields="[
        {key: 'name', label: '名称'},
        {key: 'version', label: '版本'},
        {key: 'module', label: '模组'},
        {key: 'vulnerabilities', label: '漏洞'},
        {key: 'licenses', label: '许可证'},
        {key: 'detail', label: '详情'},
      ]" 
      :items='scansLibrary'
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h5>组件清单</h5>
          </th>
          <th>
            <b-button
              size="sm"
              v-if="scansById['lib_report_status'] !== 'N.A.'"
              @click="downloadRepo"
            >下载</b-button>
            <b-button
              size="sm"
              v-if="scansById['lib_report_status'] === 'N.A.'"
              @click="exportRepo"
            >导出</b-button>
          </th>
          <th colspan="4"></th>
        </tr>  
      </template>

      <template 
        slot="name"
        slot-scope="data"
      >{{ data.item['library_version'].library.name }}</template>
      <template 
        slot="version"
        slot-scope="data"
      >{{ data.item['library_version']['version_number'] }}</template>
      <template 
        slot="module"
        slot-scope="data"
      >{{ data.item['module_name'] }}</template>
      <template 
        slot="vulnerabilities"
        slot-scope="data"
      >{{ data.item['vul_total_count'] }}</template>
      <template 
        slot="licenses"
        slot-scope="data"
      >{{ data.item['library_version'].license.identifier }}</template>

      <template 
        slot="detail"
        slot-scope="data"
      >
        <b-link :to="`${scanId}/issue/${data.item.id}`">查看</b-link>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {}
      ],
      librariesItems: [
        {
          name: 'aaaaa',
          version: '1.1.1',
          module: 'a.elf',
          vulnerabilities: '10',
          licenses: 'LGPL-2.1-or-later'
        },
        {
          name: 'bbbbb',
          version: '2.2.2',
          module: 'bbb',
          vulnerabilities: '15',
          licenses: 'LGPL-2.1-or-later'
        }
      ],

      orgId: this.$route.params.orgId,
      projectId: this.$route.params.projectId,
      scanId: this.$route.params.scanId,
      scansOverview: {}, // 总览信息
      scansLibrary: [], // 组件清单
      scansById: {},
      // projectById: {},
      // scansLibraryGraph: {},
      
    }
  },
  mounted() {
    this.getScansLibraryOverview();
    this.getScansLibrary();
    this.getScansById();
    // this.getProjectById();
    // this.getScansLibraryGraph();
  },
  methods: {
    async getScansLibraryOverview() {
      // 总览
      this.scansOverview = await this.$backend.scans.libraries.getListMode(this.scanId, 'overview');
      // console.log(this.scansOverview);
      
    },
    async getScansLibrary() {
      // 组件清单
      this.scansLibrary = (await this.$backend.scans.libraries.getList(this.scanId)).results;
      
    },
    getScansById() {
      // 扫描详细信息
      this.$backend.scans.getById(this.scanId).then(res => {
        this.scansById = res;
        console.log(res);
        
      });
    },
    // async getProjectById() {
    //   // 
    //   this.projectById = await this.$backend.projects.getById(this.projectId);
    //   // console.log(this.projectById);
    // },
    // async getScansLibraryGraph() {
    //   // 
    //   this.scansLibraryGraph = await this.$backend.scans.libraries.getListMode(this.scanId, 'dependency-graph');
    //   // console.log(this.scansLibraryGraph);
    // },
    downloadRepo() {

    },
    exportRepo() {
      this.$backend.export.libraries.export(this.scanId);
      this.getScansById();   
    },
  }
}
</script>

<style lang="less">
.library-result-overview {
  td {
    width: 33.33%;
  }
}
</style>
