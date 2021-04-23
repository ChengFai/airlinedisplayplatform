<template>
	<div>
		<el-container>
			<el-aside>
				<el-tabs type="border-card" @tab-click="switchBtnClick">
					<el-backtop
						target=".el-tabs"
						style="left: 250px; bottom: 20px"
					></el-backtop>
					<el-tab-pane label="航班实时">
						<el-pagination
							background
							small
							@current-change="handleCurrentChange"
							:page-size="200"
							layout="pager"
							:total="this.total"
						>
						</el-pagination>
						<airlines-list
							:c-list="renderAirlinesList"
							:c-time="nowTime"
							@cardclick="cardClick"
						></airlines-list>
					</el-tab-pane>
					<el-tab-pane label="航线查询">
						<query-airlines-list
							@getQueryList="getQueryList"
							@cardclick="cardClick"
						></query-airlines-list>
					</el-tab-pane>
				</el-tabs>
			</el-aside>
			<el-main>
				<div id="cesium-container"></div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import AirlinesList from "../../components/map/AirlinesList"
import QueryAirlinesList from "../../components/map/QueryAirlinesList"

import ShowTrail from "../../utils/showPolylineTrail"
import JsonToLayer from "../../utils/JsonToLayer"
import TimeTool from "../../utils/TimeTool"

import outlineFile from "../../assets/country.json"

export default {
	name: "Map",
	data() {
		return {
			data_geo: {}, // 格式化后的机场列表
			renderAirlinesList: [], // 渲染航班列表
			nowTime: "", // 当前时间，例：“09:09”
			total: 0, // 数据总量
			page: 1, // 当前页数
			viewer: {},
			queryId: "", // 记录地图中id查询得上一个id，用于回归样式
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
		async _getAirlinesByTime() {
			const { data: result } = await this.$http.get(
				"/api/airlines/findbytime",
				{
					params: {
						time: this.nowTime,
						page: this.page,
					},
				}
			)
			if (result.meta.status == 1) {
				this.renderAirlinesList = result.data.result
				this.total = result.data.total
			} else {
				this.$message({ type: "success", message: result.meta.msg })
			}
		},
		handleCurrentChange(page) {
			this.page = page
			this._getAirlinesByTime()
			ShowTrail.generateMigrationMap(
				this.viewer,
				this.renderAirlinesList,
				this.data_geo
			)
		},
		getQueryList(list) {
			const arr = ShowTrail.generateMigrationMap(this.viewer, list, this.data_geo)
      console.log(JsonToLayer.jsonToFeatureSet(arr)); 
		},
		switchBtnClick(tab, e) {
			if (tab.label == "航班实时") {
				ShowTrail.generateMigrationMap(
					this.viewer,
					this.renderAirlinesList,
					this.data_geo
				)
			}
		},
		cardClick(id) {
			ShowTrail.changeStyle(this.viewer, this.queryId, id)
      this.queryId = id // 记录查询id
		},
	},
	created() {
		this.nowTime = TimeTool.getTime()
		// 每隔5分钟更新一次时间
		setInterval(() => {
			this.nowTime = TimeTool.getTime()
			console.log(this.nowTime)
		}, 300000)
	},
	async mounted() {
		await this._getAirports()
		await this._getAirlinesByTime()
		const viewer = new Cesium.Viewer("cesium-container", {
			geocoder: false,
			baseLayerPicker: false,
			navigationHelpButton: false,
			animation: false,
			creaditContainer: false,
			timeline: false,
			fullscreenButton: false,
			vrButton: false,
			selectionIndicator: false,
			infoBox: false,
		})
		this.viewer = viewer
		viewer._cesiumWidget._creditContainer.style.display = "none"
		viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
			function (e) {
				e.cancel = true
				//你要飞的位置
				viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(
						114.703893,
						38.287385,
						10000000.0
					),
				})
			}
		)

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

		// 加载国界线
		const countryOutline = viewer.dataSources.add(
			Cesium.GeoJsonDataSource.load(outlineFile, {
				stroke: Cesium.Color.fromCssColorString("#0186f6"),
				fill: Cesium.Color.TRANSPARENT,
			})
		)

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
	components: {
		AirlinesList,
		QueryAirlinesList,
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

.el-aside {
	overflow: hidden;
}

.el-tabs {
	overflow: hidden;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
		height: 5px;
	}
	&::-webkit-scrollbar-track {
		background: rgb(239, 239, 239);
		border-radius: 0;
	}
	&::-webkit-scrollbar-thumb {
		background: #bfbfbf;
		border-radius: 0;
	}
	&::-webkit-scrollbar-thumb:hover {
		background: rgb(150, 150, 150);
	}
}
.el-pagination {
	margin-bottom: 10px;
}
#cesium-container {
	height: 100%;
}
.el-tabs {
	height: 100%;
}
</style>