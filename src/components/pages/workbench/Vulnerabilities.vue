<template>
	<b-container>
		<div class="mb-5">
			<h1>漏洞</h1>
		</div>
		<b-table
			:fields="[
				{ key: 'all', label: '总览' },
				{ key: 'cve', label: 'CVE' },
				{ key: 'bug', label: 'Bug' },
				{ key: 'warn', label: '警告' },
			]" 
			:items="[{}]"
			class="vul-overview text-center"
		>
			<template slot="all">
				<highcharts
					v-if="total.vul !== 0"
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
								['超高风险', vulCount['critical']],
								['高风险', vulCount['high']],
								['中等风险', vulCount['medium']],
								['低风险', vulCount['low']],
								['未知', vulCount['none']],
							]
						}],
						pie: {
							showInLegend: true
						}
					}"
				></highcharts>
				<span v-if="total.vul === 0">未发现问题</span>
			</template>

			<template slot="cve">
				<highcharts
					v-if="total.cve !== 0"
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
								['超高风险', issuesSummary.cve['critical']],
								['高风险', issuesSummary.cve['high']],
								['中等风险', issuesSummary.cve['medium']],
								['低风险', issuesSummary.cve['low']],
								['未知', issuesSummary.cve['none']],
							]
						}],
						pie: {
							showInLegend: true
						}
					}"
				></highcharts>
				<span v-if="total.cve === 0">未发现问题</span>
			</template>

			<template slot="bug">
				<highcharts
					v-if="total.bug !== 0"
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
								['超高风险', issuesSummary.bug['critical']],
								['高风险', issuesSummary.bug['high']],
								['中等风险', issuesSummary.bug['medium']],
								['低风险', issuesSummary.bug['low']],
								['未知', issuesSummary.bug['none']],
							]
						}],
						pie: {
							showInLegend: true
						}
					}"
				></highcharts>
				<span v-if="total.bug === 0">未发现问题</span>
			</template>

			<template slot="warn">
				<highcharts
					v-if="total.vcc !== 0"
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
								['超高风险', issuesSummary.vcc['critical']],
								['高风险', issuesSummary.vcc['high']],
								['中等风险', issuesSummary.vcc['medium']],
								['低风险', issuesSummary.vcc['low']],
								['未知', issuesSummary.vcc['none']],
							]
						}],
						pie: {
							showInLegend: true
						}
					}"
				></highcharts>
				<span v-if="total.vcc === 0">未发现问题</span>
			</template>
		</b-table>

		<!-- 问题列表 -->
		<b-table 
			:fields="[
				{ key: 'name', label: '项目' },
				{ key: 'cve', label: 'CVE' },
				{ key: 'bug', label: 'Bug' },
				{ key: 'vcc', label: '安全警告' },
				{ key: 'last', label: '最后扫描' },
				{ key: 'scan', label: '情况' },
			]"
			:items="issuesOverview"
			class="vul-by-project text-center"
		>
			<template slot="thead-top">
				<h4>按项目分类</h4>
			</template>

			<template 
				slot="name" 
				slot-scope="data"
			>
				<b-link :to="`projects/${data.item.id}`">{{ data.item.name }}</b-link>
			</template>

			<template 
				slot="last" 
				slot-scope="data"
			>{{ ago(Date.parse(data.item['scan_modified'])) }}</template>

			<template 
				slot="scan"
				slot-scope="data"
			>
				<b-link :to="`projects/${data.item.id}/vulnerabilities/${data.item['latest_completed_scan_id']}`">查看</b-link>
			</template>
		</b-table>

		<b-table 
			:fields="[
				{ key: 'public_id', label: '问题编号' },
				{ key: 'description', label: '描述' },
				{ key: 'issue_type', label: '类型' },
				{ key: 'score', label: '评分' },
				{ key: 'project_count', label: '受影响项目' },
				{ key: 'result', label: '结果' },
			]"
			:items='groupByIssue'
			class="vul-by-issue text-center"
		>
			<template slot="thead-top">
				<h4>按问题分类</h4>
			</template>

			<template 
				slot="project_count"
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
					<b-link :to="`projects/${data.item.projects[index]}/vulnerabilities/${data.item.scans[index]}`">查看</b-link>
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
			issuesSummary: {},
			issuesOverview: [],
			groupByIssue: [],
			vulCount: {
				none: 0,
				medium: 0,
				low: 0,
				high: 0,
				critical: 0
			},
			total: {
				vul: 0,
				bug: 0,
				cve: 0,
				vcc: 0
			}
		};
	},
	mounted() {
		this.getIssuesOverview();
		this.getIssuesSummary();
		this.getgroupByIssue();
	},
	methods: {
		async getIssuesSummary() {
			this.issuesSummary = await this.$backend.orgs.issues.getListMode(this.orgId, 'issue-summary');
			
			Object.keys(this.issuesSummary).forEach((key) => {
				this.vulCount.none += this.issuesSummary[key].none;
				this.vulCount.medium += this.issuesSummary[key].medium;
				this.vulCount.low += this.issuesSummary[key].low;
				this.vulCount.high += this.issuesSummary[key].high;
				this.vulCount.critical += this.issuesSummary[key].critical;

				this.total[key] = this.issuesSummary[key].none + this.issuesSummary[key].medium + this.issuesSummary[key].low + this.issuesSummary[key].high + this.issuesSummary[key].critical;
			});

			this.total.vul = this.total.bug + this.total.cve + this.total.vcc;
		},
		async getIssuesOverview() {
			this.issuesOverview = (await this.$backend.orgs.projects.getListMode(this.orgId, 'issue-overview')).results;
		},
		async getgroupByIssue() {
			this.groupByIssue = (await this.$backend.orgs.issues.getListMode(this.orgId, 'group-by-issues')).results;
		}
	}
};
</script>

<style lang='less'>
.vul-overview {
	td {
		width: 25%;
	}
}
.vul-by-project {
	td {
		width: 16.66%;
	}
}
.vul-by-issue {
	td:nth-child(1) {
		width: 15%;
	}
	td:nth-child(3) {
		width: 7%;
	}
	td:nth-child(4) {
		width: 7%;
	}
	td:nth-child(5) {
		width: 10%;
	}
	td:nth-child(6) {
		width: 7%;
	}
}
</style>
