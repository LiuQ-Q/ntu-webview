<template>
	<b-container>
		<div class="mb-5">
			<h1>设置</h1>
		</div>
		<b-nav tabs style="height:42px;">
			<b-nav-item
				v-for="(nav, index) in navs"
				:key="index"
				:to="`/workbench/1/settings/${nav.url}`"
				style="float:left;"
			>{{ nav.title }}</b-nav-item>
		</b-nav>
		<div>
			<router-view></router-view>
		</div>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			navs: [
				{title:'机构', url:'organizations'},
				{title:'小组', url:'teams'},
				// {title:'组员', url:'members'},
				// {title:'集成', url:'integration'},
				{title:'令牌', url:'accesstokens'},
			]
		};
	}
};
</script>

<style lang="less">

</style>
