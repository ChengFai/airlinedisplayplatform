<template>
	<div>
		<el-row v-loading="loading">
			<div id="heatmap-container"></div>
		</el-row>
		<div id="chart-container"></div>
	</div>
</template>

<script>
import { loadModules } from "esri-loader"
import echarts from "echarts"

import JsonToLayer from "../../utils/JsonToLayer"

export default {
	name: "HeatMapContainer",
	data() {
		return {
			view: {},
			myChart: {},
			features: [],
			radasList: [],
			maxNum: 0,
			loading: false,
		}
	},
	methods: {
		// 初始化ArcGIS地图
		loadMap() {
			loadModules(["esri/views/MapView", "esri/Map"], { css: true }).then(
				([MapView, Map]) => {
					const map = new Map({
						basemap: "osm",
					})
					const view = new MapView({
						container: "heatmap-container",
						map: map,
						center: [106.75003910896959, 33.405550534701746],
						zoom: 3,
					})
					this.view = view // vue托管
				}
			)
		},
		// 数据改变更新热力图
		updateHeatMap() {
			if (this.cfeatures == []) {
				return false
			}
			this.loading = true
			loadModules(
				[
					"esri/layers/FeatureLayer",
					"esri/smartMapping/renderers/heatmap",
					"esri/Color",
				],
				{ css: true }
			).then(async ([FeatureLayer, heatmapRendererCreator, Color]) => {
				this.view.map.layers.removeAll()
				let featureLayer = new FeatureLayer({
					id: "heatmaplayer",
					source: this.features,
					labelsVisible: false,
					objectIdField: "ObjectID",
					outFields: ["ObjectID"],
				})
				let heatmapParams = {
					type: "heatmap",
					layer: featureLayer,
					view: this.view,
					blurRadius: 4,
					heatmapScheme: {
						colors: [
							new Color("rgba(0, 255, 150, 0)"),
							new Color("rgb(250, 250, 0)"),
							new Color("rgb(250, 150, 0)"),
							new Color("rgb(255, 50, 0)"),
						],
					},
				}
				const res = await heatmapRendererCreator.createRenderer(heatmapParams)
				featureLayer.renderer = res.renderer
				this.view.map.layers.add(featureLayer)
				this.loading = false
				this.$emit("heatmapLoaded")
			})
		},
		// 生成雷达图
		drawChart() {
			const option = {
				title: {
					text: "高通勤频率机场",
				},
				legend: {
					data: ["通勤频率"],
					top: "6%",
					right: "5%",
				},
				tooltip: {
					trigger: "item",
				},
				radar: {
					// shape: 'circle',
					radius: "50%",
					indicator: this.radasList.map((item) => {
						return {
							name: item.name,
							max: this.maxNum,
						}
					}),
				},
				series: [
					{
						name: "预算 vs 开销（Budget vs spending）",
						type: "radar",
						data: [
							{
								value: this.radasList.map((item) => item.num),
								name: "通勤频率",
							},
						],
					},
				],
			}
			this.myChart.setOption(option)
		},
		// 统计数据
		_statistic(arr) {
			// 统计对象 {"机场名": 个数}
			let radasObj = {}
			// 统计数组 ["机场名", ...]
			let radasArr = []
			// 最大值 初始为0
			let maxNum = 0
			// 对象化
			arr.forEach((item) => {
				let { name } = item
				if (radasObj[name]) {
					radasObj[name]++
					if (radasObj[name] > maxNum) maxNum = radasObj[name]
				} else {
					radasObj[name] = 1
					if (radasObj[name] > maxNum) maxNum = radasObj[name]
				}
			})
			// 数组去重
			for (let item of arr) {
				radasArr.push(item.name)
			}
			const radasSet = new Set(radasArr)
			radasArr = Array.from(radasSet)
			// 数组添加num属性
			radasArr = radasArr.map((item) => {
				return {
					name: item,
					num: radasObj[item],
				}
			})
			// 数组按num排序+取前6个
			radasArr = radasArr
				.sort((obj1, obj2) => {
					let { num: num1 } = obj1
					let { num: num2 } = obj2
					if (num1 < num2) return 1
					else if (num1 > num2) return -1
					else return 0
				})
				.slice(0, 6)
			this.radasList = radasArr
			this.maxNum = maxNum
		},
	},
	mounted() {
		const myChart = echarts.init(document.getElementById("chart-container"))
		this.myChart = myChart
		this.loadMap()
		if (this.cfeatures.length !== 0) {
			this.features = JsonToLayer.jsonToFeatureSet(this.cfeatures)
			this.updateHeatMap()
		}
		this._statistic(this.cfeatures)
		this.drawChart()
	},
	watch: {
		cfeatures(val) {
			this.features = JsonToLayer.jsonToFeatureSet(val)
			this.updateHeatMap()
			this._statistic(this.cfeatures)
			this.drawChart()
		},
	},
	props: {
		cfeatures: {
			type: Array,
			default: [],
			required: true,
		},
	},
}
</script>

<style lang="less" scoped>
.el-row {
	height: 100%;
	width: 100%;
}
#heatmap-container {
	height: 100%;
	width: 100%;
}
#chart-container {
	margin-top: 30px;
	height: 300px;
	width: 100%;
}
</style>