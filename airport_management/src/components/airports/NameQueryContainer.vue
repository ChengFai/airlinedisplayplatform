<template>
	<div>
		<!-- 搜索框 -->
		<el-row class="input_row">
			<el-col :span="8">
				<el-input placeholder="请输入内容" v-model="query.queryInfo">
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="searchClick"
					></el-button>
				</el-input>
			</el-col>
		</el-row>
		<!-- 结果表格 -->
		<div class="table_container">
			<div style="width: 95%">
				<el-table :data="airportList" border stripe v-loading="loading">
					<el-table-column type="index" label="#"></el-table-column>
					<el-table-column prop="name" label="机场名"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<div>123</div>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="query.queryPage"
					:page-sizes="[5, 10, 20, 40]"
					:page-size="query.querySize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "NameQueryContainer",
	data() {
		return {
			query: {
				queryInfo: "",
				queryPage: 1,
				querySize: 5,
			},
			airportList: [],
			loading: false,
			total: 0,
		}
	},
	methods: {
		async _getAirportsList() {
			this.loading = true
			const { data: result } = await this.$http.post(
				"/api/airports",
				this.query
			)
			if (result.meta.status == 1) {
				this.airportList = result.data.result
				this.total = result.data.total
				this.loading = false
			} else {
				this.$message({ type: "error", message: result.meta.msg })
			}
		},
		handleSizeChange(newSize) {
			this.query.querySize = newSize
			this._getAirportsList()
		},
		handleCurrentChange(newPage) {
			this.query.queryPage = newPage
			this._getAirportsList()
		},
		searchClick() {
      this.query.queryPage = 1; // 重置页码
			this._getAirportsList()
		},
	},
	created() {
		this._getAirportsList()
	},
}
</script>

<style lang="less" scoped>
.input_row {
	margin-top: 30px;
	margin-left: 20px;
}
.table_container {
	margin-top: 30px;
	width: 100%;
	display: flex;
	justify-content: center;
}
.el-pagination {
	margin-top: 20px;
	margin-left: auto;
}
</style>