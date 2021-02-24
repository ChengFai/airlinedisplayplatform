<template>
	<div>
		<!-- 搜索框 -->
		<el-row style="margin: 10px 0">
			<el-col :span="8">
				<el-input placeholder="请输入搜索内容" v-model="searchInput">
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="getAirports(searchInput)"
					></el-button>
				</el-input>
			</el-col>
		</el-row>
		<!-- 百度地图容器 -->
		<div id="map"></div>
		<!-- 结果列表 -->
		<el-table :data="localList" style="width: 100%; margin-top: 20px" border>
			<el-table-column prop="title" label="名称"></el-table-column>
			<el-table-column prop="city" label="城市"></el-table-column>
			<el-table-column prop="address" label="地址"></el-table-column>
			<el-table-column label="详情页">
				<template slot-scope="scope">
					<a :href="scope.row.detailUrl">前往</a>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
// 引入百度地图api
import BMap from "BMap"

export default {
	name: "LocationContainer",
	data() {
		return {
			map: "",
			searchInput: "",
			localList: [],
		}
	},
	methods: {
		_createMap() {
			// 创建Map实例
			var map = new BMap.Map("map")
			this.map = map
      const _vue = this
			// 获取定位
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { longitude, latitude } = position.coords
						// 初始化地图,设置中心点坐标和地图级别
						const point = new BMap.Point(longitude, latitude)
						map.centerAndZoom(point, 11)
						const airportsLocal = new BMap.LocalSearch(map, {
							onSearchComplete(airports) {
								// 获取机场回调
								_vue.localList = airports.Br
							},
						})
						airportsLocal.searchNearby("机场", point)
					},
					(err) => {
						console.error(err)
					}
				)
			} else {
				map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
				alert("浏览器不支持地理定位。")
			}
			//开启鼠标滚轮缩放
			map.enableScrollWheelZoom(true)
			// 添加获取定位控件
			map.addControl(new BMap.GeolocationControl())
		},
		getAirports(searchText) {
			if (this.map == "")
				// 地图未加载
				return this.$message({
					type: "error",
					message: "地图加载失败，请刷新页面",
				})
			if (searchText == "")
				// 搜索输入框为空
				return this.$message({ type: "warning", message: "请输入内容" })
			// 检索
			const _map = this.map // 获取地图
			const _vue = this // 获取this
			// 检索输入内容
			const local = new BMap.LocalSearch(_map, {
				renderOptions: {
					map: _map,
					selectFirstResult: true, // 选择第一个结果
					autoViewport: true, // 自动调整视角
				},
				onSearchComplete(results) {
					// 查询回调函数
					if (local.getStatus() == BMAP_STATUS_SUCCESS) {
						// 判断状态是否正确
						const point = results.Br[0]
						// 搜索查询的第一个结果附近的机场
						const airportsLocal = new BMap.LocalSearch(_map, {
							onSearchComplete(airports) {
								// 获取机场回调
								_vue.localList = airports.Br
							},
						})
						airportsLocal.searchNearby("机场", point)
					}
				},
			})
			local.search(searchText)
		},
	},
	mounted() {
		this._createMap()
	},
}
</script>

<style lang="less" scoped>
#map {
	height: 520px;
}
</style>