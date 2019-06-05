<template>
  <b-container>
    <div class="mb-5">
      <h1>关系图</h1>
    </div>

    <networkgraph :options="{
      chart: {
        type: 'networkgraph',
        height: '50%'
      },
      title: {
        text: null
      },
      subtitle: {
        text: null
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: true
          }
        }
      },
      series: [{
        dataLabels: {
          enabled: true
        },
        data: graphData
      }]
    }"></networkgraph>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      knowledgeGraph: {},
      graphData: []
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

        const data = res.nodes.filter(node => {
          return node.properties.type !== 'project';
        })

        
        data.forEach((ele, index) => {
          if (index > 41 && index < 56) {
            this.graphData.push([
              res.nodes[1].label,
              ele.label
            ])
          } else {
            this.graphData.push([
              res.nodes[0].label,
              ele.label
            ])
          }
        });
        console.log(this.graphData);
      });

    }
  }
}
</script>

<style>

</style>
