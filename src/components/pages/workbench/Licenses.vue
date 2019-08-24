<template>
	<b-container>
		<div class="mb-5">
			<h1>许可证</h1>
		</div>

		<b-table
			:fields="[
				{ key: 'count', label: '许可证数量' },
				{ key: 'overview', label: '概览' },
			]" 
			:items="[{}]"
			class="projects-overview"
		>
			<template slot="count">
				<p>被允许的:&nbsp;{{ licenseOverview['approve'] }}</p>
				<p>被标记的:&nbsp;{{ licenseOverview['flag'] }}</p>
				<p>受限的:&nbsp;{{ licenseOverview['deny'] }}</p>
				<p>未定义的:&nbsp;{{ licenseOverview['not_in_rules'] }}</p>
			</template>

			<template slot="overview">
				<highcharts
					v-if="licenseIssueTotal !== 0"
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
								['受限的', licenseOverview['deny']],
								['被标记的', licenseOverview['flag']],
								['被允许的', licenseOverview['approve']],
							]
						}],
						pie: {
							showInLegend: true
						}
					}"
				></highcharts>
				<span v-if="licenseIssueTotal === 0">未发现问题</span>
			</template>
		</b-table>
		<!-- 列表 -->
		<b-table 
			:fields="[
				{ key: 'name', label: '项目' },
				{ key: 'policy_name', label: '政策' },
				{ key: 'allowed', label: '被允许的' },
				{ key: 'flagged', label: '被标记的' },
				{ key: 'restricted', label: '受限的' },
				{ key: 'scan_modified', label: '最后扫描' },
				{ key: 'scan', label: '详情' },
			]"
			:items="projectByLicense"
			class="licenses-by-project text-center"
		>
			<template slot="thead-top">
				<h4>按项目分类</h4>
			</template>

			<template slot="name" slot-scope="data">
				<b-link :to="`projects/${data.item.id}`">{{ data.item.name }}</b-link>
			</template>

			<template slot="allowed" slot-scope="data">{{ data.item.allowed || '0'}}</template>

			<template slot="flagged" slot-scope="data">{{ data.item.flagged || '0'}}</template>

			<template slot="restricted" slot-scope="data">{{ data.item.restricted || '0' }}</template>

			<template 
				slot="scan_modified" 
				slot-scope="data"
			>{{ ago(Date.parse(data.item['scan_modified'])) }}</template>

			<template 
				slot="scan"
				slot-scope="data"
			>
				<b-link :to="`projects/${data.item.id}/licenses/${data.item['latest_completed_scan_id']}`">查看</b-link>
			</template>
		</b-table>

		<b-table 
			:fields="[
				{ key: 'license_identifier', label: '许可证' },
				{ key: 'license_name', label: '描述' },
				{ key: 'license_score', label: '得分' },
				{ key: 'affect', label: '受影响项目' },
				{ key: 'result', label: '受影响项目' },
			]"
			:items='groupByLicense'
			class="licenses-by-library text-center"
		>
			<template slot="thead-top">
				<h4>按许可证分类</h4>
			</template>

			<template 
				slot="affect"
				slot-scope="data"
			>
				<div
					v-for="(name, index) in data.item['project_names']"
					:key="index"
				>
					<b-link :to="`projects/${data.item.projects[index]}`">{{ name }}</b-link>
				</div>
			</template>

			<template 
				slot="result"
				slot-scope="data"
			>
				<div
					v-for="(name, index) in data.item['project_names']"
					:key="index"
				>
					<b-link :to="`projects/${data.item.projects[index]}/libraries/${data.item.scans[index]}`">查看</b-link>
				</div>
			</template>
		</b-table>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			orgId: this.$route.params.orgId,
			licenseOverview: {},
			licenseIssueTotal: 0,
			projectByLicense: [],
			groupByLicense: []
		};
	},
	mounted() {
		this.getLicenseOverview();
		this.getProjectByLicense();
		this.getGroupByLicense();
	},
	methods: {
		async getLicenseOverview() {
			this.licenseOverview = await this.$backend.orgs.licenses.getListMode(this.orgId, 'overview');

			this.licenseIssueTotal = this.licenseOverview['approve'] + this.licenseOverview['flag'] + this.licenseOverview['deny'];
		},
		async getProjectByLicense() {
			this.projectByLicense = (await this.$backend.orgs.projects.getListMode(this.orgId, 'license-result-overview')).results;
		},
		async getGroupByLicense() {
			this.groupByLicense = (await this.$backend.orgs.licenses.getListMode(this.orgId, 'group-by-licenses')).results;
		}
	}
};
</script>

<style lang='less'>
.licenses-by-project {
	h4 {
		text-align: left;
	}
	td {
		width: 14.3%;
	} 
}
.licenses-by-library {
	h4 {
		text-align: left;
	}
	td:nth-child(1) {
		width: 15%;
	}
	td:nth-child(3) {
		width: 10%;
	}
}
</style>
