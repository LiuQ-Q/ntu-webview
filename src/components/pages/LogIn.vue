<template>
	<b-card class="login">
		<b-form @submit.prevent="login" class="login-form">
			<b-form-group id="input-group-1" label="邮箱:" label-for="input-2">
				<b-form-input id="input-1" v-model="username" placeholder="Enter name"></b-form-input>
			</b-form-group>

			<b-form-group id="input-group-2" label="密码:" label-for="input-2">
				<b-form-input id="input-2" v-model="password" type="password" placeholder="password"></b-form-input>
			</b-form-group>

			<b-button 
				type="submit" 
				variant="primary"
			>登录</b-button>
			<b-button 
				variant="success" 
				@click="$bvModal.show('new-user')"
			>注册</b-button>
		</b-form>
		<b-modal
			id="new-user"
			ref="new-user"
			@show="resetModal"
			@hidden="resetModal"
			hide-footer
		>
			<template slot="modal-title">修改密码</template>

			<b-form class="signin-form">
				<b-form-group label="用户名:">
					<b-form-input 
						v-model="newUsername"
						:state="newUsernameState"
						aria-describedby="new-username-feedback"
					></b-form-input>
					<b-form-invalid-feedback id="new-username-feedback">
						请输入至少4位的用户名
					</b-form-invalid-feedback>
				</b-form-group>

				<b-form-group label="邮箱:">
					<b-form-input 
						v-model="newEmail"
						:state="newEmailState"
						aria-describedby="new-email-feedback"
					></b-form-input>
					<b-form-invalid-feedback id="new-email-feedback">
						请输入正确的邮箱
					</b-form-invalid-feedback>
				</b-form-group>

				<b-form-group label="密码:">
					<b-form-input 
						v-model="newPassword1"
						:state="newPasswordState1"
						type="password"
						aria-describedby="new-password1-feedback"
					></b-form-input>
					<b-form-invalid-feedback id="new-password1-feedback">
						请输入至少8位的密码
					</b-form-invalid-feedback>
				</b-form-group>

				<b-form-group label="确认密码:">
					<b-form-input 
						v-model="newPassword2"
						:state="newPasswordState2"
						type="password"
						aria-describedby="new-password2-feedback"
					></b-form-input>
					<b-form-invalid-feedback id="new-password2-feedback">
						请输入至少8位的密码
					</b-form-invalid-feedback>
				</b-form-group>
			</b-form>

			<b-button 
				class="mt-3" 
				block
				variant="success"
				@click="logon"
			>注册</b-button>
		</b-modal>
	</b-card>
</template>

<script>
export default {
	data() {
		return {
			// username: 'test1@scantist.com',
			username: '',
			password: '',
			orgId: '',
			newUsername: '',
			newEmail: '',
			newPassword1: '',
			newPassword2: '',
		};
	},
	computed: {
		newUsernameState() {
			return this.newUsername.length > 3 ? true : false;
		},
		newEmailState() {
			// return this.oldPassword.length > 7 ? true : false;
			const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
			return re.test(this.newEmail);
		},
		newPasswordState1() {
			return this.newPassword1.length > 7 ? true : false;
		},
		newPasswordState2() {
			return this.newPassword2.length > 7 ? true : false;
		},
	},
	methods: {
		async login() {
			try {
				await this.$backend.logIn(this.username, this.password);

				this.orgId = (await this.$backend.orgs.getList()).results[0].id;
				
				this.$router.push(`/workbench/${this.orgId}/dashboard`);
			} catch (error) {
				console.log(error);
				this.$bvToast.toast('账号或密码错误!', {
					title: null,
					variant: 'danger',
					toaster: 'b-toaster-top-center',
					autoHideDelay: 2000,
					noCloseButton: true,
					solid: true
				});
			}
		},
		logon() {
			if (this.newPassword1 !== this.newPassword2) {
				this.$bvToast.toast('请输入相同的新密码!', {
					title: null,
					variant: 'danger',
					toaster: 'b-toaster-top-center',
					autoHideDelay: 2000,
					noCloseButton: true,
					solid: true
				}) ;
			} else {
				this.$backend.restAuth.registration.create(this.newUsername, this.newEmail, this.newPassword1, this.newPassword2).then(res => {
					this.$bvToast.toast('注册成功', {
						title: null,
						variant: 'primary',
						toaster: 'b-toaster-top-center',
						autoHideDelay: 2000,
						noCloseButton: true,
						solid: true
					});
	
					this.$refs['new-user'].hide();
				}, error => {
					this.$bvToast.toast('注册失败', {
						title: null,
						variant: 'danger',
						toaster: 'b-toaster-top-center',
						autoHideDelay: 2000,
						noCloseButton: true,
						solid: true
					});
					
					console.log(error);
				});
			}
		},
		resetModal() {
			this.newUsername = '',
			this.newEmail = '',
			this.newPassword1 = '',
			this.newPassword2 = '';
		},
	}
};
</script>

<style lang="less">
.login {
	width: 500px;
	margin: 200px auto;
}
</style>

