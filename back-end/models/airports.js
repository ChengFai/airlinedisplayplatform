const { Airports } = require("../utils/db");

// 从数据库获取热门机场
exports.findHot = () => {
	return Airports.find();
};

// 从数据库获取机场列表(关键词正则，页码，每页数据量)
exports.findList = (queryInfoReg, queryPage, querySize) => {
	return Airports.find({ name: { $regex: queryInfoReg } }) // 查询包含关键字
		.sort({ first: 1 }) // 按拼音排序
		.skip((parseInt(queryPage) - 1) * parseInt(querySize)) // 跳过前n-1页
		.limit(parseInt(querySize)); // 获取m个
};

// 查询数据的数据量
exports.findCount = queryInfoReg => {
	return Airports.count({ name: { $regex: queryInfoReg } });
};

// 从数据库，根据name获取坐标值
exports.findByName = name => {
	return Airports.findOne({ name });
};
