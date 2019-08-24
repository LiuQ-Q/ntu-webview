<template>
	<b-container>
		<div class="mb-5">
			<h1>项目</h1>
		</div>

		<b-table
			:fields="[
				{ key: 'libraries', label: '概览' },
				{ key: 'vulnerabilities', label: '漏洞' },
			]" 
			:items="[{}]"
			class="projects-overview"
		>
			<template slot="libraries">
				<p>项目总数:&nbsp;{{ projectList.count }}</p>
				<p>已更新:&nbsp;{{ projectsOverview['up-to-date'] }}</p>
				<p>未更新:&nbsp;{{ projectsOverview['outdated'] }}</p>
				<p>未扫描:&nbsp;{{ projectsOverview['never-scanned'] }}</p>
				<p>已使用二进制流量:&nbsp;{{ binaryUsage !== undefined ? Math.round(binaryUsage['block_size_scanned'] * 100) / 100 : 0 }}MB&nbsp;/&nbsp;{{ binaryUsage !== undefined ? Math.round((binaryUsage['block_size_limit'] / 1024) * 100) / 100 : 0 }}GB</p>
			</template>

			<template slot="vulnerabilities">
				<highcharts :options="{
					credits: { enabled: false },
					chart: {
						type: 'pie'
					},
					title: {
						text: null
					},
					plotOptions: {
						pie: {
							showInLegend: true
						}
					},
					series: [{
						data: [
							['未扫描', projectsOverview['never-scanned']],
							['未更新', projectsOverview['outdated']],
							['已更新', projectsOverview['up-to-date']]
						]
					}],
					pie: {
						showInLegend: true
					}
				}"></highcharts>
			</template>
		</b-table>

		<b-progress
			v-if="scanStatus"
			animated
			:value="scanPercentage"
			:max="scanTotal"
			class="mt-3"></b-progress>
		<b-table 
			:fields="[
				{key: 'name', label: '名称'},
				{key: 'last_update', label: '最后更新'},
				{key: 'status', label: '扫描状态'},
				{key: 'libraries', label: '组件'},
				{key: 'vulnerabilities', label: '漏洞'},
				{key: 'licenses', label: '许可证'},
				{key: 'manage', label: '操作'},
			]" 
			:items="projectList"
			:busy="isBusy"
			class="text-center"
		>
			<template slot="thead-top">
				<tr>
					<th>
						<h4>项目列表</h4>
					</th>
					<th>
						<b-button
							size="sm"
							to="manage"
						>添加项目</b-button>
					</th>
					<th colspan="5">&nbsp;</th>
				</tr>
			</template>

			<template slot="table-busy" class="text-center text-danger my-2">
				<b-spinner class="align-middle"></b-spinner>
				<strong>Loading...</strong>
			</template>

			<template 
				slot="name" 
				slot-scope="data"
			>
				<b-link :to="`projects/${data.item.id}`">{{ data.item.name }}</b-link>
			</template>

			<template 
				slot="last_update"
				slot-scope="data"
			>{{ ago(Date.parse(data.item['modified'])) }}</template>

			<template 
				slot="status"
				slot-scope="data"
			>{{ projectStatus[data.item.status] }}</template>

			<template 
				slot="libraries"
				slot-scope="data"
			>
				<b-link 
					:to="`projects/${data.item.id}/libraries/${data.item.lastScan ? data.item.lastScan.id : ''}`"
				>{{ data.item.lastScan ? (data.item.lastScan.status === 'finished' ? '查看' : '') : '' }}</b-link>
			</template>

			<template slot="vulnerabilities" slot-scope="data">
				<b-link 
					v-if="(data.item.lastScan ? (data.item.lastScan.status === 'finished') : false)"
					:to="`projects/${data.item.id}/vulnerabilities/${data.item.lastScan.id}`"
				>{{ data.item.lastScan ? (data.item.lastScan.status === 'finished' ? '查看' : 'b') : 'a' }}</b-link>

				<span v-if="(data.item.lastScan ? (!(data.item.lastScan.status === 'finished')) : true)">
					{{ data.item.lastScan ? (data.item.lastScan.status === 'failed' ? '失败' : (data.item.lastScan.status === 'queued' ? '排队中' : '进行中')) : '未扫描' }}
				</span>
			</template>

			<template slot="licenses" slot-scope="data">
				<b-link 
					:to="`projects/${data.item.id}/licenses/${data.item.lastScan ? data.item.lastScan.id : ''}`"
				>{{ data.item.lastScan ? (data.item.lastScan.status === 'finished' ? '查看' : '') : '' }}</b-link>
			</template>

			<template 
				slot="manage" 
				slot-scope="data"
				v-if="data.item !== undefined"
			>
				<b-button 
					size="sm"
					:disabled="data.item.lastScan ? (data.item.lastScan.status === 'queued' || data.item.lastScan.status === 'running') : false"
					@click="$bvModal.show(`modalaa-scan-${data.item.name}`)"
				>开始扫描</b-button>

				<b-modal 
					:id="`modalaa-scan-${data.item.name}`"
					hide-footer
				>
					<template slot="modal-title">扫描设置</template>

					<p>项目名:&nbsp;{{ data.item.name }}</p>

					<b-form-select
						v-model="scanSetting"
						size='sm'
						class="mb-2"
					>
						<option value="source_code">源代码</option>
						<option value="binary">二进制</option>
					</b-form-select>

					<b-button
						size="sm"
						class="mt-3" 
						block
						@click="beginScan(data.item.id, data.item.name)"
					>开始扫描</b-button>
				</b-modal>
			</template>
		</b-table>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			orgId: this.$route.params.orgId,
			projectStatus: {
				'never-scanned': '未扫描',
				'outdated': '未更新',
				'up-to-date': '已更新',
			},
			scanSetting: 'binary',
			projectsOverview: {},
			projectList: [],
			binaryUsage: {},
			sourcecodeUsage: {},
			scanStatus: false,
			scanPercentage: '',
			scanTotal: 100,
			isBusy: false
		};
	},
	mounted() {
		this.getProjectsOverview();
		this.getProjectList();
		this.getBinaryUsage();
		this.getSourcecodeUsage();
	},
	methods: {
		async getProjectsOverview() {
			this.projectsOverview = await this.$backend.orgs.projects.getListMode(this.orgId, 'overview');
		},
		getProjectList() {
			this.isBusy = true;

			this.$backend.orgs.projects.getList(this.orgId).then(res => {
				this.isBusy = false;
				this.projectList = res.results.filter(project => {
					return project['can_scan'];
				});

				const scanningProject = this.projectList.filter(project => {
					if (project.lastScan !== null) {
						return project.lastScan.status === 'running';
					}
				});

				if (scanningProject.length !== 0) {
					this.inspectScanningProject();
				}
			});
		},
		async getBinaryUsage() {
			this.binaryUsage = (await this.$backend.orgs.binaryUsage.getList(this.orgId)).results[0];
			// console.log(this.binaryUsage);
			
		},
		async getSourcecodeUsage() {
			this.sourcecodeUsage = await this.$backend.orgs.sourcecodeUsage.getList(this.orgId);
		},
		beginScan(projectId, projectName) {
			this.$backend.projects.scans.create(projectId, this.scanSetting).then(res => {
				this.$root.$emit('bv::hide::modal', `modalaa-scan-${projectName}`);

				this.isBusy = true;
				window.setTimeout(() => {
					this.isBusy = false;
					this.getProjectList();
				}, 4000);
			});
		},
		inspectScanningProject() {
			this.$backend.orgs.projects.getList(this.orgId).then(res => {
				const projectList = res.results.filter(project => {
					return project['can_scan'];
				});
				
				// console.log(projectList);
				const scanningProject = projectList.filter(project => {
					if (project.lastScan !== null) {
						return project.lastScan.status === 'running';
					}
				});

				if (scanningProject.length !== 0) {
					this.scanPercentage = scanningProject[scanningProject.length - 1].lastScan['scan_percentage'];
					this.scanStatus = true;
					window.setTimeout(() =>{
						this.inspectScanningProject();
					}, 2000);
				} else {
					this.scanPercentage = 100;
					window.setTimeout(() => {
						this.$bvToast.toast('扫描完成', {
							title: null,
							variant: 'primary',
							toaster: 'b-toaster-top-center',
							autoHideDelay: 2000,
							noCloseButton: true,
							solid: true
						});
						
						this.scanStatus = false;
						this.getProjectList();
					}, 800);
				}
			});
		}
	}
};
</script>

<style lang='less'>
.projects-overview {
	td {
		width: 50%;
	}
}
</style>
