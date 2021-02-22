<template>
	<div>
		<el-card>
			<!-- 标签列 -->
			<el-tabs tab-position="left">
				<el-tab-pane class="tab_item" label="热门机场">
					<p>热门机场</p>
					<airports-list :cAirportsList="hotAirportList"></airports-list>
				</el-tab-pane>
				<el-tab-pane label="按省份查询">
          <p>按省份查询</p>
          <map-container></map-container>
        </el-tab-pane>
				<el-tab-pane label="按名称查询">
					<p>按名称查询</p>
					<name-query-container></name-query-container>
				</el-tab-pane>
				<el-tab-pane label="查找附近">查找附近</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
// 引用组件
import AirportsList from "../../components/airports/AirportsList"
import MapContainer from "../../components/airports/MapContainer"
import NameQueryContainer from "../../components/airports/NameQueryContainer"

export default {
	name: "Airports",
	data() {
		return {
			hotAirportList: [],
		}
	},
	methods: {
		async _getHotAirportsList() {
			const { data: result } = await this.$http.get("/api/airports/hot")
			if (result.meta.status == 1) {
				this.hotAirportList = result.data
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
	},
	created() {
		this._getHotAirportsList()
	},
	components: {
		AirportsList,
		MapContainer,
		NameQueryContainer
	},
}
</script>

<style lang="less" scoped>
</style>