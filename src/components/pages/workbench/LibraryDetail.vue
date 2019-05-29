<template>
  <b-container>
    <div class="mb-5">
      <h1>组件详情</h1>
    </div>

    <b-table
      :fields="[
        { key: 'vulnerabilitiesStatus', label: '漏洞状态' },
        { key: 'vulnerabilities', label: '漏洞' },
        { key: 'version', label: '版本' },
        { key: 'licensesStatus', label: '许可证状态' },
        { key: 'licenses', label: '许可证' },
      ]" 
      :items='items'
      class="library-detail-overview"
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h5>aaa-1.elf</h5>
          </th>
          <th colspan="4"></th>
        </tr>  
      </template>
    </b-table>

    <b-table 
      :fields="[
        {key: 'id', label: '标识'},
        {key: 'style', label: '类型'},
        {key: 'severity', label: '严重性'},
        {key: 'score', label: '打分'},
        {key: 'detail', label: '详情'},
      ]" 
      :items='librariesDetailItems'
      class="libraries-detail-table mt-5"
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h5>漏洞详情</h5>
          </th>
          <th colspan="5"></th>
        </tr>
      </template>

      <template 
        slot="id" 
        slot-scope="data"
      >
        <b-link>{{ data.item.id }}</b-link>
      </template>

      <template slot="detail" slot-scope="data">
        <b-link @click="$bvModal.show(`modal-detail-${data.item.id}`)">查看</b-link>

        <b-modal 
          :id="`modal-detail-${data.item.id}`"
          hide-footer
        >
          <template slot="modal-title">详情</template>
          <p>{{ data.item.detail }}</p>
          <p>攻击变量: Network</p>
          <p>攻击复杂度: Low</p>
          <p>需要特殊权限: None</p>
          <p>用户交互: Required</p>
        </b-modal>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          vulnerabilitiesStatus: '超高风险',
          vulnerabilities: '10',
          version: '1.1.1',
          licensesStatus: '',
          licenses: 'GNU Lesser General Public - License v2.1 or later'
        }
      ],
      librariesDetailItems: [
        {
          id: 'CVE-2018-11111',
          style: 'CVE',
          severity: '高风险',
          score: '8',
          detail: 'libavformat/movenc.c in FFmpeg before 4.0.2 allows attackers to cause a denial of service (application crash caused by a divide-by-zero error) with a user crafted Waveform audio file.'
        },
        {
          id: 'CVE-2018-22222',
          style: 'CVE',
          severity: '高风险',
          score: '9',
          detail: 'libavformat/movenc.c in FFmpeg before 4.0.2 allows attackers to cause a denial of service (application crash caused by a divide-by-zero error) with a user crafted Waveform audio file.'
        },
        {
          id: 'CVE-2018-33333',
          style: 'CVE',
          severity: '低风险',
          score: '3',
          detail: 'libavformat/movenc.c in FFmpeg before 4.0.2 allows attackers to cause a denial of service (application crash caused by a divide-by-zero error) with a user crafted Waveform audio file.'
        },
      ]
    }
  }
}
</script>

<style lang="less">
.libraries-detail-table {
  td {
    width: 22%;
  }
}
</style>
