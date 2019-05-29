<template>
  <b-container>
    <div class="mb-5">
      <h1>许可证问题详情</h1>
    </div>

    <b-table
      :fields="[
        { key: 'problem', label: '问题' },
        { key: 'deal', label: '对此问题的处理' },
      ]" 
      :items='licenseDetailOverview'
      class="license-detail-overview"
    >
      <template slot="problem">
        <p>许可证:&nbsp;GNU Lesser General Public License v2.1 or later</p>
        <p>类型:&nbsp;</p>
        <p>许可证政策:&nbsp;</p>
        <p>受影响的组件:&nbsp;</p>
        <p>政策合规性:&nbsp;</p>
        <p>综合打分:&nbsp;</p>
      </template>

      <template slot="deal">
        <p class="mb-2">状态:</p>
        <b-form-select
          v-model="problemStatus"
          size='sm'
          class="mb-2"
          style="width:50%;"
        >
          <option value="default">未设置</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </b-form-select>

        <p class="mb-2">优先级:</p>
        <b-form-select
          v-model="problemPriority"
          size='sm'
          class="mb-2"
          style="width:50%;"
        >
          <option value="default">未设置</option>
          <option value="ignore">忽略</option>
          <option value="wait">待修复</option>
          <option value="already">已修复</option>
        </b-form-select>

        <p class="mb-2">负责人:</p>
        <b-form-select
          v-model="problemPrincipal"
          size='sm'
          class="mb-2"
          style="width:50%;"
        >
          <option value="default">未设置</option>
          <option value="test1">test1</option>
        </b-form-select>

        <p>评价:</p>
        <b-form-textarea
          v-model="problemComment"
          placeholder="请添加评价..."
          rows="3"
          max-rows="6"
          class="mb-3"
        ></b-form-textarea>

        <b-button style="float:left;">提交</b-button>

        <b-dropdown text="操作" style="float:left;" class="ml-3">
          
        </b-dropdown>
      </template>
    </b-table>

    <b-table 
      :fields="[
        {key: 'allowed', label: '被允许的许可证属性'},
        {key: 'require', label: '要求的许可证属性'},
        {key: 'limit', label: '受限的许可证属性'},
      ]"
      :items='licenseAttributes'
      class="license-detail-attributes"
    >
      <template slot="allowed" slot-scope="data">
        <p
          v-for="(allowedLicense, index) in data.item.allowedLicenses"
          :key="index"
        >{{ allowedLicense }}</p>
      </template>

      <template slot="require" slot-scope="data">
        <p
          v-for="(requireLicense, index) in data.item.requireLicenses"
          :key="index"
        >{{ requireLicense }}</p>
      </template>

      <template slot="limit" slot-scope="data">
        <p
          v-for="(limitLicense, index) in data.item.limitLicenses"
          :key="index"
        >{{ limitLicense }}</p>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      licenseDetailOverview: [{}],
      problemStatus: 'default',
      problemPriority: 'default',
      problemPrincipal: 'default',
      problemComment: '',
      licenseAttributes: [
        {
          allowedLicenses: ['Commercial Use', 'Modify', 'Use Patent Claims'],
          requireLicenses: ['Include Copyright', 'Include License', 'State Changes', 'Include Install Instructions'],
          limitLicenses: ['Sublicense', 'Hold Liable']
        }
      ]
    }
  }
}
</script>

<style lang="less">
.license-detail-overview {
  td {
    width: 50%;
  }
}
.license-detail-attributes {
  td {
    width: 33.33%;
  }
}
</style>
