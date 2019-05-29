<template>
  <b-container>
    <div class="mb-5">
      <h1>许可证</h1>
    </div>

    <b-table 
      :fields="[
        { key: 'project', label: '项目' },
        { key: 'policy', label: '政策' },
        { key: 'allow', label: '被允许的' },
        { key: 'mark', label: '被标记的' },
        { key: 'limit', label: '受限的' },
        { key: 'last', label: '最后扫描' },
        { key: 'scan', label: '详情' },
      ]"
      :items="projectItems"
      class="licenses-by-project"
    >
      <template slot="thead-top">
        <h4>按项目分类</h4>
      </template>
      <template slot="project" slot-scope="data">
        <b-link to="/projects/1">{{ data.item.project }}</b-link>
      </template>
      <template slot="scan">
        <b-link to="/projects/1/licenses/1">查看</b-link>
      </template>
    </b-table>

    <b-table 
      :fields="[
        { key: 'num', label: '许可证' },
        { key: 'style', label: '类别' },
        { key: 'score', label: '综合打分' },
        { key: 'affect', label: '受影响项目' }
      ]"
      :items='libraryItems'
      class="licenses-by-library"
    >
      <template slot="thead-top">
        <h4>按许可证分类</h4>
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
      projectItems: [
        { project: 'binary_test', policy: 'Default', allow: 20, mark: 0, limit: 2, last: '2天前' },
        { project: 'binary_test', policy: 'Default', allow: 20, mark: 0, limit: 2, last: '2天前' },
      ],
      libraryItems: [
        { num: 'Apache-2.0', style: '获准的', score: 5, affect: 1 },
      ],
      options: {
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
            ['未扫描', 2],
            ['未更新', 0],
            ['已更新', 3]
          ]
        }],
        pie: {
          showInLegend: true
        }
      },
      style: {
        height: 300,
        width: 300,
      }
    }
  }
}
</script>

<style lang='less'>
.licenses-by-project {
  td {
    width: 14.3%;
  } 
}
.licenses-by-library {
  td {
    width: 25%;
  }
}
</style>
