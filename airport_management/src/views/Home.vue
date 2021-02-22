<template>
	<el-container class="home_container">
		<!-- 整体页面头部 -->
		<el-header class="home_header">
			<!-- 头部：图标与名称展示 -->
			<div class="info_box">
				<div>
					<img src="../assets/images/logo.png" />
					<span>机场航班展示系统</span>
				</div>
			</div>
			<!-- 头部：横向导航菜单 -->
			<el-menu
				class="el-menu"
				mode="horizontal"
				background-color="#f5f6fa"
				active-text-color="#0097e6"
				default-active="/airports"
				router
			>
				<el-menu-item index="/map">地图</el-menu-item>
				<el-menu-item index="/airports">机场查询</el-menu-item>
				<el-menu-item index="/airlines">航班动态</el-menu-item>
			</el-menu>
			<!-- 头部：右侧头像-退出登录 -->
			<div class="block avatar el-dropdown-link">
				<el-dropdown trigger="click" @command="handleCommand">
					<el-avatar
						:size="30"
						src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
					></el-avatar>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="signout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</el-header>
		<!-- 整体页面主体 -->
		<el-main class="home_main">
			<!-- 主体：子路由 -->
			<router-view></router-view>
		</el-main>
	</el-container>
</template>

<script>
export default {
	name: "Home",
	data() {
		return {}
	},
	methods: {
		handleCommand(command) {
			window.sessionStorage.clear()
			this.$message({ type: "success", message: "退出登录成功" })
			this.$router.push("/login")
		},
	},
}
</script>

<style lang="less" scoped>
.home_container {
	height: 100%;
}
.home_header {
	background-color: @homeWhite;
	display: flex;
	align-items: center;
	padding-left: 0;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .15);
  z-index: 9999;

	.info_box {
		width: 320px;
		height: 0;
		border-width: 60px 60px 0 0;
		border-style: solid solid none none;
		border-color: @homeBlue transparent transparent transparent;
		position: relative;

		& > div {
			color: @homeWhite;
			position: absolute;
			top: -55px;
			font-size: 1.4rem;
			font-weight: 600;
			letter-spacing: 0.4rem;
			display: flex;
			align-items: center;

			img {
				height: 50px;
				padding: 0 10px;
			}
		}
	}
}

.el-menu-item {
	margin: 0 20px;
	&:hover {
		color: @homeBlue !important;
		background-color: transparent !important;
	}
}

.avatar {
	cursor: pointer;
	margin-left: auto;
}

.home_main {
	background-color: @homeGray;
	overflow: scroll;
	overflow-x: auto;
	overflow-y: auto;
}
</style>