<template>
  <b-container>
    <div class="mb-5">
      <h1>用户设置</h1>
    </div>

    <b-table
      :fields="[
        { key: 'setting', label: '个人设定' }
      ]"
      :items="[{}]"
    >
      <template slot="setting">
        <div style="margin-left:5%;">
          <p>用户名:&nbsp;{{ username }}</p>
          <p>邮箱:&nbsp;{{ email }}</p>

          <b-form-checkbox
            v-model="scanStatus"
            switch
          >邮件通知扫描状态</b-form-checkbox>

          <b-form-checkbox
            v-model="newVulnerability"
            switch
            class="mb-3 mt-2"
          >邮件通知最新漏洞</b-form-checkbox>

          <b-link @click="$bvModal.show('change-password')">修改密码</b-link>

          <b-modal 
            id="change-password"
            hide-footer
          >
            <template slot="modal-title">修改密码</template>

            <b-form class="signin-form">
              <b-form-group label="旧密码:">
                <b-form-input></b-form-input>
              </b-form-group>

              <b-form-group label="新密码:">
                <b-form-input></b-form-input>
              </b-form-group>

              <b-form-group label="确认新密码:">
                <b-form-input></b-form-input>
              </b-form-group>
            </b-form>

            <b-button class="mt-3" block>确认修改</b-button>
          </b-modal>
        </div>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      username: 'test111',
      email: '123123@aaa.com',
      scanStatus: true,
      newVulnerability: true
    }
  }
}
</script>

<style>

</style>
