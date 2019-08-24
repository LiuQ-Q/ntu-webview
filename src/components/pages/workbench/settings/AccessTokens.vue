<template>
	<div class="mt-3">
		<b-form class="signin-form">
			<b-form-group label="创建令牌">
				<b-form-input 
					placeholder="名称至少5个字符" 
					style="width:50%;"
					v-model="tokenName"
				></b-form-input>
			</b-form-group>
			<b-button
				size="sm"
				@click="creatToken"
				:disabled="tokenName.length < 5"
			>创建</b-button>
		</b-form>

		<div v-if="token !== ''">
			<p>请保存好您的令牌!</p>
			<p>{{ token.token }}</p>
		</div>

		<b-table
			:items="tokenList"
			:fields="[
				{ key: 'name', label: '名称' },
				{ key: 'creator_username', label: '创建者' },
				{ key: 'action', label: '操作' },
			]"
			class="mt-3"
		>
			<template
				slot="action"
				slot-scope="data"
			>
				<b-link @click="deleteToken(data.item.id)">删除</b-link>
			</template>
		</b-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tokenName: '',
			token: '',

			tokenList: []
		};
	},
	computed: {
		orgId() {
			return this.$route.params.orgId;
		},
	},
	mounted() {
		this.getTokenList();
	},
	methods: {
		getTokenList() {
			this.$backend.orgs.tokens.getList(this.orgId).then(res => {
				this.tokenList = res.results;
			});
		},
		creatToken() {
			this.$backend.orgs.tokens.create(this.orgId, this.tokenName).then(res => {
				this.token = res;
				this.getTokenList();
			});
		},
		deleteToken(tokenId) {
			this.$backend.orgs.tokens.delete(this.orgId, tokenId).then(res => {
				this.token = res;
				this.getTokenList();
			});
		}
	}
};
</script>

<style>

</style>
