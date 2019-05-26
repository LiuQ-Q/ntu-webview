<template>
	<div class="sidebar">
		<b-card
			v-for="(item, index) in items" 
			:key="index"
			class="border-0 rounded-0"
			no-body
		>
			<b-button
				block
				variant="white"
				:href="item.url"
				:class="{
					'rounded-0': true, 
					'text-left': true, 
					'py-3': true,
					'active': index === activeBtn
				}"
				@click.passive="changeActiveBtn(index)"
			>{{ item.name }}</b-button>
		</b-card>
	</div>
</template>

<script>
export default {
	name: 'side-bar',
	data() {
		return {
      items: [
        { name: '控制台', url: '#/home' },
        { name: '项目', url: '#' },
        { name: '组件', url: '#' },
        { name: '漏洞', url: '#' },
        { name: '许可证', url: '#' },
        { name: '关系网', url: '#' }
      ],
			activeBtn: -1
		}
	},
	methods: {
		changeActiveBtn(index) {
			this.activeBtn = index;
		}
	}
};
</script>

<style lang="less">
.sidebar {
	.card {
		background-color: rgba(0,0,0,0);
	}

	.btn {
		color: #ffffff;
		&:hover {
			background-color: #007BFF;
			color: #fff;
			.fas {
				color: #fff;
			}
		}
		&.active {
			background-color: #007BFF;
			color: #fff;
			.fas {
				color: #fff;
			}
		}
		.fas {
			color: #000;
			width: 25px;
			font-size: 18px;
		}
	}
}
</style>

