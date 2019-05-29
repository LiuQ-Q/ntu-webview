<template>
  <b-container>
    <div class="mb-5">
      <h1>项目比较</h1>
    </div>

    <b-table
      :fields="[
        { key: 'problems', label: '问题严重性' },
        { key: 'libraries', label: '已搜到组件' },
      ]"
      :items="[{}]"
      class="project-compare-column"
    >
      <template slot="problems">
        <highcharts :options="problemsOptions"></highcharts>
      </template>

      <template slot="libraries">
        <highcharts :options="librariesOptions"></highcharts>
      </template>
    </b-table>

    <b-table
      :fields="[
        { key: 'mark', label: '标识' },
        { key: 'style', label: '问题类型' },
        { key: 'abstract', label: '简介' },
        { key: 'score', label: '打分' },
        { key: '#11', label: '#11' },
        { key: '#12', label: '#12' },
        { key: '#13', label: '#13' },
        { key: '#14', label: '#14' },
        { key: '#15', label: '#15' },
      ]"
      :items="problemsList"
      class="project-compare-list"
    >
      <template slot="mark" slot-scope="data">
        <b-link>{{ data.item.mark }}</b-link>
      </template>
      <template slot="abstract" slot-scope="data">
        <p><small>{{ data.item.abstract }}</small></p>
      </template>

      <template slot="#11">
        有
      </template>
      <template slot="#12">
        有
      </template>
      <template slot="#13">
        有
      </template>
      <template slot="#14">
        有
      </template>
      <template slot="#15">
        有
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      problemsOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: null
        },
        xAxis: {
          categories: ['未知', '低风险', '中等风险', '高风险', '超高风险']
        },
        credits: {
            enabled: false
        },
        series: [
          {
            name: '#11',
            data: [1, 2, 3, 2, 1]
          },
          {
            name: '#12',
            data: [2, 3, 1, 2, 1]
          },
          {
            name: '#13',
            data: [1, 4, 3, 1, 1]
          },
          {
            name: '#14',
            data: [1, 1, 3, 3, 1]
          },
          {
            name: '#15',
            data: [1, 0, 2, 2, 2]
          }
        ]
      },
      librariesOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: null
        },
        xAxis: {
          categories: ['#11', '#12', '#13', '#14', '#15']
        },
        credits: {
            enabled: false
        },
        series: [
          {
            name: '组件数量',
            data: [1, 2, 3, 2, 1]
          },
        ]
      },
      problemsList: [
        {
          mark: 'CVE-2018-10000',
          style: 'CVE',
          abstract: 'The decode_init function in libavcodec/utvideodec.c in FFmpeg through 3.4.2 allows remote attackers to cause a denial of service (out of array read) via an AVI file.',
          score: 8
        },
        {
          mark: 'CVE-2018-10001',
          style: 'CVE',
          abstract: 'libavformat/movenc.c in FFmpeg before 4.0.2 allows attackers to cause a denial of service (application crash caused by a divide-by-zero error) with a user crafted Waveform audio file.',
          score: 7
        },
        {
          mark: 'CVE-2018-10002',
          style: 'CVE',
          abstract: 'FFmpeg before commit 9807d3976be0e92e4ece3b4b1701be894cd7c2e1 contains a CWE-835: Infinite loop vulnerability in pva format demuxer that can result in a Vulnerability that allows attackers to consume excessive amount of resources like CPU and RAM. This attack appear to be exploitable via specially crafted PVA file has to be provided as input. This vulnerability appears to have been fixed in 9807d3976be0e92e4ece3b4b1701be894cd7c2e1 and later.',
          score: 7.5
        },
        {
          mark: 'CVE-2018-10003',
          style: 'CVE',
          abstract: 'libavformat/movenc.c in FFmpeg before 4.0.2 allows attackers to cause a denial of service (application crash caused by a divide-by-zero error) with a user crafted audio file when converting to the MOV audio format.',
          score: 8.5
        },
        {
          mark: 'CVE-2018-10004',
          style: 'CVE',
          abstract: 'The decode_init function in libavcodec/utvideodec.c in FFmpeg through 3.4.2 allows remote attackers to cause a denial of service (out of array read) via an AVI file.',
          score: 6
        },
      ]
    }
  }
}
</script>

<style lang="less">
.project-compare-column {
  td:nth-child(1) {
    width: 70%;
  }
}
.project-compare-list {
  td:nth-child(3) {
    width: 40%;
  }
}
</style>
