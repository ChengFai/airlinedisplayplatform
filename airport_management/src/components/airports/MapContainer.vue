<template>
	<div>
		<el-alert title='请使用右上角的"绘制点"按钮单机省份开始查询' type="info" :closable="false"></el-alert>
		<div id="viewDiv" v-loading="loading"></div>
		<el-table :data="info" border stripe v-if="showTable">
			<el-table-column type="index" label="#"></el-table-column>
			<el-table-column prop="name" label="机场名">
				<template slot-scope="scope">
					<div :id="scope.row.name">{{ scope.row.name }}</div>
				</template>
			</el-table-column>
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
		<!-- 地图对话框 -->
		<el-dialog
			:title="currentName"
			:visible.sync="mapDialogVisible"
			width="50%"
		>
			<div class="dialogmap_container">
				<div v-loading="dialogLoading" id="dialogViewDiv"></div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
// 引入arcgis api
import { loadModules } from "esri-loader"

export default {
	name: "MapContainer",
	data() {
		return {
			info: [],
			regionName: "", // 当前选择省份名
			loading: true, // 地图加载动画开启
			dialogLoading: true, // 对话框内部地图加载
			mapDialogVisible: false, // 显示机场位置地图对话框
			dialogView: "", // 对话框视图容器
			currentName: "", // 当前查看地图机场名
		}
	},
	methods: {
		mapBtnClick(point) {
			const { name, x, y } = point
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
							container: "dialogViewDiv",
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
		_loadMap() {
			// 地图服务地址
			const mapURL =
				"http://localhost:6080/arcgis/rest/services/graduatepro/airportsmap/MapServer"
			loadModules(
				[
					"esri/views/MapView",
					"esri/WebMap",
					"esri/layers/MapImageLayer",
					"esri/layers/GraphicsLayer",
					"esri/widgets/Sketch",
					"esri/tasks/QueryTask",
					"esri/tasks/support/Query",
					"esri/symbols/SimpleMarkerSymbol",
					"esri/symbols/SimpleFillSymbol",
					"esri/Color",
				],
				{ css: true }
			)
				.then(
					([
						MapView,
						WebMap,
						MapImageLayer,
						GraphicsLayer,
						Sketch,
						QueryTask,
						Query,
						SimpleMarkerSymbol,
						SimpleFillSymbol,
						Color,
					]) => {
						// 图形图层
						const graphicsLayer = new GraphicsLayer()
						// 底部动态图层
						const baseLayer = new MapImageLayer({
							url: mapURL,
							id: "initlayer",
						})
						// 省级区划要素图层

						// 地图容器
						const webmap = new WebMap({
							layers: [baseLayer, graphicsLayer],
						})
						// 视图容器
						const view = new MapView({
							map: webmap,
							container: "viewDiv",
						})

						this.loading = false // 关闭加载动画
						const sketch = new Sketch({
							layer: graphicsLayer,
							view: view,
							// 配置可被看见的图标
							visibleElements: {
								createTools: {
									point: true,
									polyline: false,
									polygon: false,
									rectangle: false,
									circle: false,
								},
								selectionTools: {
									"lasso-selection": false,
									"rectangle-selection": false,
								},
								undoRedoMenu: false,
							},
							creationMode: "update",
						})
						//向视图中添加绘图小部件
						view.ui.add(sketch, "top-right")
						//给视图小部件添加监听事件，监听它完成的时候
						sketch.on("create", async (event) => {
							// 绘制完成后执行queryTask
							if (event.state === "complete") {
								const { features: polygonResult } = await queryTask(
									"1",
									event.graphic.geometry
								)
								this.regionName = polygonResult[0].attributes.NAME
								showQueryResult(polygonResult)
								const pointResult = await queryTask(
									"0",
									polygonResult[0].geometry
								)
								showQueryResult(pointResult.features)
								const info = pointResult.features.map((item) => {
									return {
										name: item.attributes.name,
										x: item.attributes.x,
										y: item.attributes.y,
									}
								})
								this.info = info
							} else {
								// 其他情况清空图形图层
								graphicsLayer.removeAll()
							}
						})
						view.on("click", (event) => {
							view.hitTest(event).then(function (response) {
								if (response.results.length == 0) return // 没有结果则返回
								const { name } = response.results[0].graphic.attributes
								view.popup.open({
									title: name,
									content: `<a href="#${name}" class="jumpBtn">跳转至</a>`,
									location: event.mapPoint,
								})
							})
						})
						//空间查询函数
						function queryTask(numb, geometry) {
							var queryShp = `${mapURL}/${numb}` // 查询图层
							var qTask = new QueryTask({
								url: queryShp, //查询矢量
							})
							var query = new Query({
								returnGeometry: true,
								outFields: ["*"], //结果要素包含的属性字段
							})
							query.geometry = geometry
							//空间参考信息
							query.outSpatialReference = webmap.spatialReference
							//查询的标准，此处代表和geometry相交的图形都要返回
							query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS
							//执行空间查询
							return qTask.execute(query)
						}
						//执行查询
						function showQueryResult(queryResult) {
							graphicsLayer.removeAll()
							//创建面符号
							const mark = new SimpleMarkerSymbol(
								SimpleMarkerSymbol.STYLE_CIRCLE,
								new Color([255, 0, 0])
							)
							const fill = new SimpleFillSymbol(
								SimpleFillSymbol.STYLE_SOLID,
								new Color("rgba(0, 255, 0, 0.5)")
							)
							if (queryResult.length == 0) {
								console.log("查询结果为空！")
								return
							}
							if (queryResult.length >= 1) {
								for (let i = 0; i < queryResult.length; i++) {
									//得到graphic
									let graphic = queryResult[i]
									//给图形赋予符号
									if (graphic.geometry.type === "point") graphic.symbol = mark
									if (graphic.geometry.type === "polygon") graphic.symbol = fill
									//添加到地图从而实现高亮效果
									graphicsLayer.add(graphic)
								}
							}
						}
					}
				)
				.catch((err) => {
					// handle any errors
					console.error(err)
				})
		},
		goToDetail(name) {
			this.$router.push(`/detail/${name}`)
		},
	},
	computed: {
		// 是否显示表格（选择后显示）
		showTable() {
			return this.info.length !== 0
		},
	},
	mounted() {
		this._loadMap()
	},
}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 10px;
}
#viewDiv {
	height: 400px;
}
#dialogViewDiv {
	height: 400px;
	width: 100%;
}
.dialogmap_container {
	display: flex;
	justify-content: center;
	align-items: center;
}
.el-table {
	margin-top: 20px;
}
</style>