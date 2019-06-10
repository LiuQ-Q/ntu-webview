<template>
  <b-container>
    <div class="mb-5">
      <h1>关系表</h1>
    </div>

    <b-table 
      :items="projects" 
      :fields="[
        { key: 'project', label: '项目' }, 
        { key: 'cve', label: 'CVE' }, 
        { key: 'bug', label: 'Bug' }, 
        'show_details'
      ]" 
      bordered
      class="relational-tables text-center"
    >
      <template
        slot="project"
        slot-scope="data"
      >{{ data.item.project }}</template>

      <template
        slot="cve"
        slot-scope="data"
      >{{ data.item.cve.length }}</template>

      <template
        slot="bug"
        slot-scope="data"
      >{{ data.item.bug.length }}</template>

      <template 
        slot="show_details" 
        slot-scope="row"
      >
        <b-button 
          size="sm" 
          @click="row.toggleDetails" 
          class="mr-2"
          variant="primary"
        >
          {{ row.detailsShowing ? '隐藏' : '查看'}}详情
        </b-button>
      </template>

      <template 
        slot="row-details" 
        slot-scope="row"
      >
        <h4 
          v-if="row.item.cve.length !== 0"
          class="py-3"
        >CVE详情</h4>
        <b-table
          v-if="row.item.cve.length !== 0"
          :items="row.item.cve"
          :fields="[
            { key: 'cveName', label: '名称' },
            { key: 'cveRisklevel', label: '危险等级' },
            { key: 'cveScore', label: '评分' },
          ]"
          id="graph-cve-detail"
          class="detail-list"
          :per-page="perPage"
          :current-page="row.item.cveCurrentPage"
          small
        >
          <template 
            slot="cveName"
            slot-scope="data"
          >{{ data.item.label }}</template>
          
          <template 
            slot="cveRisklevel"
            slot-scope="data"
          >{{ risklevel[data.item.properties.risklevel] }}</template>

          <template 
            slot="cveScore"
            slot-scope="data"
          >{{ data.item.properties.score }}</template>
        </b-table>

        <b-pagination
          v-if="row.item.cve.length !== 0"
          v-model="row.item.cveCurrentPage"
          :total-rows="row.item.cve.length"
          :per-page="perPage"
          aria-controls="graph-cve-detail"
          class="my-pagination"
          align="center"
          size="sm"
        ></b-pagination>

        <h4 
          v-if="row.item.bug.length !== 0"
          class="py-3"
        >Bug详情</h4>
        <b-table
          v-if="row.item.bug.length !== 0"
          :items="row.item.bug"
          :fields="[
            { key: 'bugName', label: '名称' },
            { key: 'bugRisklevel', label: '风险等级' },
            { key: 'bugScore', label: '评分' },
          ]"
          id="graph-bug-detail"
          class="detail-list"
          :per-page="perPage"
          :current-page="row.item.bugCurrentPage"
          small
        >
          <template 
            slot="bugName"
            slot-scope="data"
          >{{ data.item.label }}</template>
          
          <template 
            slot="bugRisklevel"
            slot-scope="data"
          >{{ risklevel[data.item.properties.risklevel] }}</template>

          <template 
            slot="bugScore"
            slot-scope="data"
          >{{ data.item.properties.score }}</template>
        </b-table>
        
        <b-pagination
          v-if="row.item.bug.length !== 0"
          v-model="row.item.bugCurrentPage"
          :total-rows="row.item.bug.length"
          :per-page="perPage"
          aria-controls="graph-bug-detail"
          class="my-pagination"
          align="center"
          size="sm"
        ></b-pagination>

        <b-button 
          size="sm" 
          @click="row.toggleDetails"
          block
        >隐藏详情</b-button>
      </template>
    </b-table>

    <!-- <b-button @click="check">check</b-button> -->

  </b-container>
</template>

<script>
export default {
  data() {
    return {
      knowledgeGraph: {},
      graphData: [],

      projects: [],
      risklevel: {
        low: '低风险',
        medium: '中等风险',
        high: '高风险',
        critical: '超高风险',
      },
      perPage: 10
    }
  },
  computed: {
    orgId() {
      return this.$route.params.orgId;
    }
  },
  mounted() {
    this.getKnowledgeGraph();
  },
  methods: {
    async getKnowledgeGraph() {
      this.$backend.orgs.knowledgeGraph.getList(this.orgId).then(res => {
        // console.log(res);
        this.graphData = res;

        res.nodes.forEach(ele => {
          if (ele.properties.type === 'project') {
            this.projects.push({
              id: ele.id,
              project: ele.label,
              cve: [],
              bug: [],
              cveCurrentPage: 1,
              bugCurrentPage: 1,
            })
          }
        });

        res.edges.forEach(edge => {
           this.projects.forEach(project => {
             if (edge.source === project.id) {
               res.nodes.forEach(node => {
                 if (node.id === edge.target) {
                   switch (node.properties.type) {
                     case 'cve':
                       project['cve'].push(node);
                       break;

                     case 'securitybug':
                       project['bug'].push(node);
                       break;
                   
                     default:
                       break;
                   }
                 }
               })
             }
           })
        });

        // console.log(this.projects);   
      });
    },
    // check() {
    //   const common = this.projects[0].cve.filter(cve0 => {
    //     this.projects[1].cve.forEach(cve1 => {
    //       if (cve0.id === cve1.id) {
    //         return true;
    //       }
    //     });

    //     return false;
    //   });

    //   console.log(common);
    // }
  }
}
</script>

<style lang="less">
.relational-tables {
  td {
    width: 25%;
  }

  .detail-list {
    td {
      width: 33.33%;
    }
  }
}
</style>
