<template>
	<b-container>
		<div class="mb-5">
			<h1>许可证详情</h1>
		</div>

		<b-table 
			:fields="[
				{key: 'license_name', label: '许可证名称'},
				{key: 'category', label: '类型'},
				{key: 'action_type', label: '状态'},
				{key: 'library_name', label: '组件'},
				{key: 'license_score', label: '打分'},
				{key: 'detail', label: '详情'},
			]" 
			:items='licenseIssues'
			class="license-result"
			id="license-result-table"
			:per-page="licensePerPage"
			:busy="licenseIsBusy"
		>
			<template slot="thead-top">
				<tr>
					<th>
						<h4>许可证清单</h4>
					</th>
					<th>
						<b-button
							size="sm"
							v-if="scansById['lic_report_status'] === 'Available'"
							@click="downloadRepo"
						>下载</b-button>
						<b-button
							size="sm"
							v-if="scansById['lic_report_status'] === 'N.A.'"
							@click="exportRepo"
						>导出</b-button>
						<b-button
							size="sm"
							v-if="scansById['lic_report_status'] === 'Generating'"
							disabled
						>导出中</b-button>
					</th>
					<th>
						<b-form-select 
							v-if="scansById['lic_report_status'] === 'Available'"
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
							v-if="scansById['lic_report_status'] === 'Available' && reportFormat === 'pdf'"
							v-model="reportLanguage" 
							:options="[
								{ value: 'chinese', text: '中文' },
								{ value: 'english', text: '英文' },
							]" 
							size="sm" 
						></b-form-select>
					</th>
					<th colspan="2">&nbsp;</th>
				</tr>  
			</template>

			<template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>

			<template 
				slot="license_name"
				slot-scope="data"
			>{{ data.item['license_name'] === null ? '无' : data.item['license_name'] }}</template>

			<template 
				slot="license_score"
				slot-scope="data"
			>{{ data.item['license_score'] === null ? '无' : data.item['license_score'] }}</template>

			<template 
				slot="category"
				slot-scope="data"
			>{{ category[data.item['license_category']] }}</template>

			<template 
				slot="detail"
				slot-scope="data"
			>
				<b-link :to="`${scanId}/issue/${data.item.id}`">查看</b-link>
			</template>
		</b-table>

		<b-pagination
			v-model="licenseCurrentPage"
			:total-rows="licenseRows"
			:per-page="licensePerPage"
			aria-controls="license-result-table"
			align="center"
			size="sm"
		></b-pagination>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			orgId: this.$route.params.orgId,
			projectId: this.$route.params.projectId,
			scanId: this.$route.params.scanId,
			licenseIssues: [],
			category: {
				Permissive: '允许的',
				Restrictive: '受限的',
				null: '未知'
			},
			scansById: {},
			reportLanguage: 'chinese',
			reportFormat: 'pdf',
			licenseCurrentPage: 1,
			licensePerPage: 15,
			licenseRows: 0,
			licenseIsBusy: false
		};
	},
	watch: {
		reportFormat(val, oldVal) {
			if (val !== 'pdf') {
				this.reportLanguage = 'english';
			}
		},
		licenseCurrentPage() {
			this.getLicenseIssues();
		}
	},
	mounted() {
		this.getLicenseIssues();
		this.getScansById();
	},
	methods: {
		async getLicenseIssues() {
			this.licenseIsBusy = true;
			this.licenseIssues = (await this.$backend.scans.licenseIssues.getListPage(this.scanId, this.licenseCurrentPage, this.licensePerPage)).results;
			this.licenseIsBusy = false;
			// console.log(this.licenseIssues);
		},
		getScansById() {
			// 扫描详细信息
			this.$backend.scans.getById(this.scanId).then(res => {
				this.scansById = res;
				this.licenseRows = res['not_in_rules_count'] + res['approved_count'] + res['denied_count'] + res['flagged_count'];

				if (res['lic_report_status'] === 'Generating') {
					window.setTimeout(() => {
						this.getScansById();
					},1000);
				}
			});
		},
		downloadRepo() {
			this.$backend.export.licenseIssues.download(this.scanId, this.reportLanguage, this.reportFormat);
		},
		exportRepo() {
			Promise.all([
				this.$backend.export.licenseIssues.export(this.scanId, 'pdf', 'chinese'),
				this.$backend.export.licenseIssues.export(this.scanId, 'csv', 'english'),
				this.$backend.export.licenseIssues.export(this.scanId, 'xml', 'english'),
				this.$backend.export.licenseIssues.export(this.scanId, 'json', 'english'),
			]).then(res => {
				this.getScansById();   
			});
		},
	}
};
</script>

<style lang="less">
.license-result {
	td:nth-child(1) {
		width: 25%;
	}
}
</style>
