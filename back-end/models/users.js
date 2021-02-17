const { Users } = require("../utils/db");

// 向数据库中添加用户
exports.addUser = ({ username, password }) => {
	const user = new Users({
		username,
		password
	});
	return user.save();
};

// 在数据库中根据username查找用户
exports.findUser = username => {
	return Users.findOne({ username });
};
