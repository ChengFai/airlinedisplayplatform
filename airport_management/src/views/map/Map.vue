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
              @resetQueryId="resetQueryId"
						></query-airlines-list>
					</el-tab-pane>
				</el-tabs>
			</el-aside>
			<el-main>
				<div id="cesium-container"></div>
				<div id="fixed-box" @click="fixedBoxClicked">
					<span>热</span>
					<span>力</span>
					<span>图</span>
				</div>
				<el-drawer title="热力图" :visible.sync="drawer">
					<heat-map-container
						class="heatmap-container"
						:cfeatures="features"
					></heat-map-container>
				</el-drawer>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import AirlinesList from "../../components/map/AirlinesList"
import QueryAirlinesList from "../../components/map/QueryAirlinesList"
import HeatMapContainer from "../../components/map/HeatMapContainer"

import ShowTrail from "../../utils/showPolylineTrail"
import TimeTool from "../../utils/TimeTool"

import outlineFile from "../../assets/country.json"

export default {
	name: "Map",
	data() {
		return {
			data_geo: {}, // 格式化后的机场列表
			renderAirlinesList: [], // 渲染航班列表
      nowWeekday: -1, // 当前星期
			nowTime: "", // 当前时间，例：“09:09”
			total: 0, // 数据总量
			page: 1, // 当前页数
			viewer: {},
			queryId: "", // 记录地图中id查询得上一个id，用于回归样式
			features: [],
			drawer: false, // 抽屉显示与否
			fixedboxValiable: false,
		}
	},
	methods: {
    // 获取全部机场列表
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
    /*
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
    */
		// 获取实时航班
    async _getAirlinesByTime() {
			const { data: result } = await this.$http.get(
				"/api/airlines/findbytime",
				{
					params: {
            weekday: this.nowWeekday,
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
    // queryId归零
    resetQueryId() {
      this.queryId = ""
    },
    // 翻页
		handleCurrentChange(page) {
			this.page = page
			this._getAirlinesByTime().then(() => {
				ShowTrail.generateMigrationMap(
					this.viewer,
					this.renderAirlinesList,
					this.data_geo
				)
				this.queryId = ""
			})
		},
    // 航线查询
		getQueryList(list) {
			let { airlinesList, byFrom } = list
			byFrom = byFrom ? 1 : 2
			const arr = ShowTrail.generateMigrationMap(
				this.viewer,
				airlinesList,
				this.data_geo,
				byFrom
			)
			this.features = arr
			this.fixedboxValiable = true
		},
    // 切换回实时航班
		switchBtnClick(tab) {
      this.queryId = ""
			if (tab.label == "航班实时") {
				ShowTrail.generateMigrationMap(
					this.viewer,
					this.renderAirlinesList,
					this.data_geo
				)
			}
		},
    // 点击高亮
		cardClick(id) {
			this.queryId = ShowTrail.changeStyle(this.viewer, this.queryId, id) // 记录查询id
		},
    // 点击热力图
		fixedBoxClicked() {
			if (!this.fixedboxValiable) {
				this.$message({ type: "warning", message: "请先进行航线查询" })
			} else {
				this.drawer = true
			}
		},
	},
	created() {
    this.nowWeekday = TimeTool.getWeekday()
		this.nowTime = TimeTool.getTime()
		// 每隔5分钟更新一次时间
		setInterval(() => {
			this.nowTime = TimeTool.getTime()
      this._getAirlinesByTime()
		}, 300000)
	},
	async mounted() {
		await this._getAirports()
		await this._getAirlinesByTime()
		// 配置cesium的token
		Cesium.Ion.defaultAccessToken = ShowTrail.token
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
			sceneModePicker: false,
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
		HeatMapContainer,
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
	position: relative;
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

#fixed-box {
	position: absolute;
	height: 60px;
	width: 20px;
	right: 0;
	top: 20%;
	background-color: white;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 0.8rem;
	border: 3px solid #bfbfbf;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}

.heatmap-container {
	height: 45%;
	width: 100%;
}
</style>