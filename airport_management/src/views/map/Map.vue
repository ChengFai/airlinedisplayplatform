<template>
	<div>
		<div id="cesium-container"></div>
	</div>
</template>

<script>
export default {
	name: "Map",
	data() {
		return {}
	},
	methods: {},
	mounted() {
		const viewer = new Cesium.Viewer("cesium-container", {
			geocoder: false,
			baseLayerPicker: false,
			navigationHelpButton: false,
			animation: false,
			creaditContainer: false,
			timeline: false,
			fullscreenButton: false,
			vrButton: false,
		})
		viewer._cesiumWidget._creditContainer.style.display = "none"
    
	},
}
</script>

<style lang="less" scoped>
#cesium-container {
	height: 100%;
}
</style>