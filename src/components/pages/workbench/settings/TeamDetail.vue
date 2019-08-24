<template>
	<div class="team-detail">
		<div class="pl-3">
			<h4>小组名: {{ orgsTeamsNow.name }}</h4>
			<h4>小组描述: {{ orgsTeamsNow.description }}</h4>
			
			<b-form class="signin-form mt-5">
				<b-form-group label="添加组员">
					<b-form-input 
						placeholder="用户名" 
						style="width:50%;"
						v-model="memberName"
					></b-form-input>
				</b-form-group>
				<b-button
					size="sm"
					@click="addMember"
					:disabled="memberName.length < 1"
				>添加</b-button>
			</b-form>
		</div>

		<b-table 
			:fields="[
				{key: 'name', label: '名称'},
				{key: 'role', label: '权限'},
				{key: 'status', label: '状态'},
				{key: 'action', label: '操作'},
			]" 
			:items="teamsMembers"
			class="team-member text-center mt-5"
		>
			<template slot="thead-top">
				<h4>组员列表</h4>
			</template>
			<template slot="name" slot-scope="data">{{ data.item['org_member'].user.username }}</template>
			<template slot="role" slot-scope="data">{{ roleMapping[data.item.role] }}</template>
		</b-table>

		<b-table 
			:fields="[
				{key: 'name', label: '名称'},
				{key: 'language', label: '最后更新'},
				{key: 'provider', label: '供应商'},
				{key: 'action', label: '操作'},
			]" 
			:items="teamsProjects"
			class="team-project text-center"
		>
			<template slot="thead-top">
				<h4>项目列表</h4>
			</template>
			<template slot="name" slot-scope="data">
				<b-link :to="`/workbench/${orgId}/projects/${data.item.id}`">{{ data.item.name }}</b-link>
			</template>
		</b-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			teamsProjects: [],
			teamsMembers: [],
			orgsTeamsNow: {},
			orgsMembers: [],
			memberName: '',
			roleMapping: {
				'default': '拥有者'
			}
		};
	},
	computed: {
		orgId() {
			return this.$route.params.orgId;
		},
		teamId() {
			return this.$route.params.teamId;
		},
	},
	mounted() {
		this.getOrgsTeamsById();
		this.getOrgsTeams();
		this.getOrgsMembers();
		this.getTeamsMembers();
		this.getTeamsProjects();
	},
	methods: {
		getOrgsTeamsById() {
			this.$backend.orgs.teams.getById(this.orgId, this.teamId).then(res => {
				this.orgsTeamsNow = res;
			});
		},
		getOrgsTeams() {
			this.$backend.orgs.teams.getList(this.orgId).then(res => {
				// console.log(res);
				
			});
		},
		getOrgsMembers() {
			this.$backend.orgs.members.getList(this.orgId).then(res => {
				this.orgsMembers = res.results;
				// console.log(res);
			});
		},
		getTeamsMembers() {
			this.$backend.teams.members.getList(this.teamId).then(res => {
				this.teamsMembers = res.results;
				// console.log(this.teamsMembers);
			});
		},
		getTeamsProjects() {
			this.$backend.teams.projects.getList(this.teamId).then(res => {
				this.teamsProjects =  res.results;
			});
		},
		addMember() {
			const userInOrg = this.orgsMembers.find(member => {
				return member.user.username === this.memberName;
			});

			const userInTeam = this.teamsMembers.find(member => {
				return member['org_member'].user.username === this.memberName;
			});

			if (!userInOrg) {
				this.$bvToast.toast('用户名不存在', {
					title: null,
					variant: 'danger',
					toaster: 'b-toaster-top-center',
					autoHideDelay: 2000,
					noCloseButton: true,
					solid: true
				});
			} else if (userInTeam !== undefined) {
				this.$bvToast.toast('用户已在小组内', {
					title: null,
					variant: 'danger',
					toaster: 'b-toaster-top-center',
					autoHideDelay: 2000,
					noCloseButton: true,
					solid: true
				});
			} else {
				this.$backend.teams.members.create(this.teamId, ).then(res => {
					this.$bvToast.toast('添加成功', {
						title: null,
						variant: 'success',
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

<style lang="less">
.team-detail {
	.team-member {
		td {
			width: 25%;
		}
	}

	.team-project {
		td {
			width: 25%;
		}
	}
}
</style>
