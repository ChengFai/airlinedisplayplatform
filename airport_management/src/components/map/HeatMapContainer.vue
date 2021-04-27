<template>
	<div>
		<div id="heatmap-container"></div>
	</div>
</template>

<script>
import { loadModules } from "esri-loader"

export default {
	name: "HeatMapContainer",
	data() {
		return {
			view: {},
		}
	},
	methods: {
		_loadMap() {
			loadModules(["esri/views/MapView", "esri/WebMap"], { css: true }).then(
				([MapView, WebMap]) => {
					const webmap = new WebMap({
						basemap: "osm",
					})
					const view = new MapView({
						map: webmap,
						container: "heatmap-container",
					})
					this.view = view // vue托管
				}
			)
		},
		_updateHeatMap() {
			loadModules(
				[
					"esri/layers/FeatureLayer",
					"esri/smartMapping/renderers/heatmap",
					"esri/Color",
				],
				{ css: true }
			).then(([FeatureLayer, heatmapRendererCreator, Color]) => {
				this.view.map.layers.removeAll()
				let featureLayer = new FeatureLayer({
					id: "heatmaplayer",
					source: this.cfeatures,
					labelsVisible: false,
					objectIdField: "ObjectID",
          outFields: ["ObjectID"]
				})
				let heatmapParams = {
					type: "heatmap",
					layer: featureLayer,
					view: this.view,
					blurRadius: 3,
					heatmapScheme: {
						colors: [
							new Color("rgba(0, 255, 150, 0)"),
							new Color("rgb(250, 250, 0)"),
							new Color("rgb(250, 150, 0)"),
							new Color("rgb(255, 50, 0)"),
						],
					},
				}
				heatmapRendererCreator.createRenderer(heatmapParams).then((res) => {
					featureLayer.renderer = res.renderer
          console.log(this.view);
					this.view.map.layers.add(featureLayer)
				})
			})
		},
	},
	mounted() {
		this._loadMap()
	},
	watch: {
		cfeatures() {
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