const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/airport-management", { useNewUrlParser: true, useUnifiedTopology: true });

// 连接数据库
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	// we're connected!
	console.log("db is connected");
});

// 定义机场的策略
const airportsSchema = mongoose.Schema({
	name: String, // 机场名
	coord: {
		x: String, // 机场x坐标（经度）
		y: String // 机场y坐标（维度）
	}
});
// 定义机场的模式
const Airports = mongoose.model("Airports", airportsSchema);

// 定义航线的策略
const airlinesSchema = mongoose.Schema({
	numb: String, // 航班号
	type: String, // 机型
	startTime: String, // 启航时间
	startAirport: String, // 启航机场
	endTime: String, // 抵达时间
	endAitport: String, // 抵达机场
	date: Array, // 周计划
	ontimeRate: String, // 准时率
	from: String, // 出发地
	to: String // 到达地
});
// 定义航线的模式
const Airlines = mongoose.model("Airlines", airlinesSchema);

// 导出
exports.Airports = Airports;
exports.Airlines = Airlines;
