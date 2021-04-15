<template>
	<div>
		<el-container>
			<el-aside>
				<el-tabs type="border-card">
					<el-tab-pane label="航班实时"> 实时组件 </el-tab-pane>
					<el-tab-pane label="航线查询"> 航班查询组件 </el-tab-pane>
				</el-tabs>
			</el-aside>
			<el-main>
				<div id="cesium-container"></div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import ShowTrail from "../../utils/showPolylineTrail"
import TimeTool from "../../utils/TimeTool"

export default {
	name: "Map",
	data() {
		return {
			data_geo: {}, // 格式化后的机场列表
			renderAirlinesList: [], // 渲染航班列表
		}
	},
	methods: {
		async _getAirports() {
			const { data: result } = await this.$http.get("/api/airports/all")
			if (result.meta.status == 1) {
				let list = {}
				result.data.forEach((item) => {
					list[item.name] = [item.coord.x, item.coord.y]
				})
				this.data_geo = list
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
		async _getAirlines() {
			const { data: result } = await this.$http.post(
				"/api/airlines/findbyfrom",
				{
					from: "石家庄",
				}
			)
			if (result.meta.status == 1) {
				this.renderAirlinesList = result.data
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
	},
	created() {},
	async mounted() {
		await this._getAirports()
		await this._getAirlines()
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

		viewer.camera.setView({
			destination: Cesium.Cartesian3.fromDegrees(
				114.703893,
				38.287385,
				10000000.0
			), // 设置位置

			orientation: {
				heading: Cesium.Math.toRadians(0), // 方向
				pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
				roll: 0,
			},
		})

		function PolylineTrailLinkMaterialProperty(color, duration) {
			this._definitionChanged = new Cesium.Event()
			this._color = undefined
			this._colorSubscription = undefined
			this.color = color
			this.duration = duration || 3000
			this._time = new Date().getTime()
			this.isTranslucent = function () {
				return true
			}
		}

		Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
			isConstant: {
				get: function () {
					return false
				},
			},
			definitionChanged: {
				get: function () {
					return this._definitionChanged
				},
			},
			color: Cesium.createPropertyDescriptor("color"),
		})
		PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
			return "PolylineTrailLink"
		}
		PolylineTrailLinkMaterialProperty.prototype.getValue = function (
			time,
			result
		) {
			if (!Cesium.defined(result)) {
				result = {}
			}
			result.color = Cesium.Property.getValueOrClonedDefault(
				this._color,
				time,
				Cesium.Color.WHITE,
				result.color
			)
			result.image = Cesium.Material.PolylineTrailLinkImage
			result.time =
				((new Date().getTime() - this._time) % this.duration) / this.duration
			return result
		}
		PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
			return (
				this === other ||
				(other instanceof PolylineTrailLinkMaterialProperty &&
					Cesium.Property.equals(this._color, other._color))
			)
		}
		Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty
		Cesium.Material.PolylineTrailLinkType = "PolylineTrailLink"
		Cesium.Material.PolylineTrailLinkImage = require("../../assets/images/colors.png")
		Cesium.Material.PolylineTrailLinkSource =
			"czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
          czm_material material = czm_getDefaultMaterial(materialInput);\n\
          vec2 st = materialInput.st;\n\
          vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
          material.alpha = colorImage.a * color.a;\n\
          material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
          return material;\n\
        }"
		Cesium.Material._materialCache.addMaterial(
			Cesium.Material.PolylineTrailLinkType,
			{
				fabric: {
					type: Cesium.Material.PolylineTrailLinkType,
					uniforms: {
						color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
						image: Cesium.Material.PolylineTrailLinkImage,
						time: 20,
					},
					source: Cesium.Material.PolylineTrailLinkSource,
				},
				translucent: function (material) {
					return true
				},
			}
		)

		ShowTrail.generateMigrationMap(
			viewer,
			this.renderAirlinesList,
			this.data_geo
		)
	},
}
</script>

<style lang="less" scoped>
.el-container {
	height: 100%;
}
.el-main {
	padding: 0;
	height: 100%;
}
#cesium-container {
	height: 100%;
}
</style>