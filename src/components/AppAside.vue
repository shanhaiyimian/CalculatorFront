<template>
	<aside class="aside">
		<el-menu
			:default-active="activeMenu"
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b"
			router
			class="aside-menu"
		>
			<!-- 原有游戏菜单 -->
			<el-menu-item-group title="🎮 游戏计算">
				<el-menu-item index="/fenying">
					<i class="el-icon-s-data"></i>
					<span slot="title">焚影</span>
				</el-menu-item>
				<!-- <el-menu-item index="/mingzun">
					<i class="el-icon-s-data"></i>
					<span slot="title">明尊</span>
				</el-menu-item> -->
			</el-menu-item-group>

			<!-- RAG 问答系统 -->
			<el-menu-item-group title="🤖 AI 知识库">
				<el-menu-item index="/chat">
					<i class="el-icon-chat-dot-square"></i>
					<span slot="title">AI 问答</span>
				</el-menu-item>
				<el-menu-item index="/knowledge">
					<i class="el-icon-collection"></i>
					<span slot="title">知识库管理</span>
				</el-menu-item>
			</el-menu-item-group>
		</el-menu>
	</aside>
</template>

<script>
export default {
	data() {
		return {
			job1: "焚影",
			job2: "明尊"
		};
	},
	computed: {
		activeMenu() {
			return this.$route.path
		}
	},
};
</script>

<style scoped>
.aside {
	/* 侧边栏宽度 */
	width: 200px;
	/* 设置背景色 */
	background-color: #545c64;
	overflow-y: auto;
}

.aside-menu {
	border-right: none;
}

/* 修复 Element UI 菜单组标题样式 */
.aside-menu >>> .el-menu-item-group__title {
	color: #a0a8b4;
	font-size: 12px;
	padding-left: 20px !important;
}
</style>
