<template>
	<b-container>
		<div class="mb-3">
			<h1>许可证政策</h1>
		</div>

		<b-button 
			v-if="!licensePolicieNow['is_default']"
			size="sm"
			class="mb-3"
			@click="$bvModal.show('modal-add-policy')"
		>添加政策</b-button>

		<h3>许可证</h3>
		<b-table
			:fields="[
				{ key: 'approve', label: '被允许的' },
				{ key: 'flag', label: '被标记的' },
				{ key: 'deny', label: '受限的' },
			]"
			:items="[{}]"
			class="license-policy-list mb-5"
			small
		> 
			<template slot="approve">
				<div
					v-if="approvePolicy.length !== 0"
					v-for="(policy, index) in approvePolicy"
					:key="index"
				>{{ policy['item_name'] }}
					<b-link
						v-if="!licensePolicieNow['is_default']"
						class="delete-policy"
						@click="deletePolicy(policy.id)"
					>删除</b-link>
				</div>
				<div v-if="approvePolicy.length === 0">无</div>
			</template>

			<template slot="flag">
				<div
					v-if="flagPolicy.length !== 0"
					v-for="(policy, index) in flagPolicy"
					:key="index"
				>{{ policy['item_name'] }}
					<b-link
						v-if="!licensePolicieNow['is_default']"
						class="delete-policy"
						@click="deletePolicy(policy.id)"
					>删除</b-link>
				</div>
				
				<div v-if="flagPolicy.length === 0">无</div>
			</template>

			<template slot="deny">
				<div
					v-if="denyPolicy.length !== 0"
					v-for="(policy, index) in denyPolicy"
					:key="index"
				>{{ policy['item_name'] }}
					<b-link
						v-if="!licensePolicieNow['is_default']"
						class="delete-policy"
						@click="deletePolicy(policy.id)"
					>删除</b-link>
				</div>
				<div v-if="denyPolicy.length === 0">无</div>
			</template>
		</b-table>
		
		<h3>许可证属性</h3>
		<b-table
			:fields="[
				{ key: 'approve', label: '被允许的' },
				{ key: 'flag', label: '被标记的' },
				{ key: 'deny', label: '受限的' },
			]"
			:items="[{}]"
			class="license-policy-list"
			small
		>
			<template slot="approve">
				<div
					v-if="approvePolicyAttr.length !== 0"
					v-for="(policy, index) in approvePolicyAttr"
					:key="index"
				>{{ policy['item_name'] }}
					<b-link
						v-if="!licensePolicieNow['is_default']"
						class="delete-policy"
						@click="deletePolicy(policy.id)"
					>删除</b-link>
				</div>
				<div v-if="approvePolicyAttr.length === 0">无</div>
			</template>

			<template slot="flag">
				<div
					v-if="flagPolicyAttr.length !== 0"
					v-for="(policy, index) in flagPolicyAttr"
					:key="index"
				>{{ policy['item_name'] }}
					<b-link
						v-if="!licensePolicieNow['is_default']"
						class="delete-policy"
						@click="deletePolicy(policy.id)"
					>删除</b-link>
				</div>
				<div v-if="flagPolicyAttr.length === 0">无</div>
			</template>

			<template slot="deny">
				<div
					v-if="denyPolicyAttr.length !== 0"
					v-for="(policy, index) in denyPolicyAttr"
					:key="index"
				>{{ policy['item_name'] }}
					<b-link
						v-if="!licensePolicieNow['is_default']"
						class="delete-policy"
						@click="deletePolicy(policy.id)"
					>删除</b-link>
				</div>
				<div v-if="denyPolicyAttr.length === 0">无</div>
			</template>
		</b-table>

		<b-modal 
			id="modal-add-policy"
			ref="modal-add-policy"
			scrollable 
			hide-footer
		>
			<template slot="modal-title">添加规则</template>
			
			<div>
				种类选择:
				<b-form-select
					v-model="ruleType"
					size='sm'
					class="my-2"
				>
					<option value="license">许可证</option>
					<option value="licenseattribute">许可证属性</option>
				</b-form-select>
			</div>

			<div v-if="ruleType === 'license'">
				许可证选择:
				<b-form-select
					v-model="itemId"
					size='sm'
					class="my-2"
				>
					<option
						v-for="(item, index) in licenseList"
						:key="index"
						:value="item.id"
					>{{ item.name }}</option>
				</b-form-select>
			</div>

			<div v-if="ruleType === 'licenseattribute'">
				许可证属性选择:
				<b-form-select
					v-model="itemId"
					size='sm'
					class="my-2"
				>
					<option
						v-for="(item, index) in licenseAttributes"
						:key="index"
						:value="item.id"
					>{{ item.name }}</option>
				</b-form-select>

				<b-form-select
					v-model="attributeCategory"
					size='sm'
					class="my-2"
				>
					<option value="allowed">被允许的</option>
					<option value="required">要求的</option>
					<option value="restricted">受限的</option>
				</b-form-select>
			</div>

			<div>
				管理操作:
				<b-form-select
					v-model="action"
					size='sm'
					class="my-2"
				>
					<option value="approve">允许</option>
					<option value="flag">标记</option>
					<option value="deny">受限</option>
				</b-form-select>

				<b-button
					v-if="ruleType === 'license'"
					size="sm"
					variant="primary"
					block
					@click="addLicense"
				>添加许可证</b-button>

				<b-button
					v-if="ruleType === 'licenseattribute'"
					size="sm"
					variant="primary"
					block
					@click="addLicenseAttr"
				>添加许可证属性</b-button>
			</div>
		</b-modal>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			licensePolicieNow: {},
			licenseList: [],
			licenseAttributes: [],
			policyRules: [],
			approvePolicy: [],
			flagPolicy: [],
			denyPolicy: [],
			approvePolicyAttr: [],
			flagPolicyAttr: [],
			denyPolicyAttr: [],

			ruleType: 'license',
			itemId: '1',
			action: 'approve',
			attributeCategory: 'allowed',
		};
	},
	computed: {
		orgId() {
			return this.$route.params.orgId;
		},
		policyId() {
			return this.$route.params.policyId;
		},
	},
	mounted() {
		this.getOrgsLicensePolicies();
		this.getLicenseList();
		this.getLicenseAttributes();
		this.getPolicyRules();
	},
	methods: {
		getOrgsLicensePolicies() {
			// 许可证政策列表
			// this.$backend.orgs.getByIdMode(this.orgId, 'license-policies').then(res => {
			this.$backend.orgs.licensePolicies.getById(this.orgId, this.policyId).then(res => {
				this.licensePolicieNow = res;
				// console.log(res);
			
			});
		},
		getLicenseList() {
			// 添加许可证相关
			this.$backend.licenses.getList().then(res => {
				this.licenseList = res.results;
				// console.log(res);
				
			});
		},
		getLicenseAttributes() {
			// 添加许可证属性相关
			this.$backend.licenses.attributes.getList().then(res => {
				this.licenseAttributes = res.results;
				// console.log(res);
				
			});
		},
		getPolicyRules() {
			// 列表相关
			this.$backend.orgs.licensePolicies.getByIdMode(this.orgId, this.policyId, 'license-policy-rules').then(res => {
				this.policyRules = res.results;
				// console.log(this.policyRules);
				res.results.forEach((ele, i) => {
					if (ele['rule_type'] === 'license') {
						switch (ele['action']) {
						case 'approve':
							this.approvePolicy.push(ele);
							break;

						case 'flag':
							this.flagPolicy.push(ele);
							break;

						case 'deny':
							this.denyPolicy.push(ele);
							break;
					
						default:
							break;
						}
					} else if (ele['rule_type'] === 'licenseattribute') {
						switch (ele['action']) {
						case 'approve':
							this.approvePolicyAttr.push(ele);
							break;
							
						case 'flag':
							this.flagPolicyAttr.push(ele);
							break;

						case 'deny':
							this.denyPolicyAttr.push(ele);
							break;
					
						default:
							break;
						}
					}
				});
			});
		},
		updateView() {
			this.approvePolicy = [];
			this.flagPolicy = [];
			this.denyPolicy = [];
			this.approvePolicyAttr = [];
			this.flagPolicyAttr = [];
			this.denyPolicyAttr = [];
			this.getPolicyRules();
		},
		addLicense() {
			this.$backend.orgs.licensePolicies.createRules(this.orgId, this.policyId, this.ruleType, this.itemId, this.action).then(res => {
				this.updateView();
				this.$refs['modal-add-policy'].hide();
			});
		},
		addLicenseAttr() {
			this.$backend.orgs.licensePolicies.createRules(this.orgId, this.policyId, this.ruleType, this.itemId, this.action, this.attributeCategory).then(res => {
				this.updateView();
			});
		},
		deletePolicy(ruleId) {
			this.$backend.orgs.licensePolicies.deleteRules(this.orgId, this.policyId, ruleId).then(res => {
				this.updateView();
			});
		}
	}
};
</script>

<style lang="less">
.license-policy-list {
	td {
		width: 33.33%;
		div {
			height: 50px;
			border-bottom: 1px solid #ccc;
		}
	}

	.delete-policy {
		float: right;
		padding-right: 20px;
	}
}
</style>
