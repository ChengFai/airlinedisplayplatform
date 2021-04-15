<template>
	<div>
		<el-page-header @back="goBack" :content="`${start} - ${end}`">
		</el-page-header>
		<el-card style="width: 80%">
			<airlines-list :cList="airlinesList"></airlines-list>
		</el-card>
	</div>
</template>

<script>
import AirlinesList from "../../components/airlines/AirlinesList"

export default {
	name: "MoreDetailPage",
	data() {
		return {
			start: "",
			end: "",
			airlinesList: [],
		}
	},
	methods: {
		goBack() {
			this.$router.back(-1)
		},
		async _getAirlinesList() {
			const startAirport = this.start
			const endAirport = this.end
			const { data: result } = await this.$http.post(
				"/api/airlines/findbyairports",
				{
					startAirport,
					endAirport,
				}
			)
			if (result.meta.status == 1) {
				this.airlinesList = result.data
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
	},
	created() {
		this.start = this.$route.params.start
		this.end = this.$route.params.end
		this._getAirlinesList()
	},
	components: {
		AirlinesList,
	},
}
</script>

<style lang="less" scoped>
.el-main {
  height: 100%;
}
.el-card {
	margin-top: 20px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>