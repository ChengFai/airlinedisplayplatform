<template>
	<div>
		<el-card>
			<el-steps :active="step" finish-status="success" align-center>
				<el-step title="步骤1" description="基础查询条件"> </el-step>
				<el-step title="步骤2" description="选择性查询条件"></el-step>
				<el-step title="步骤3" description="查看结果"></el-step>
			</el-steps>
			<!-- 第一步 -->
			<div class="form-container" v-if="step == 0">
				<el-form
					:model="queryBasic"
					:rules="basicFormRules"
					label-width="100px"
					ref="basicForm"
					class="basic-form"
				>
					<el-form-item label="当前所在地" prop="from">
						<el-input
							v-model="queryBasic.from"
							@blur="fromInputChanged(queryBasic.from)"
						></el-input>
					</el-form-item>
					<el-form-item label="目的地" prop="to">
						<el-input
							v-model="queryBasic.to"
							clearable
							@blur="toInputChanged(queryBasic.to)"
						></el-input>
					</el-form-item>
					<el-form-item label="日期与时间" prop="date">
						<el-col :span="11">
							<el-form-item prop="date">
								<el-date-picker
									type="date"
									placeholder="选择日期"
									v-model="queryBasic.date"
									style="width: 100%"
								></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col class="line" :span="2">-</el-col>
						<el-col :span="11">
							<el-form-item prop="time">
								<el-select
									placeholder="选择时间"
									v-model="queryBasic.time"
									style="width: 100%"
								>
									<el-option label="上午" value="beforenoon"></el-option>
									<el-option label="下午" value="afternoon"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-form-item>
				</el-form>
			</div>
			<!-- 第二步 -->
			<div class="select-container" v-else-if="step == 1">
				<div>
					<div class="title">请选择对于地面路线的侧重</div>
					<div class="select-box">
						<template v-for="(item, index) in array1">
							<div
								:key="index"
								@click="doActive(index, 1)"
								:class="{
									actived: index === current1,
									balanceBtn: index === 1,
								}"
							>
								{{ item }}
							</div>
						</template>
					</div>
					<div class="title">请选择对于航班的侧重</div>
					<div class="select-box">
						<template v-for="(item, index) in array2">
							<div
								:key="index"
								@click="doActive(index, 2)"
								:class="{ actived: index === current2 }"
							>
								{{ item }}
							</div>
						</template>
					</div>
				</div>
			</div>
			<!-- 第三步 -->
			<div class="result-container" v-else>
				<div class="baseInfo-box">
					<el-tag>出发地点：{{ queryBasic.from }}</el-tag>
					<el-tag>目的地：{{ queryBasic.to }}</el-tag>
					<el-tag>日期：{{ date }}</el-tag>
					<el-tag>出发时间：{{ time }}</el-tag>
					<el-tag type="success">地面路线的侧重：{{ array1[current1] }}</el-tag>
					<el-tag type="success">航班的侧重：{{ array2[current2] }}</el-tag>
				</div>
				<!-- <div class="result-list">
					<el-card>123</el-card>
					<el-card>123</el-card>
					<el-card>123</el-card>
					<el-card>123</el-card>
					<el-card>123</el-card>
					<el-card>123</el-card>
				</div> -->
				<recommend-list
					class="recommend-list"
					:cList="resultList"
				></recommend-list>
			</div>
			<el-button @click="previous">上一步</el-button>
			<el-button @click="next">
				{{
					step == 0
						? "下一步"
						: step == 1
						? "完成"
						: step == 2
						? "确定"
						: "返回"
				}}
			</el-button>
		</el-card>
	</div>
</template>

<script>
import BaiduMapTools from "../../utils/BaiduMapTools"
import TimeTool from "../../utils/TimeTool"
import RecommendList from "../../components/smartrecommend/RecommendList"

export default {
	name: "SmartRecommend",
	data() {
		return {
			step: 0,
			queryBasic: {
				from: "",
				to: "",
				date: "",
				time: "beforenoon",
			},
			basicFormRules: {
				from: [{ required: true, message: "请输入当前位置", trigger: "blur" }],
				to: [{ required: true, message: "请输入目的地", trigger: "blur" }],
				date: [{ required: true, message: "请选择日期", trigger: "blur" }],
			},
			array1: ["低廉", "均衡", "快速"],
			array2: ["准时", "低廉", "快速"],
			current1: -1,
			current2: -1,
			fromPoint: {},
			fromAirportList: [],
			toPoint: {},
			toAirportList: [],
			airportList: [],
			resultList: [],
		}
	},
	methods: {
		// 点击下一步
		next() {
			switch (this.step) {
				case 0: // 点击下一步
					this.submitBasicForm()
					break
				case 1: // 点击完成
					this.submitSelectForm()
					this.getResult().then((data) => {
						switch (this.current2) {
							case 0: // 准时
								this.resultList = data.sort((obj1, obj2) => {
									let { ontimeRate: ontimeRate1 } = obj1
									let { ontimeRate: ontimeRate2 } = obj2
									if (ontimeRate1 > ontimeRate2) return -1
									else if (ontimeRate1 < ontimeRate2) return 1
									else return 0
								})
								break
							case 1: // 低廉
								this.resultList = data.sort((obj1, obj2) => {
									let price1 = obj1.price == "--" ? 10000 : parseInt(obj1.price)
									let price2 = obj2.price == "--" ? 10000 : parseInt(obj2.price)
									if (price1 > price2) return 1
									else if (price1 < price2) return -1
									else return 0
								})
								break
							case 2: // 快速
								this.resultList = data.sort((obj1, obj2) => {
									let { startTime: startTime1, endTime: endTime1 } = obj1
									let { startTime: startTime2, endTime: endTime2 } = obj2
									let duration1 =
										TimeTool.timeToNumb(endTime1) -
										TimeTool.timeToNumb(startTime1)
									let duration2 =
										TimeTool.timeToNumb(endTime2) -
										TimeTool.timeToNumb(startTime2)
									if (duration1 > duration2) return -1
									else if (duration1 < duration2) return 1
									else return 0
								})
								break
						}
					})
					break
				case 2: // 点击确定
					this.stepControl()
					break
				case 3: // 点击返回
					this.stepControl()
					break
				default:
					this.$message({ type: "error", message: "发生错误" })
			}
		},
		// 点击上一步
		previous() {
			if (--this.step < 0) this.step = 0
		},
		// 验证基础表单
		submitBasicForm() {
			this.$refs.basicForm.validate(async (valid) => {
				if (valid) {
					this.fromAirportList = await BaiduMapTools.getNearestAirports(
						this.fromPoint
					)
					this.toAirportList = await BaiduMapTools.getNearestAirports(
						this.toPoint
					)
					return this.stepControl()
				} else {
					this.$message({ type: "error", message: "请按要求填写表单" })
					return false
				}
			})
		},
		// 验证选择性表单
		submitSelectForm() {
			if (this.current1 < 0 || this.current2 < 0)
				return this.$message({ type: "error", message: "请选择侧重" })
			if (this.fromAirportList.length == 0 || this.toAirportList.length == 0)
				return this.$message({
					type: "warning",
					message: "网络不佳，请稍后再试",
				})
			this.stepControl()
		},
		// 获取结果
		async getResult() {
			const fromList = await BaiduMapTools.getRouteInfo(this.fromAirportList)
			const toList = await BaiduMapTools.getRouteInfo(this.toAirportList)
			this.airportList = BaiduMapTools.chooseRoute(
				fromList,
				toList,
				this.current1
			)
			const date = TimeTool.getWeekNumb(
				this.queryBasic.date.toString().substr(0, 3)
			)
			const { data: result } = await this.$http.get(
				"api/airlines/findbyrecommend",
				{
					params: {
						from: this.airportList[0],
						to: this.airportList[1],
						date: date,
						time: this.queryBasic.time,
					},
				}
			)
			if (result.meta.status == 1) {
				return result.data
			} else {
				return this.$message({ type: "error", message: result.meta.msg })
			}
		},
		// 控制step增量
		stepControl() {
			if (++this.step > 3) {
				this.step = 0
			} else if (this.step == 3) {
				this.step = 3
			}
		},
		// 获取当前位置
		async _getLoacation() {
			const { data: result } = await BaiduMapTools.getLoacation()
			this.fromPoint = result.content.point
			this.queryBasic.from = result.content.address
		},
		// 目的地输入框失去焦点时触发
		toInputChanged(input) {
			if (input == "") return
			BaiduMapTools.locationSearch(input).then((data) => {
				if (data) {
					this.queryBasic.to = data.name
					this.toPoint = {
						x: data.x + "",
						y: data.y + "",
					}
				} else {
					this.$message({ type: "error", message: "目的地查询错误" })
				}
			})
		},
		// 出发地输入框失去焦点时触发
		fromInputChanged(input) {
			if (input == "") return
			BaiduMapTools.locationSearch(input).then((data) => {
				if (data) {
					this.queryBasic.from = data.name
					this.fromPoint = {
						x: data.x + "",
						y: data.y + "",
					}
				} else {
					this.$message({ type: "error", message: "所在地查询错误" })
				}
			})
		},
		// 点击选择项切换
		doActive(index, num) {
			if (num == 1) this.current1 = index
			else if (num == 2) this.current2 = index
		},
	},
	created() {
		this._getLoacation()
	},
	computed: {
		date() {
			const dateArr = this.queryBasic.date.toString().split(" ")
			return `${TimeTool.getMonthNumb(dateArr[1])}月${
				dateArr[2]
			}日 星期${TimeTool.getWeekCharacter(dateArr[0])}`
		},
		time() {
			if (this.queryBasic.time == "afternoon") return "下午"
			else if (this.queryBasic.time == "beforenoon") return "上午"
		},
	},
	components: {
		RecommendList,
	},
}
</script>

<style lang="less" scoped>
.result-container {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	align-items: center;
	margin: 30px 0;

	.baseInfo-box {
		width: 80%;
		border: 2px solid @homeGray;
		border-radius: 20px;
		padding: 10px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
	}

	.recommend-list {
		width: 80%;
	}

	.el-tag {
		margin: 0 10px;
	}
}

.form-container {
	margin-top: 30px;
	display: flex;
	justify-content: center;
}

.select-container {
	display: flex;
	justify-content: center;

	& .title {
		margin-top: 30px;
	}

	& > div {
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.select-box {
			display: flex;
			margin: 20px 0;
			& > div {
				padding: 10px 40px;
				cursor: pointer;
				font-size: 0.7rem;
				&:hover {
					color: @homeBlue;
					transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
				}
				&.actived {
					color: @homeWhite;
					background-color: @homeBlue;
				}
				&:nth-child(1) {
					border: 2px solid @homeGray;
					border-top-left-radius: 10px;
					border-bottom-left-radius: 10px;
				}
				&:nth-child(2) {
					border-width: 2px 0;
					border-color: @homeGray;
					border-style: solid;
				}
				&:nth-child(3) {
					border: 2px solid @homeGray;
					border-top-right-radius: 10px;
					border-bottom-right-radius: 10px;
				}
			}
		}
	}
}

.balanceBtn {
	border-width: 2px 0;
	border-color: @homeGray;
	border-style: solid;
	&:hover {
		color: @homeGreen !important;
	}
	&.actived {
		color: @homeWhite;
		background-color: @homeGreen !important;
		&:hover {
			color: @homeWhite !important;
		}
	}
}

.basic-form {
	width: 40%;
}

.el-button {
	position: relative;
	left: 80%;
}

.line {
	text-align: center;
}
</style>