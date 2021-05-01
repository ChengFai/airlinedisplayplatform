<template>
	<div>
		<div id="heatmap-container"></div>
		<div id="chart-container"></div>
	</div>
</template>

<script>
import { loadModules } from "esri-loader"

import JsonToLayer from "../../utils/JsonToLayer"

export default {
	name: "HeatMapContainer",
	data() {
		return {
			view: {},
			features: [],
		}
	},
	methods: {
		_loadMap() {
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
					view.on("click", (e) => {
						console.log(e.mapPoint)
					})
				}
			)
		},
		_updateHeatMap() {
			if (this.cfeatures == []) {
				return false
			}
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
				this.$emit("heatmapLoaded")
			})
		},
	},
	mounted() {
		this._loadMap()
		console.log()
		if (this.cfeatures !== []) {
			this.features = JsonToLayer.jsonToFeatureSet(this.cfeatures)
			this._updateHeatMap()
		}
	},
	watch: {
		cfeatures(val) {
			this.features = JsonToLayer.jsonToFeatureSet(val)
			this._updateHeatMap()
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
#heatmap-container {
	height: 100%;
	width: 100%;
}
</style>