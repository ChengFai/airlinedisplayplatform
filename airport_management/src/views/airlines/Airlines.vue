<template>
	<div>
		<el-card>
			<!-- 查询容器 -->
			<el-container class="query_container">
				<el-header>航班时刻查询</el-header>
				<el-main>
					<div class="line_query_box">
						<span>航线查询</span>
						<!-- <el-input
							size="small"
							placeholder="中文/拼音"
							v-model="query.queryInfo.from"
							clearable
						>
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
						</el-input> -->
						<el-select
							v-model="query.queryInfo.from"
							filterable
							placeholder="城市名称"
							size="small"
						>
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
							<el-option
								v-for="item in cityList"
								:key="item"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
						<b style="cursor: pointer" @click="inputChange">换</b>
						<!-- <el-input
							size="small"
							placeholder="中文/拼音"
							v-model="query.queryInfo.to"
							clearable
						>
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
						</el-input> -->
						<el-select
							v-model="query.queryInfo.to"
							filterable
							placeholder="城市名称"
							size="small"
						>
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
							<el-option
								v-for="item in cityList"
								:key="item"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
						<el-button type="primary" size="small" @click="queryBtnClick()"
							>查询</el-button
						>
					</div>
					<div class="numb_query_box">
						<span>航班号查询</span>
						<el-input
							size="small"
							placeholder="航班号"
							v-model="query.queryInfo.numb"
							clearable
						>
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
						</el-input>
						<el-button type="primary" size="small" @click="queryBtnClick()"
							>查询</el-button
						>
					</div>
					<div class="time_query_box">
						<span>日期查询</span>
						<el-date-picker
							size="small"
							v-model="dateObj"
							align="right"
							type="date"
							placeholder="选择日期"
							:picker-options="pickerOptions"
						>
						</el-date-picker>
						<el-button type="primary" size="small" @click="queryBtnClick()"
							>查询</el-button
						>
					</div>
				</el-main>
			</el-container>
			<!-- 展示容器 -->
			<el-container class="table_container">
				<el-header>航班时刻表</el-header>
				<el-main>
					<airlines-list
						:cList="airlinesList"
						:cIsInit="isInit"
						v-loading="isLoading"
					></airlines-list>
					<el-pagination
						@current-change="handleCurrentChange"
						:current-page="query.queryPage"
						:page-size="query.querySize"
						layout="total, prev, pager, next"
						:total="total"
						background
					>
					</el-pagination>
				</el-main>
			</el-container>
		</el-card>
	</div>
</template>

<script>
import AirlinesList from "../../components/airlines/AirlinesList"
import GetWeek from "../../utils/GetWeek"

export default {
	name: "Airlines",
	data() {
		return {
			pickerOptions: {
				// 日期选择器日期设置
				shortcuts: [
					{
						text: "今天",
						onClick(picker) {
							picker.$emit("pick", new Date())
						},
					},
					{
						text: "明天",
						onClick(picker) {
							const date = new Date()
							date.setTime(date.getTime() + 3600 * 1000 * 24)
							picker.$emit("pick", date)
						},
					},
				],
			},
			dateObj: "", // 绑定日期对象
			isLoading: false,
			query: {
				queryInfo: {
					to: "",
					from: "",
					numb: "",
					weekday: "",
				},
				querySize: 10,
				queryPage: 1,
			},
			airlinesList: [],
			total: 0,
			isInit: true, // 当前想要初始化AirlinesList组件（处理初始化显示loading问题）
			cityList: [], // 存放城市的数组
		}
	},
	methods: {
		async _getAirlinesList() {
			// 获取航班列表
			const { data: result } = await this.$http.post(
				"api/airlines/findbyquery",
				this.query
			)
			if (result.meta.status == 1) {
				this.total = result.data.total
				this.airlinesList = result.data.result
				this.isInit = false // 获取到数据后更新AirlinesList组件，关闭初始化模式
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
			this.isLoading = false
		},
		async _getCityList() {
			// 获取城市列表
			const { data: result } = await this.$http.get("api/airlines/findcitys")
			if (result.meta.status == 1) {
				this.cityList = result.data.result
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
		queryBtnClick() {
			this.isLoading = true
			this._getAirlinesList()
		},
		queryBtnClick1() {},
		handleCurrentChange(newPage) {
			this.query.queryPage = newPage
			this._getAirlinesList()
		},
		inputChange() {
			const i = this.query.queryInfo.to
			this.query.queryInfo.to = this.query.queryInfo.from
			this.query.queryInfo.from = i
		},
	},
	created() {
		this._getCityList()
	},
	components: {
		AirlinesList,
	},
	watch: {
		dateObj(val, oldVal) {
			if (val) {
				const str = val.toString().slice(0, 3)
				this.query.queryInfo.weekday = GetWeek.getWeekNumb(str)
			} else {
        this.query.queryInfo.weekday = ""
      }
		},
	},
}
</script>

<style lang="less" scoped>
.el-header {
	height: 35px !important;
	line-height: 35px;
}

.query_container {
	margin-bottom: 30px;
	.el-header {
		background-color: @homeBlue;
		color: white;
	}
	.el-main {
		border: 1px solid #ccc;
		height: 150px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		span {
			font-weight: 700;
			margin-right: 5px;
		}
		.line_query_box {
			.el-select,
			.el-input {
				width: 150px !important;
				margin: 0 5px;
			}
			.el-button {
				margin-left: 5px;
			}
		}
		.numb_query_box {
			.el-input {
				width: 250px !important;
				margin: 0 5px;
			}
			.el-button {
				margin-left: 5px;
			}
		}
		.time_query_box {
			.el-date-picker {
				width: 250px !important;
				margin: 0 5px;
			}
			.el-button {
				margin-left: 5px;
			}
		}
	}
}
.table_container {
	.el-header {
		border-top: 2px solid @homeBlue;
		border-left: 1px solid #ccc;
		border-right: 1px solid #ccc;
	}
	.el-main {
		border-left: 1px solid #ccc;
		border-right: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		display: flex;
		flex-direction: column;
		.el-pagination {
			margin-top: 20px;
			margin-left: auto;
		}
	}
}
</style>