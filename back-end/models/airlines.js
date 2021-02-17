const { Airlines } = require("../utils/db");

// 从数据库获取全部航班列表
exports.findList = () => {
	return Airlines.find().sort({ _id: -1 });
};
