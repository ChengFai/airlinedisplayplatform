<template>
	<div class="container" @keydown.enter="queryBtnClick">
		<div class="radio-container">
			<el-radio v-model="byCity" :label="true">城市查询</el-radio>
			<el-radio v-model="byCity" :label="false">机场查询</el-radio>
		</div>
		<div class="query-container">
			<el-input
				size="mini"
				:placeholder="inputPlacehold"
				v-model="query"
				class="input-with-select"
			>
				<el-select
					v-model="byFrom"
					slot="prepend"
					style="width: 65px"
					placeholder=""
					class="input-with-select"
				>
					<el-option label="从" :value="true"></el-option>
					<el-option label="到" :value="false"></el-option>
				</el-select>
				<el-button
					slot="append"
					icon="el-icon-search"
					@click="queryBtnClick"
				></el-button>
			</el-input>
		</div>
		<airlines-list
			:cList="airlinesList"
			:cTime="nowTime"
			@cardclick="cardClick"
		></airlines-list>
	</div>
</template>

<script>
import AirlinesList from "../../components/map/AirlinesList"
import TimeTool from "../../utils/TimeTool"

export default {
	name: "QueryAirlinesList",
	data() {
		return {
			query: "",
			airlinesList: [],
			byCity: true, // 是否通过城市查询
			byFrom: true, // 是否通过“从”查询
			nowTime: "",
		}
	},
	computed: {
		inputPlacehold() {
			if (this.byCity) {
				return "请输入城市名称"
			} else {
				return "请输入机场名称"
			}
		},
	},
	methods: {
    // 根据条件获取航班列表
		async _getAirlinesList() {
			const { data: result } = await this.$http.get("/api/airlines/findbymap", {
				params: {
					byCity: this.byCity,
					byFrom: this.byFrom,
					query: this.query,
				},
			})
			if (result.meta.status == 1) {
				this.airlinesList = result.data
				this.$emit("getQueryList", {
					airlinesList: this.airlinesList,
					byFrom: this.byFrom,
				})
			} else {
				this.$message({ type: "success", message: result.meta.msg })
			}
		},
    // 点击查询
		queryBtnClick() {
			this._getAirlinesList()
			this.nowTime = TimeTool.getTime()
		},
    // 点击按钮，地图航线高亮显示
		cardClick(id) {
			this.$emit("cardclick", id)
		},
	},
	components: {
		AirlinesList,
	},
}
</script>

<style lang="less" scoped>
.radio-container {
	margin-bottom: 10px;
}
.query-container {
	display: flex;
	margin-bottom: 15px;
	.el-input {
		margin-right: 10px;
	}
}
</style>