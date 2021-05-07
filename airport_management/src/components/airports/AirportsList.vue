<template>
	<div class="list_container">
		<!-- 首字母列表 -->
		<div class="letter_list">
			<span>按首字母查询</span>
			<div
				class="a_box"
				v-for="(item, index) in letterList"
				:key="item"
				@click="hrefClick(index)"
			>
				<a :href="'#' + item">{{ item }}</a>
			</div>
		</div>
		<ul class="ports_list">
			<li v-for="(item, index) in letterList" :key="item">
				<!-- 首字母标记 -->
				<span class="letter" :id="item" :class="{ current: current == index }">
					{{ item }}
				</span>
				<!-- 该首字母下机场 -->
				<div :class="item">
					<div
						class="a_box"
						v-for="(port, index) in getListByLetter(item)"
						:key="index"
					>
						<a href="" @click="goToDetail(port.name, $event)">{{ port.name }}</a>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "AirportsList",
	data() {
		return {
			current: 0,
		}
	},
	computed: {
		letterList() {
			// 提取first属性
			let letterArr = this.cAirportsList.map((item) => {
				return item.first ? item.first : ""
			})
			// 去重
			const letterSet = new Set(letterArr)
			letterArr = Array.from(letterSet).sort()
			// 去除空字符串
			letterArr = letterArr.filter((item) => item !== "")
			return letterArr
		},
	},
	props: {
		cAirportsList: {
			type: Array,
		},
	},
	methods: {
    // 点击首字母
		hrefClick(index) {
			this.current = index
		},
    // 获取拼音首字母为某的列表
		getListByLetter(letter) {
			let letterArr = this.cAirportsList.filter((item) => item.first == letter)
			return letterArr
		},
    // 转至详情页
    goToDetail(name, e) {
      // 取消默认事件
			if (e && e.preventDefault) {
				e.preventDefault() //非IE浏览器
			} else {
				window.event.returnValue = false //IE浏览器
			}
      this.$router.push(`/detail/${name}`)
    }
	},
}
</script>

<style lang="less" scoped>
.letter_list {
	display: flex;
	background: #e7e7e7;
	padding: 5px 15px;
	font-size: 0.8rem;
	letter-spacing: 0.05rem;
	display: flex;
	align-items: center;

	.a_box {
		margin-right: 10px;
		height: 20px;
		width: 20px;
		color: @homeBlue;
		cursor: pointer;

		a {
			display: block;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			text-decoration: none;
			color: inherit;
		}

		&:hover {
			background-color: @homeBlue;
			color: white;
			border-radius: 2px;
		}
	}

	span {
		margin-right: 20px;
	}
}

.ports_list {
	border: 1px solid #bbb;
	padding: 0 10px;

	& > li:nth-child(1) {
		border: none !important;
	}

	& > li {
		padding: 10px 0 10px 35px;
		border-top: 1px dashed #bbb;
		line-height: 26px;
		margin-top: -1px;
		list-style: none;
		display: flex;

		& > div {
			display: flex;
			flex-wrap: wrap;
		}

		.a_box {
			padding: 0 5px;
			color: @homeBlue;
			font-size: 0.85rem;
			margin-right: 15px;
			margin-top: 5px;

			&:hover {
				background-color: @homeBlue;
				color: white;
			}

			a {
				text-decoration: none;
				color: inherit;
			}
		}

		span {
			display: block;
			min-width: 30px;
			height: 30px;
			text-align: center;
			line-height: 30px;
			background: #e7e7e7;
			position: relative;
			margin-right: 30px;

			&::after {
				position: absolute;
				right: -10px;
				top: 50%;
				transform: translateY(-50%);
				content: "";
				width: 0;
				height: 0;
				border-width: 5px;
				border-color: transparent transparent transparent #e7e7e7;
				border-style: solid;
			}

			&.current {
				background-color: @homeBlue;
				color: white;

				&::after {
					border-color: transparent transparent transparent @homeBlue;
				}
			}
		}
	}
}
</style>