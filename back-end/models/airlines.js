const { Airlines } = require("../utils/db");

// 从数据库获取全部航班列表
exports.findList = () => {
	return Airlines.find().sort({ _id: -1 });
};

// 从数据库根据启航机场获取全部航班列表
exports.findByAirport = startAirport => {
	return Airlines.find({ startAirport });
};

// 从数据库根据出发地获取全部航班列表
exports.findByFrom = from => {
	return Airlines.find({ from });
};

// 从数据库根据抵达获取全部航班列表
exports.findByTo = to => {
	return Airlines.find({ to });
};
