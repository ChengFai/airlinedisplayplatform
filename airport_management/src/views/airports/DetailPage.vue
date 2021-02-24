<template>
	<div>
		<el-page-header @back="goBack" :content="name"> </el-page-header>
		<el-card>
			<el-tabs type="border-card">
				<el-tab-pane :label="`从${name}到其他机场`" @click="getByFrom">
					<!-- 根据启航机场列表组件 -->
					<from-to-list :cAirportsList="listByFrom"></from-to-list>
				</el-tab-pane>
				<el-tab-pane :label="`从其他机场到${name}`" @click="getByTo">
					<!-- 根据抵达机场列表组件 -->
					<from-to-list :cAirportsList="listByTo"></from-to-list>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import FromToList from "../../components/detailpage/FromToList"
export default {
	name: "DetailPage",
	data() {
		return {
			name: "", // 机场姓名
			listByFrom: [], // 根据启航机场列表
			listByTo: [], // 根据抵达机场列表
		}
	},
	methods: {
		goBack() {
			this.$router.back(-1)
		},
		async _getList(type) {
			let result = []
			if (type == "from") {
				// 获取从XXX出发的航班数据
				const { data } = await this.$http.post("/api/airlines/findbyfairport", {
					startAirport: this.name,
				})
				result = data
				if (result.meta.status == 1) {
					this.listByFrom = result.data
				} else {
					this.$message({ type: "error", message: result.meta.msg })
				}
			} else {
				// 获取到XXX的航班数据
				const { data } = await this.$http.post("/api/airlines/findbytairport", {
					endAirport: this.name,
				})
				result = data
				if (result.meta.status == 1) {
					this.listByTo = result.data
				} else {
					this.$message({ type: "error", message: result.meta.msg })
				}
			}
		},
	},
	created() {
		this.name = this.$route.params.name
		this._getList("from")
		this._getList("to")
	},
	components: {
		FromToList,
	},
}
</script>

<style lang="less" scoped>
.el-card {
	margin-top: 20px;
}
</style>