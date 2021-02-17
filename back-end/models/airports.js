const { Airports } = require("../utils/db");

// 从数据库获取全部机场列表
exports.findList = () => {
	return Airports.find().sort({ _id: -1 });
};

// 从数据库，根据name获取坐标值
exports.findByName = name => {
	return Airports.findOne({ name });
};
