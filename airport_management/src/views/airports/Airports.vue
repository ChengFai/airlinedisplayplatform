<template>
	<div>
		<el-card>
			<el-tabs tab-position="left">
				<el-tab-pane class="tab_item" label="热门机场">
					<p>热门机场</p>
					<AirportsList :cAirportsList="airportList"></AirportsList>
				</el-tab-pane>
				<el-tab-pane label="按省份查询">按省份查询</el-tab-pane>
				<el-tab-pane label="按名称查询">按名称查询</el-tab-pane>
				<el-tab-pane label="查找附近">查找附近</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
// 引用组件
import AirportsList from "../../components/airports/AirportsList"

export default {
	name: "Airports",
	data() {
		return {
			airportList: [],
		}
	},
	methods: {
		async _getAirportsList() {
			const { data: result } = await this.$http.get("/api/airports")
			if (result.meta.status == 1) {
				this.airportList = result.data
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
	},
	created() {
		this._getAirportsList()
	},
	components: {
		AirportsList,
	},
}
</script>

<style lang="less" scoped>

</style>