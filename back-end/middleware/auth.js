const { verify } = require("../utils/tools");

// 判断登录状态中间件
exports.auth = async (req, res, next) => {
	res.set("content-type", "application/json;cahrset=utf-8");
	const token = req.get("X-Access-Token");
	try {
		const result = verify(token);
		// token验证成功，进行下一步
		next();
	} catch (err) {
		// token验证失败，返回结果
		res.render("error", {
			data: null,
			msg: "用户未登录"
		});
	}
};
