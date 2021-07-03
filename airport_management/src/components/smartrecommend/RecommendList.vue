<template>
	<!-- 无数据时显示 -->
	<div v-if="!(cList.length > 0)" style="text-align: center">
		<h2>抱歉，暂无数据</h2>
	</div>
	<!-- 有数据时显示 -->
	<div v-else class="list-container">
		<div class="title">推荐航班</div>
		<el-card v-for="(item, index) in cList.slice(0, 3)" :key="index">
			<div class="card-box">
				<span
					class="index"
					:class="{
						first: index == 0,
						second: index == 1,
						third: index == 2,
					}"
					>No.{{ index + 1 }}</span
				>
				<span class="numb">{{ item.numb }}</span>
				<span class="route">
					<el-tooltip content="航线" placement="bottom" effect="light">
						<span class="iconfont icon--route"></span>
					</el-tooltip>
					{{ item.startAirport }}({{ item.from }})
					<span class="iconfont icon-daoda"></span>
					{{ item.endAirport }}({{ item.to }})
				</span>
				<span class="time">
					<el-tooltip content="时间" placement="bottom" effect="light">
						<span class="iconfont icon-daoqishijian"></span>
					</el-tooltip>
					{{ item.startTime }}
					<span class="iconfont icon-daoda"></span>
					{{ item.endTime }}
				</span>
				<div class="date">
					<el-tooltip content="排期" placement="bottom" effect="light">
						<span class="iconfont icon-rili"></span>
					</el-tooltip>
					<span
						v-for="(weekday, index) in dateList"
						:key="index"
						:class="{ blue: item.date[index] == '1' }"
					>
						{{ weekday }}
					</span>
				</div>
				<span class="price">{{
					item.price == "--" ? "暂无报价" : item.price + "元"
				}}</span>
				<span class="ontimerate">
					<el-tooltip content="准时率" placement="bottom" effect="light">
						<span class="iconfont icon-miaobiao"></span>
					</el-tooltip>
					{{ item.ontimeRate }}
				</span>
			</div>
		</el-card>
		<div class="title">符合要求航班</div>
		<el-card v-for="(item, index) in cList.slice(3)" :key="index + 3">
			<div class="card-box">
				<span class="index">No.{{ index + 4 }}</span>
				<span class="numb">{{ item.numb }}</span>
				<span class="route">
					<el-tooltip content="航线" placement="bottom" effect="light">
						<span class="iconfont icon--route"></span>
					</el-tooltip>
					{{ item.startAirport }}({{ item.from }})
					<span class="iconfont icon-daoda"></span>
					{{ item.endAirport }}({{ item.to }})
				</span>
				<span class="time">
					<el-tooltip content="时间" placement="bottom" effect="light">
						<span class="iconfont icon-daoqishijian"></span>
					</el-tooltip>
					{{ item.startTime }}
					<span class="iconfont icon-daoda"></span>
					{{ item.endTime }}
				</span>
				<div class="date">
					<el-tooltip content="排期" placement="bottom" effect="light">
						<span class="iconfont icon-rili"></span>
					</el-tooltip>
					<span
						v-for="(weekday, index) in dateList"
						:key="index"
						:class="{ blue: item.date[index] == '1' }"
					>
						{{ weekday }}
					</span>
				</div>
				<span class="price">{{
					item.price == "--" ? "暂无报价" : item.price + "元"
				}}</span>
				<span class="ontimerate">
					<el-tooltip content="准时率" placement="bottom" effect="light">
						<span class="iconfont icon-miaobiao"></span>
					</el-tooltip>
					{{ item.ontimeRate }}
				</span>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: "RecommendList",
	data() {
		return {
			dateList: ["一", "二", "三", "四", "五", "六", "日"],
		}
	},
	methods: {},
	props: {
		cList: {
			type: Array,
		},
	},
}
</script>

<style lang="less" scoped>
.iconfont {
	cursor: pointer;
}

.list-container {
	width: 100%;
	height: 100%;

	.title {
		width: 100%;
		margin-top: 40px;
		text-align: center;
		font-size: 1.3rem;
		font-weight: 600;
	}

	.el-card {
		margin: 10px 0;

		.card-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.index {
			font-size: 1.5rem;
			font-weight: 800;
			color: #eee;
			&.first {
				color: rgb(243, 231, 56);
			}
			&.second {
				color: rgb(220, 223, 227);
			}
			&.third {
				color: rgb(242, 192, 86);
			}
		}

		.numb {
			margin-left: 20px;
			color: @homeBlue;
		}
		.route {
			margin-left: 20px;
			font-weight: 600;
			color: gray;
			font-size: 0.7rem;
		}
		.date {
			margin-left: 20px;
			& > span {
				color: #ccc;
				font-size: 0.7rem;
				font-weight: 600;
				&.blue {
					color: @homeBlue;
				}
			}
		}
		.time {
			margin-left: 20px;
			color: gray;
			font-size: 0.7rem;
			font-weight: 600;
		}
		.price {
			font-size: 0.7rem;
			color: gray;
      text-align: center;
      min-width: 50px;
		}
		.ontimerate {
			margin-left: 20px;
			color: gray;
			font-size: 0.7rem;
		}
	}
}
</style>