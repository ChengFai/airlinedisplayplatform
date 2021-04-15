const { query } = require("express");
const { Airlines } = require("../utils/db");

// 从数据库获取全部航班列表
exports.findList = () => {
	return Airlines.find().sort({ _id: -1 });
};

// 从数据库根据启航机场获取全部航班列表
exports.findByFromAirport = startAirport => {
	return Airlines.find({ startAirport });
};

// 从数据库根据机场获取全部航班列表
exports.findByAirports = (startAirport, endAirport) => {
	return Airlines.find({ startAirport, endAirport });
};

// 从数据库根据抵达机场获取全部航班列表
exports.findByToAirport = endAirport => {
	return Airlines.find({ endAirport });
};

// 从数据库根据出发地获取全部航班列表
exports.findByFrom = from => {
	return Airlines.find({ from });
};

// 从数据库根据抵达获取全部航班列表
exports.findByTo = to => {
	return Airlines.find({ to });
};

// 从数据库根据查询对象获取航班列表
exports.findByQuery = (query, queryPage, querySize) => {
	return Airlines.find(query)
		.skip((parseInt(queryPage) - 1) * parseInt(querySize)) // 跳过前n-1页
		.limit(parseInt(querySize)); // 获取m个
};

// 查询数据的数据量
exports.findCount = query => {
	return Airlines.count(query);
};

// 从数据库获取非重复的城市列表
exports.findCitys = () => {
	// const fromCitys = Airlines.find().distinct("from").exec();
	// const toCitys = Airlines.find().distinct("to").exec();
	return Airlines.find().select("from to");
};

