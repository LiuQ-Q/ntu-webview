<template>
	<b-container>
		<div class="mb-5">
			<h1>组件扫描结果</h1>
		</div>

		<b-table
			:fields="[
				{ key: 'overview', label: '总览' },
				{ key: 'vulnerabilities', label: '漏洞' },
				{ key: 'licenses', label: '许可证' },
			]" 
			:items='items'
			class="library-result-overview"
		>
			<template slot="overview">
				<p>项目名称:&nbsp;{{ scansOverview['project_name'] }}</p>
				<p>组件数量:&nbsp;{{ scansOverview['library_count'] }}</p>
				<p>已发现组件漏洞:&nbsp;{{ scansOverview['vulnerable_libraries_count'] }}</p>
				<p>已发现许可证问题的组件:&nbsp;{{ scansOverview['library_with_lic_issue'] }}</p>
			</template>

			<template slot="vulnerabilities">
				<highcharts
					v-if="scansOverview['vulnerable_libraries_count'] !== 0 && scansOverview['scan_issues_overview'] !== undefined"
					:options="{
						credits: { enabled: false },
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
								['超高风险', scansOverview['scan_issues_overview']['critical_scan_issues']],
								['高风险', scansOverview['scan_issues_overview']['high_scan_issues']],
								['中等风险', scansOverview['scan_issues_overview']['medium_scan_issues']],
								['低风险', scansOverview['scan_issues_overview']['low_scan_issues']],
								['未知', scansOverview['scan_issues_overview']['none_scan_issues']],
							]
						}],
						pie: {
							showInLegend: true
						}
					}"
				></highcharts>
				<span v-if="scansOverview['vulnerable_libraries_count'] === 0">未发现问题</span>
			</template>

			<template slot="licenses">
				<highcharts
					v-if="scansOverview['library_with_lic_issue'] !== 0 && scansOverview['license_issues_overview'] !== undefined"
					:options="{
						credits: { enabled: false },
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
								['受限的', scansOverview['license_issues_overview']['deny']],
								['被标记的', scansOverview['license_issues_overview']['flag']],
								['被允许的', scansOverview['license_issues_overview']['approve']],
							]
						}],
						pie: {
							showInLegend: true
						}
					}"
				></highcharts>
				<span v-if="scansOverview['library_with_lic_issue'] === 0">未发现问题</span>
			</template>
		</b-table>

		<b-table 
			:fields="[
				{key: 'name', label: '名称'},
				{key: 'version', label: '版本'},
				{key: 'module', label: '模组'},
				{key: 'vulnerabilities', label: '漏洞'},
				{key: 'licenses', label: '许可证'},
				{key: 'detail', label: '详情'},
			]" 
			:items='scansLibrary'
			class="library-result-table"
			id="library-result-table"
			:per-page="libraryPerPage"
			:busy="libraryIsBusy"
		>
			<template slot="thead-top">
				<tr>
					<th>
						<h5>组件清单</h5>
					</th>
					<th colspan="2"></th>
					<th>
						<b-button
							size="sm"
							v-if="scansById['lib_report_status'] === 'Available'"
							@click="downloadRepo"
						>下载</b-button>
						<b-button
							size="sm"
							v-if="scansById['lib_report_status'] === 'N.A.'"
							@click="exportRepo"
						>导出</b-button>
						<b-button
							size="sm"
							v-if="scansById['lib_report_status'] === 'Generating'"
							disabled
						>导出中</b-button>
					</th>
					<th>
						<b-form-select 
							v-if="scansById['lib_report_status'] === 'Available'"
							v-model="reportFormat" 
							:options="[
								{ value: 'pdf', text: 'PDF' },
								{ value: 'csv', text: 'CSV' },
								{ value: 'json', text: 'JSON' },
							]" 
							size="sm" 
						></b-form-select>
					</th>
					<th>
						<b-form-select 
							v-if="scansById['lib_report_status'] === 'Available' && reportFormat === 'pdf'"
							v-model="reportLanguage" 
							:options="[
								{ value: 'chinese', text: '中文' },
								{ value: 'english', text: '英文' },
							]" 
							size="sm" 
						></b-form-select>
					</th>
				</tr>  
			</template>

			<template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>

			<template 
				slot="name"
				slot-scope="data"
			>{{ data.item['library_version'].library.name }}</template>
			<template 
				slot="version"
				slot-scope="data"
			>{{ data.item['library_version']['version_number'] }}</template>
			<template 
				slot="module"
				slot-scope="data"
			>{{ data.item['module_name'] }}</template>
			<template 
				slot="vulnerabilities"
				slot-scope="data"
			>{{ data.item['vul_total_count'] }}</template>
			<template 
				slot="licenses"
				slot-scope="data"
			>{{ data.item['library_version'].license !== null ? data.item['library_version'].license.identifier : '无' }}</template>

			<template 
				slot="detail"
				slot-scope="data"
			>
				<b-link :to="`${scanId}/issue/${data.item.id}`">查看</b-link>
			</template>
		</b-table>

		<b-pagination
			v-model="libraryCurrentPage"
			:total-rows="libraryRows"
			:per-page="libraryPerPage"
			aria-controls="library-result-table"
			align="center"
			size="sm"
		></b-pagination>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			items: [
				{}
			],
			librariesItems: [
				{
					name: 'aaaaa',
					version: '1.1.1',
					module: 'a.elf',
					vulnerabilities: '10',
					licenses: 'LGPL-2.1-or-later'
				},
				{
					name: 'bbbbb',
					version: '2.2.2',
					module: 'bbb',
					vulnerabilities: '15',
					licenses: 'LGPL-2.1-or-later'
				}
			],

			orgId: this.$route.params.orgId,
			projectId: this.$route.params.projectId,
			scanId: this.$route.params.scanId,
			scansOverview: {}, // 总览信息
			scansLibrary: [], // 组件清单
			scansById: {},
			// projectById: {},
			// scansLibraryGraph: {},
			libraryCurrentPage: 1,
			libraryPerPage: 20,
			reportLanguage: 'chinese',
			reportFormat: 'pdf',
			libraryRows: 0,
			libraryIsBusy: false
		};
	},
	watch: {
		reportFormat(val, oldVal) {
			if (val !== 'pdf') {
				this.reportLanguage = 'english';
			}
		},
		libraryCurrentPage() {
			this.getScansLibrary();
		}
	},
	mounted() {
		this.getScansLibraryOverview();
		this.getScansLibrary();
		this.getScansById();
		// this.getProjectById();
		// this.getScansLibraryGraph();
	},
	methods: {
		async getScansLibraryOverview() {
			// 总览
			this.scansOverview = await this.$backend.scans.libraries.getListMode(this.scanId, 'overview');
			this.libraryRows = this.scansOverview['library_count'];
			// console.log(this.scansOverview);
		},
		async getScansLibrary() {
			this.libraryIsBusy = true;
			// 组件清单
			this.scansLibrary = (await this.$backend.scans.libraries.getList(this.scanId, this.libraryCurrentPage, this.libraryPerPage)).results;
			// console.log(this.scansLibrary);
			this.libraryIsBusy = false;
		},
		getScansById() {
			// 扫描详细信息
			this.$backend.scans.getById(this.scanId).then(res => {
				this.scansById = res;

				// console.log(res);
				if (res['lib_report_status'] === 'Generating') {
					window.setTimeout(() => {
						this.getScansById();
					}, 1000);
				}
				
			});
		},
		// async getProjectById() {
		//   // 
		//   this.projectById = await this.$backend.projects.getById(this.projectId);
		//   // console.log(this.projectById);
		// },
		// async getScansLibraryGraph() {
		//   // 
		//   this.scansLibraryGraph = await this.$backend.scans.libraries.getListMode(this.scanId, 'dependency-graph');
		//   // console.log(this.scansLibraryGraph);
		// },
		downloadRepo() {
			this.$backend.export.libraries.download(this.scanId, this.reportLanguage, this.reportFormat);
		},
		exportRepo() {
			Promise.all([
				this.$backend.export.libraries.export(this.scanId, 'pdf', 'chinese'),
				this.$backend.export.libraries.export(this.scanId, 'csv', 'english'),
				this.$backend.export.libraries.export(this.scanId, 'xml', 'english'),
				this.$backend.export.libraries.export(this.scanId, 'json', 'english'),
			]).then(res => {
				this.getScansById();   
			});
		},
	}
};
</script>

<style lang="less">
.library-result-overview {
	td {
		width: 33.33%;
	}
}
.library-result-table {
	td:nth-child(6) {
		min-width: 60px;
	}
	td:nth-child(5) {
		min-width: 100px;
	}
	td:nth-child(4) {
		min-width: 100px;
	}
}
</style>
