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
					<p>用户名:&nbsp;{{ userData.username }}</p>
					<p>邮箱:&nbsp;{{ userData.email }}</p>

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
						ref="change-password"
						@show="resetModal"
						@hidden="resetModal"
						hide-footer
					>
						<template slot="modal-title">修改密码</template>

						<b-form class="signin-form">
							<b-form-group label="旧密码:">
								<b-form-input 
									v-model="oldPassword"
									type="password"
									:state="oldPasswordState"
									aria-describedby="old-password-feedback"
								></b-form-input>
								<b-form-invalid-feedback id="old-password-feedback">
									请输入至少8位的旧密码
								</b-form-invalid-feedback>
							</b-form-group>

							<b-form-group label="新密码:">
								<b-form-input 
									v-model="newPassword1"
									:state="newPasswordState1"
									type="password"
								></b-form-input>
								<b-form-invalid-feedback id="old-password-feedback">
									请输入至少8位的新密码
								</b-form-invalid-feedback>
							</b-form-group>

							<b-form-group label="确认新密码:">
								<b-form-input 
									v-model="newPassword2"
									:state="newPasswordState2"
									type="password"
								></b-form-input>
								<b-form-invalid-feedback id="old-password-feedback">
									请输入至少8位的新密码
								</b-form-invalid-feedback>
							</b-form-group>
						</b-form>

						<b-button 
							class="mt-3" 
							block
							@click="changePassword"
						>确认修改</b-button>
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
			userData: {},
			userConfig: [],
			scanStatus: true,
			newVulnerability: true,
			oldPassword: '',
			newPassword1: '',
			newPassword2: ''
		};
	},
	computed: {
		oldPasswordState() {
			return this.oldPassword.length > 7 ? true : false;
		},
		newPasswordState1() {
			return this.newPassword1.length > 7 ? true : false;
		},
		newPasswordState2() {
			return this.newPassword2.length > 7 ? true : false;
		},
	},
	watch: {
		scanStatus() {
			this.updateConfig(1, this.scanStatus);
		},
		newVulnerability() {
			this.updateConfig(2, this.newVulnerability);
		}
	},
	mounted() {
		this.getUserData();
		this.getUserConfig();
	},
	methods: {
		async getUserData() {
			this.userData = await this.$backend.user.getList();
		},
		async getUserConfig() {
			this.userConfig = (await this.$backend.user.getConfig()).results;
			
			this.userConfig.forEach((ele) => {
				switch (ele['notification_type']) {
				case 'scan_status':
					this.scanStatus = ele.enabled;
					break;
			
				case 'data_patch':
					this.newVulnerability = ele.enabled;
					break;
			
				default:
					break;
				}
			});
		},
		async updateConfig(id, status) {
			this.$backend.user.updateConfigById(id, status);
		},
		resetModal() {
			this.oldPassword = '',
			this.newPassword1 = '',
			this.newPassword2 = '';
		},
		changePassword() {
			if (this.newPassword1 !== this.newPassword2) {
				this.$bvToast.toast('请输入相同的新密码!', {
					title: null,
					variant: 'danger',
					toaster: 'b-toaster-top-center',
					autoHideDelay: 2000,
					noCloseButton: true,
					solid: true
				});
			} else if (this.oldPassword === this.newPassword1) {
				this.$bvToast.toast('新密码不能与旧密码相同!', {
					title: null,
					variant: 'danger',
					toaster: 'b-toaster-top-center',
					autoHideDelay: 2000,
					noCloseButton: true,
					solid: true
				});
			} else {
				this.$backend.restAuth.password.change(this.oldPassword, this.newPassword1, this.newPassword2).then(res => {
					this.$bvToast.toast('修改成功', {
						title: null,
						variant: 'primary',
						toaster: 'b-toaster-top-center',
						autoHideDelay: 2000,
						noCloseButton: true,
						solid: true
					});
	
					this.$refs['change-password'].hide();
				}, error => {
					console.log(error);
					this.$bvToast.toast('密码错误', {
						title: null,
						variant: 'danger',
						toaster: 'b-toaster-top-center',
						autoHideDelay: 2000,
						noCloseButton: true,
						solid: true
					});
				});
			}
		}
	}
};
</script>

<style>

</style>
