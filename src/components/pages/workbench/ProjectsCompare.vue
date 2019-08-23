<template>
	<b-container>
		<div class="mb-5">
			<h1>扫描比较</h1>
		</div>

		<b-table
			:fields="[
				{ key: 'problems', label: '问题严重性' },
				{ key: 'libraries', label: '已搜到组件' },
			]"
			:items="[{}]"
			class="project-compare-column"
			bordered
		>
			<template slot="problems">
				<highcharts
					:options="{
						credits: { enabled: false },
						chart: {
							type: 'column'
						},
						title: {
							text: null
						},
						xAxis: {
							categories: ['未知', '低风险', '中等风险', '高风险', '超高风险']
						},
						credits: {
								enabled: false
						},
						series: problemsData
					}"
				></highcharts>
			</template>

			<template slot="libraries">
				<highcharts 
					:options="{
						credits: { enabled: false },
						chart: {
							type: 'column'
						},
						title: {
							text: null
						},
						xAxis: {
							categories: librariesCategory
						},
						credits: {
								enabled: false
						},
						series: [
							{
								name: '组件数量',
								data: librariesData
							},
						]
					}"
				></highcharts>
			</template>
		</b-table>

		<b-table
			:fields="compareFields"
			:items="compareData"
			class="project-compare-list text-center"
		>
			<template
				v-for="(id, index) in compareId"
				:slot="`Scan_${id}`"
				slot-scope="data"
			>{{ data.item.occurrences.includes(parseInt(id)) ? '有' : '没有' }}</template>

		</b-table>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			problemsData: [],
			librariesCategory: [],
			librariesData: [],

			problemsList: [
				{
					mark: 'CVE-2018-10000',
					style: 'CVE',
					abstract: 'The decode_init function in libavcodec/utvideodec.c in FFmpeg through 3.4.2 allows remote attackers to cause a denial of service (out of array read) via an AVI file.',
					score: 8
				},
				
			],

			compareFields: [
				{ key: 'public_id', label: '标识' },
				{ key: 'issue_type', label: '问题类型' },
				{ key: 'description', label: '简介' },
				{ key: 'score', label: '打分' }
			],
			orgId: this.$route.params.orgId,
			projectId: this.$route.params.projectId,
			compareId: this.$route.params.compareId.split('&'),
			compareData: []
		}
	},
	mounted() {
		this.setCompareFields();
		this.getLibraryOverview();
		this.getCompareData();
	},
	methods: {
		async getLibraryOverview() {
			Promise.all(this.compareId.map((id) => {
				return this.$backend.scans.libraries.getListMode(id, 'overview')
			})).then(res => {
				res.forEach((ele, index) => {
					this.problemsData.push({
						name: `Scan ${this.compareId[index]}`,
						data: [
							ele['scan_issues_overview']['none_scan_issues'],
							ele['scan_issues_overview']['low_scan_issues'],
							ele['scan_issues_overview']['medium_scan_issues'],
							ele['scan_issues_overview']['high_scan_issues'],
							ele['scan_issues_overview']['critical_scan_issues']
						]
					});

					this.librariesCategory.push(`Scan ${this.compareId[index]}`);

					this.librariesData.push(ele['library_count']);
				})
			})
		},
		async getCompareData() {
			this.compareData = (await this.$backend.orgs.scans.getByIdMode({
				orgId: this.orgId,
				scanId: this.compareId[0],
				mode: 'compare',
				scan1: this.compareId[1],
				scan2: this.compareId[2],
				scan3: this.compareId[3],
				scan4: this.compareId[4],
			})).results;

			// console.log(this.compareData);
			
		},
		setCompareFields() {
			this.compareId.forEach((id) => {
				this.compareFields.push({
					key: `Scan_${id}`,
					label: `Scan ${id}`
				});
			});
		}

	}
}
</script>

<style lang="less">
.project-compare-column {
	td:nth-child(1) {
		width: 70%;
	}
}
.project-compare-list {
	td:nth-child(3) {
		width: 40%;
		text-align: left;
	}
}
</style>
