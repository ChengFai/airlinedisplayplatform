<template>
	<div>
		<div id="viewDiv" v-loading="loading"></div>
		<el-table :data="info" border stripe v-if="showTable">
			<el-table-column type="index" label="#"></el-table-column>
			<el-table-column prop="name" label="机场名">
				<template slot-scope="scope">
					<div :id="scope.row.name">{{ scope.row.name }}</div>
				</template>
			</el-table-column>
		</el-table>
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
			regionName: "",
			loading: true,
		}
	},
	methods: {
		jumpClick() {
			console.log(123)
		},
	},
	computed: {
		showTable() {
			return this.info.length !== 0
		},
	},
	mounted() {
		const jumpClick = (name) => {
      console.log(123);
    }
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
				"dojo/dom",
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
					dom,
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
								return { name: item.attributes.name }
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
						//console.log(query.geometry);
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
}
</script>

<style lang="less" scoped>
#viewDiv {
	height: 400px;
	border: none !important;
}
.el-table {
	margin-top: 20px;
}
</style>