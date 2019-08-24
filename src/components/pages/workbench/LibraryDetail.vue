<template>
	<b-container>
		<div class="mb-5">
			<h1>组件详情</h1>
		</div>
		<!-- 总览 -->
		<b-table
			:fields="[
				{ key: 'vulStatus', label: '漏洞状态' },
				{ key: 'vulnerabilities', label: '漏洞' },
				{ key: 'version', label: '版本' },
				{ key: 'licensesStatus', label: '许可证状态' },
				{ key: 'licenses', label: '许可证' },
			]" 
			:items="[{}]"
			class="library-detail-overview"
			v-if="libraryByScanId['library_version'] !== undefined"
		>
			<template slot="thead-top">
				<tr>
					<th>
						<h5>{{ libraryByScanId['library_version'].library.name }}-{{ libraryByScanId['module_name'] }}</h5>
					</th>
					<th colspan="4"></th>
				</tr>  
			</template>

			<template slot="vulStatus">{{ vulStatus[libraryByScanId['vulnerability_level']] }}</template>

			<template slot="vulnerabilities">
				<div>超高风险:&nbsp;{{ libraryByScanId['vul_critical_count'] }}</div>
				<div>高风险:&nbsp;{{ libraryByScanId['vul_high_count'] }}</div>
				<div>中等风险:&nbsp;{{ libraryByScanId['vul_medium_count'] }}</div>
				<div>低风险:&nbsp;{{ libraryByScanId['vul_low_count'] }}</div>
				<div>未知:&nbsp;{{ libraryByScanId['vul_none_count'] }}</div>
			</template>

			<template slot="version">{{ libraryByScanId['library_version']['version_number'] }}</template>
			<template slot="licenses">{{ libraryByScanId['library_version'].license.name }}</template>

		</b-table>
		<!-- 漏洞详情列表 -->
		<b-table 
			:fields="[
				{key: 'id', label: '标识'},
				{key: 'style', label: '类型'},
				{key: 'severity', label: '严重性'},
				{key: 'score', label: '打分'},
				{key: 'detail', label: '详情'},
			]" 
			:items='issueList'
			class="libraries-detail-table mt-5"
		>
			<template slot="thead-top">
				<tr>
					<th>
						<h5>漏洞详情</h5>
					</th>
					<th colspan="5"></th>
				</tr>
			</template>

			<template 
				slot="id" 
				slot-scope="data"
			>
				<a
					target="_blank"
					:href="`https://nvd.nist.gov/vuln/detail/${data.item['security_issue']['public_id']}`"
				>{{ data.item['security_issue']['public_id'] }}</a>
			</template>

			<template 
				slot="style" 
				slot-scope="data"
			>{{ data.item['issue_type'] }}</template>

			<template 
				slot="severity" 
				slot-scope="data"
			>{{ vulStatus[data.item['security_issue']['severity'].toLowerCase()] }}</template>

			<template 
				slot="score" 
				slot-scope="data"
			>{{ data.item['security_issue']['score'] }}</template>

			<template slot="detail" slot-scope="data">
				<b-link @click="$bvModal.show(`modal-detail-${data.item.id}`)">查看</b-link>

				<b-modal 
					:id="`modal-detail-${data.item.id}`"
					hide-footer
				>
					<template slot="modal-title">详情</template>
					<p>攻击变量:&nbsp;{{ data.item['security_issue']['issue_data']['vector']['attackVector'] }}</p>
					<p>攻击复杂度:&nbsp;{{ data.item['security_issue']['issue_data']['vector']['attackComplexity'] }}</p>
					<p>需要特殊权限:&nbsp;{{ data.item['security_issue']['issue_data']['vector']['privilegesRequired'] }}</p>
					<p>用户交互:&nbsp;{{ data.item['security_issue']['issue_data']['vector']['userInteraction'] }}</p>
					<p>{{ data.item['security_issue'].description }}</p>
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
			projectId: this.$route.params.projectId,
			scanId: this.$route.params.scanId,
			issueId: this.$route.params.issueId,
			libraryByScanId: {},
			issueList: [],
			vulStatus: {
				critical: '超高风险',
				high: '高风险',
				medium: '中等风险',
				low: '低风险',
			}
		};
	},
	mounted() {
		this.getLibraryByScanId();
		this.getIssueList();
	},
	methods: {
		async getLibraryByScanId() {
			this.libraryByScanId = await this.$backend.libraries.getById(this.issueId);
		},
		async getIssueList() {
			this.issueList = (await this.$backend.libraries.issues.getList(this.issueId)).results;
		},
	}
};
</script>

<style lang="less">
.libraries-detail-table {
	td {
		width: 22%;
	}
}
</style>
