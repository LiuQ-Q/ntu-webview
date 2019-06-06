<template>
  <div class="relation-graph"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: ['options'],
  data() {
    return {
      data: [12, 5, 84, 45]
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // const svg = d3.select(this.$el)
      //   .append('svg')
      //   .attr('width', 500)
      //   .attr('height', 500)

      // const force = d3.layout.force()
      //   .nodes(this.options.nodes)
      //   .links(this.options.edges)
      //   .size([500, 500])
      //   .linkDistance(50)
      //   .charge([-200])
      //   .start();

      // console.log(this.options.nodes);
      
    }
  }
}
</script>

<style lang="less">
// .relation-graph {
//   svg {
//     margin: 20px;
//     path {
//       fill: none;
//       stroke: red;
//       stroke-width: 3px; 
//     }
//   }
// }
</style>
