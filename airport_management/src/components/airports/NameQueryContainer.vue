<template>
	<div @keydown.enter="searchClick">
		<!-- 搜索框 -->
		<el-row class="input_row">
			<el-col :span="8">
				<el-input placeholder="请输入内容" v-model="temp">
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="searchClick"
					></el-button>
				</el-input>
			</el-col>
		</el-row>
		<!-- 结果表格 -->
		<div class="table_container">
			<div style="width: 95%">
				<el-table :data="airportList" border stripe v-loading="loading">
					<el-table-column prop="name" label="机场名"></el-table-column>
					<el-table-column label="操作" width="230">
						<template slot-scope="scope">
							<el-button
								style="margin-left: 25px"
								type="primary"
								icon="el-icon-discover"
								size="small"
								@click="mapBtnClick(scope.row)"
							>
								地图
							</el-button>
							<el-button
								type="warning"
								icon="el-icon-document"
								size="small"
								@click="goToDetail(scope.row.name)"
							>
								详情
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="query.queryPage"
					:page-sizes="[5, 10, 20, 40]"
					:page-size="query.querySize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>
			</div>
		</div>
		<!-- 地图对话框 -->
		<el-dialog
			:title="currentName"
			:visible.sync="mapDialogVisible"
			width="50%"
		>
			<div class="dialogmap_container">
				<div v-loading="dialogLoading" id="dialogViewDiv1"></div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { loadModules } from "esri-loader"

export default {
	name: "NameQueryContainer",
	data() {
		return {
			query: {
				// 查询参数
				queryInfo: "",
				queryPage: 1,
				querySize: 5,
			},
      temp: "", // 临时存放查询条件
			airportList: [],
			loading: false, // 表格加载
			total: 0, // 查询数据总量
			currentName: "", // 当前对话框机场名
			mapDialogVisible: false, // 显示机场位置地图对话框
			dialogView: "", // 对话框视图容器
			dialogLoading: true, // 对话框内部地图加载
		}
	},
	methods: {
    // 根据名称获取机场列表
		async _getAirportsList() {
			this.loading = true
			const { data: result } = await this.$http.post(
				"/api/airports",
				this.query
			)
			if (result.meta.status == 1) {
				this.airportList = result.data.result
				this.total = result.data.total
				this.loading = false
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
    // 每页个数改变
		handleSizeChange(newSize) {
			this.query.querySize = newSize
			this._getAirportsList()
		},
    // 页码改变
		handleCurrentChange(newPage) {
			this.query.queryPage = newPage
			this._getAirportsList()
		},
    // 点击查询按钮
		searchClick() {
			this.query.queryPage = 1 // 重置页码
      this.query.queryInfo = this.temp
			this._getAirportsList()
		},
    // 点击打开地图对话框
		mapBtnClick(point) {
			const { name } = point
			let { x, y } = point.coord
			x = parseFloat(x)
			y = parseFloat(y)
			this.currentName = name
			this.mapDialogVisible = true
			if (this.dialogView == "") {
				loadModules(["esri/views/MapView", "esri/Map"], { css: true }).then(
					([MapView, Map]) => {
						// 对话框地图容器
						const dialogMap = new Map({
							basemap: "osm",
						})
						// 对话框视图容器
						const dialogView = new MapView({
							container: "dialogViewDiv1",
							map: dialogMap,
							center: [x, y],
							zoom: 13,
						})
						this.dialogView = dialogView
					}
				)
			} else {
				this.dialogView.goTo({
					center: [x, y],
					zoom: 13,
				})
			}
			this.dialogLoading = false
		},
    // 转至详情页
		goToDetail(name) {
			this.$router.push(`/detail/${name}`)
		},
	},
	created() {
		this._getAirportsList()
	},
}
</script>

<style lang="less" scoped>
.input_row {
	margin-top: 30px;
	margin-left: 20px;
}
.table_container {
	margin-top: 30px;
	width: 100%;
	display: flex;
	justify-content: center;
}
.el-pagination {
	margin-top: 20px;
	margin-left: auto;
}
#dialogViewDiv1 {
	height: 400px;
	width: 100%;
}
</style>