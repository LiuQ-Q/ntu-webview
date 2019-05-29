<template>
  <b-container>
    <div class="mb-5">
      <h1>项目详情</h1>
    </div>

    <b-table
      :items="items"
      :fields="[
        { key: 'message', label: '信息' },
        { key: 'scan', label: '扫描设置' },
        { key: 'license', label: '许可证政策' },
        { key: 'upload', label: '文件上传' },
      ]"
      class="project-detail-message"
    >
      <template slot="message" slot-scope="data">
        <p>
          <small>项目名称:&nbsp;{{ data.item.name }}</small>
          <!-- <b-link class="ml-5">隐藏项目</b-link> -->
        </p>
        <p><small>拥有者:&nbsp;{{ data.item.owner }}</small></p>
        <p><small>供应商:&nbsp;{{ data.item.supplier }}</small></p>
        <p><small>创建时间:&nbsp;{{ data.item.createTime }}</small></p>
      </template>

      <template slot="scan">
        <b-form-checkbox
          v-model="regularScan"
          switch
        >定期扫描</b-form-checkbox>

        <b-form-select
          v-model="regularScanStyle"
          size='sm'
          class="my-2"
          :disabled="!regularScan"
        >
          <option value="source">源代码</option>
          <option value="binary">二进制</option>
        </b-form-select>

        <b-form-checkbox
          switch
          disabled
        >事件驱动扫描</b-form-checkbox>

        <b-form-select
          v-model="driveScanStyle"
          size='sm'
          class="my-2"
          disabled
        >
          <option value="pull">拉取操作</option>
        </b-form-select>
      </template>

      <template slot="license">
        <p class="mb-2">当前政策</p>

        <b-form-select
          v-model="licensePolicy"
          size='sm'
          class="mb-2"
        >
          <option value="default">默认</option>
          <option value="a">AAAAA AAA AAAA</option>
          <option value="b">BBBBB BBB BBBB</option>
          <option value="c">CCCCC CCC CCCC</option>
        </b-form-select>

        <b-link @click="$bvModal.show('modal-policy')">添加新政策</b-link>

        <b-modal 
          id="modal-policy"
          hide-footer
        >
          <template slot="modal-title">添加新政策</template>

          <b-form class="signin-form">
            <b-form-group label="名称:">
              <b-form-input></b-form-input>
            </b-form-group>

            <b-form-group label="简介:">
              <b-form-textarea
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </b-form>

          <b-button class="mt-3" block>添加</b-button>
        </b-modal>
      </template>

      <template slot="upload">
        <b-form-file
          v-model="file"
          class="mb-3"
          plain
        ></b-form-file>
        <p>已上传文件:&nbsp;{{ file ? file.name : '' }}</p>
        <p>文件大小:&nbsp;{{ file ? Math.round(file.size/1024) + 'KB' : '' }}</p>
      </template>
    </b-table>

    <b-table
      :fields="[
        { key: 'id', label: '编号' },
        { key: 'source', label: '来源' },
        { key: 'branch', label: '分支' },
        { key: 'status', label: '状态' },
        { key: 'time', label: '时间' },
        { key: 'cost', label: '用时' },
        { key: 'library', label: '组件' },
        { key: 'vulnerability', label: '漏洞' },
        { key: 'license', label: '许可证' },
        { key: 'report', label: '报告' },
        { key: 'check', label: '选择' },
      ]"
      :items="scanHistory"
      class="text-center"
      small
    >
      <template slot="thead-top">
        <tr>
          <th>
            <h5>扫描历史</h5>
          </th>
          <th colspan="9">&nbsp;</th>
          <th>
            <b-button 
              to="/projects/1/compare"
            >比较</b-button>
          </th>
        </tr>  
      </template>
      <template 
        slot="status" 
        slot-scope="data"
      >
        <b-link @click="$bvModal.show(`modal-status-${data.item.id}`)">{{ data.item.status }}</b-link>

        <b-modal 
          :id="`modal-status-${data.item.id}`"
          hide-footer
        >
          <p>{{ data.item.log }}</p>
        </b-modal>
      </template>

      <template slot="library">
        <b-link to="/projects/1/libraries/1">查看</b-link>
      </template>

      <template slot="vulnerability">
        <b-link to="/projects/1/vulnerabilities/1">查看</b-link>
      </template>

      <template slot="license">
        <b-link to="/projects/1/licenses/1">查看</b-link>
      </template>

      <template slot="check" slot-scope="data">
        <b-check
          v-model="projectSelected"
          :value="data.item.id"
          :disabled="projectSelected.length > 4 ? true : false"
        ></b-check>
      </template>

      <template slot="report">
        <b-link>下载</b-link>
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
          name: 'binary_test',
          createTime: 'May 7th 2019, 7:37:49 pm',
          owner: 'test1',
          supplier: 'Upload'
        }
      ],
      scanHistory: [
        {
          id: '#11',
          source: 'Web',
          branch: 'aaa-aaaa.zip',
          status: '完成',
          time: '2天前',
          cost: '00:50',
          log: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        {
          id: '#12',
          source: 'Web',
          branch: 'aaa-aaaa.zip',
          status: '完成',
          time: '2天前',
          cost: '00:50',
          log: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
        },
        {
          id: '#13',
          source: 'Web',
          branch: 'aaa-aaaa.zip',
          status: '完成',
          time: '2天前',
          cost: '00:50',
          log: 'ccccccccccccccccccccccccccccccccccccccccccccccccc'
        },
        {
          id: '#14',
          source: 'Web',
          branch: 'aaa-aaaa.zip',
          status: '完成',
          time: '2天前',
          cost: '00:50',
          log: 'ccccccccccccccccccccccccccccccccccccccccccccccccc'
        },
        {
          id: '#15',
          source: 'Web',
          branch: 'aaa-aaaa.zip',
          status: '完成',
          time: '2天前',
          cost: '00:50',
          log: 'ccccccccccccccccccccccccccccccccccccccccccccccccc'
        },
        {
          id: '#16',
          source: 'Web',
          branch: 'aaa-aaaa.zip',
          status: '完成',
          time: '2天前',
          cost: '00:50',
          log: 'ccccccccccccccccccccccccccccccccccccccccccccccccc'
        },
      ],
      file: null,
      regularScan: false,
      regularScanStyle: 'source',
      driveScanStyle: 'pull',
      licensePolicy: 'default',
      projectSelected: []
    }
  }
}
</script>

<style lang="less">
.project-detail-message {
  td {
    width: 24%;
  }

  td:nth-child(1) {
    width: 28%;
  }
}
</style>
