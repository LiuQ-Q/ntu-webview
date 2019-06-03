<template>
  <b-container>
    <div class="mb-5">
      <h1>组件</h1>
    </div>
    <b-table
      :fields="[
        { key: 'libraries', label: '组件' },
        { key: 'vulnerabilities', label: '漏洞' },
        { key: 'licenses', label: '许可证' },
      ]" 
      :items="[{}]"
      class="libraries-overview"
    >
      <template slot="libraries">
        <p>组件数量:&nbsp;{{ librarySummary['library_versions_total'] }}</p>
        <p v-if="librarySummary['vulnerable_library_versions'] !== undefined">存在漏洞的组件:&nbsp;{{ librarySummary['vulnerable_library_versions'].total || '0'}}</p>
        <p v-if="librarySummary['vulnerable_library_versions'] !== undefined">存在许可证问题的组件:&nbsp;{{ librarySummary['library_licenses'].total || '0' }}</p>
      </template>

      <template slot="vulnerabilities">
        <highcharts
          v-if="vulTotalCount !== 0"
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
                ['超高风险', vulCount['critical']],
                ['高风险', vulCount['high']],
                ['中等风险', vulCount['medium']],
                ['低风险', vulCount['low']],
                ['未知', vulCount['none']],
              ]
            }],
            pie: {
              showInLegend: true
            }
          }"
        ></highcharts>
        <span v-if="vulTotalCount === 0">未发现问题</span>
      </template>

      <template slot="licenses">
        <highcharts
          v-if="licTotalCount !== 0"
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
                ['受限的', licCount['deny']],
                ['被标记的', licCount['flag']],
                ['被允许的', licCount['approve']],
              ]
            }],
            pie: {
              showInLegend: true
            }
          }"
        ></highcharts>
        <span v-if="licTotalCount === 0">未发现问题</span>
      </template>
    </b-table>

    <b-table 
      :fields="[
        { key: 'name', label: '项目' },
        { key: 'library_count', label: '已搜到的组件' },
        { key: 'vul_total_count', label: '漏洞' },
        { key: 'lic_issue_total_count', label: '许可证问题' },
        { key: 'scan_modified', label: '最后扫描' },
        { key: 'scan', label: '情况' },
      ]"
      :items="libraryOverview"
      class="libraries-by-project text-center"
    >
      <template slot="thead-top">
        <h4>按项目分类</h4>
      </template>

      <template slot="name" slot-scope="data">
        <b-link :to="`projects/${data.item.id}`">{{ data.item.name }}</b-link>
      </template>

      <template 
        slot="scan_modified" 
        slot-scope="data"
      >{{ Math.round((Date.now() - Date.parse(data.item['scan_modified'])) / (1000 * 60 * 60 *24)) }}&nbsp;天前</template>

      <template 
        slot="scan" 
        slot-scope="data"
      >
        <b-link :to="`projects/${data.item.id}/libraries/${data.item['latest_completed_scan_id']}`">查看</b-link>
      </template>
    </b-table>

    <b-table 
      :fields="[
        { key: 'library_name', label: '组件' },
        { key: 'module_name', label: '模组' },
        { key: 'version_number', label: '版本' },
        { key: 'total_count', label: '漏洞' },
        { key: 'license_name', label: '许可证' },
        { key: 'project_count', label: '受影响项目' },
        { key: 'result', label: '结果' },
        { key: 'detail', label: '详情' },
      ]"
      :items='groupByLibrary'
      class="libraries-by-library text-center"
    >
      <template slot="thead-top">
        <h4>按组件分类</h4>
      </template>

      <template 
        slot="project_count"
        slot-scope="data"
      >
        <div
          v-for="(name, index) in data.item['project_names']"
          :key="index"
        >
          <b-link :to="`projects/${data.item.projects[index]}`">{{ name }}</b-link>
        </div>
      </template>

      <template 
        slot="result"
        slot-scope="data"
      >
        <div
          v-for="(name, index) in data.item['project_names']"
          :key="index"
        >
          <b-link :to="`projects/${data.item.projects[index]}/libraries/${data.item.scans[index]}`">查看</b-link>
        </div>
      </template>

      <template 
        slot="detail"
        slot-scope="data"
      >
        <div
          v-for="(name, index) in data.item['project_names']"
          :key="index"
        >
          <b-link :to="`projects/${data.item.projects[index]}/libraries/${data.item.scans[index]}/issue/${data.item['scan_library_version_ids'][index]}`">查看</b-link>
        </div>
      </template>

    </b-table>
  </b-container>
</template>

<script>

export default {
  data() {
    return {
      libraryItems: [
        { library: 'binary_test', module: 'asd', version: '1.0', vulnerabilities: 20, licenses: 'asdf', affect: 1 },
        { library: 'binary_test', module: 'asd', version: '1.0', vulnerabilities: 20, licenses: 'asdf', affect: 1 },
      ],
      orgId: this.$route.params.orgId,
      libraryOverview: [],
      librarySummary: {},
      groupByLibrary: [],
      vulCount: {
        none: 0,
        medium: 0,
        low: 0,
        high: 0,
        critical: 0
      },
      vulTotalCount: 0,
      licCount: {
        deny: 0,
        flag: 0,
        approve: 0
      },
      licTotalCount: 0
    }
  },
  mounted() {
    this.getLibraryOverview();
    this.getLibrarySummary();
    this.getgroupByLibrary();
  },
  methods: {
    async getLibraryOverview() {
      this.libraryOverview = (await this.$backend.orgs.projects.getListMode(this.orgId, 'library-version-overview')).results;
      this.libraryOverview.forEach((ele) => {
        this.vulCount.none += ele['none_count'];
        this.vulCount.medium += ele['medium_count'];
        this.vulCount.low += ele['low_count'];
        this.vulCount.high += ele['high_count'];
        this.vulCount.critical += ele['critical_count'];
        this.vulTotalCount += ele['vul_total_count']

        this.licCount.deny += ele['deny_count'];
        this.licCount.flag += ele['flag_count'];
        this.licCount.approve += ele['approve_count'];
        this.licTotalCount += ele['lic_issue_total_count']
      });
    },
    async getLibrarySummary() {
      this.librarySummary = await this.$backend.orgs.libraries.getListMode(this.orgId, 'library-version-summary');
    },
    async getgroupByLibrary() {
      this.groupByLibrary = (await this.$backend.orgs.libraries.getListMode(this.orgId, 'group-by-library-versions')).results;
    },
  }
}
</script>

<style lang='less'>
.libraries-overview {
  td {
    width: 33.33%;
  }
}
.libraries-by-project {
  td {
    width: 16.66%;
  }
}
.libraries-by-library {
  td {
    width: 13.5%;
  }
}
</style>
