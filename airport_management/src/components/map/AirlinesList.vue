<template>
	<div class="container">
		<el-card shadow="hover" v-for="(item, i) in cList" :key="i">
			<p class="card-title" @click="cardClick(item._id)">{{ item.numb }}</p>
			<div style="display: flex">
				<p class="card-place">从</p>
				<p class="small-font">：{{ item.startAirport }}({{ item.from }})</p>
			</div>
			<div style="display: flex">
				<p class="card-place">到</p>
				<p class="small-font">：{{ item.endAirport }}({{ item.to }})</p>
			</div>
			<div class="card-time">
				<p class="small-font">{{ item.startTime }}</p>
				<el-progress
					:percentage="getPercent(item.startTime, item.endTime)"
					:show-text="false"
					:stroke-width="3"
					:color="customColors"
					style="width: 50%"
				></el-progress>
				<p class="small-font">{{ item.endTime }}</p>
			</div>
		</el-card>
	</div>
</template>

<script>
import TimeTool from "../../utils/TimeTool"

export default {
	name: "AirlinesList",
	data() {
		return {
			customColors: [
				{ color: "#409eff", percentage: 99 },
				{ color: "#5cb87a", percentage: 101 },
			],
		}
	},
	props: {
		cList: {
			type: Array,
			default() {
				return []
			},
			required: true,
		},
		cTime: {
			type: String,
			default() {
				return ""
			},
			required: true,
		},
	},
	methods: {
		getPercent(start, end) {
			let percent =
				(TimeTool.timeToNumb(this.cTime) - TimeTool.timeToNumb(start)) /
				(TimeTool.timeToNumb(end) - TimeTool.timeToNumb(start))
			if (percent < 0) percent = 0
			if (percent > 1) percent = 1
			return Math.round(percent * 100)
		},
		cardClick(id) {
			this.$emit("cardclick", id)
		},
	},
}
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	height: 100%;
}
.el-card {
	margin-bottom: 5px;
}

.card-title {
	font-size: 1.2em;
	font-weight: 600;
	color: @homeBlue;
	margin-top: 0;
  cursor: pointer;
}

.card-time {
	display: flex;
	justify-content: space-around;

	.el-progress {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.card-place {
	background: @homeBlue;
	font-size: 0.5em;
	color: white;
	display: block;
	width: 17px;
	height: 17px;
	text-align: center;
	line-height: 17px;
	border-radius: 3px;
	margin-right: 10px;
}

.small-font {
	font-size: 0.5em;
	color: gray;
}
</style>