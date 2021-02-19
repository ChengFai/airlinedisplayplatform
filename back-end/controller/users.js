const usersModel = require("../models/users");
const { hash, compare, sign, verify } = require("../utils/tools");

// 处理注册请求
exports.signup = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { username, password } = req.body;
	// 判断用户名是否存在
	const isRepeat = await usersModel.findUser(username);
	if (isRepeat) {
		// 用户名已存在
		res.render("error", {
			data: "null",
			msg: "用户名已存在"
		});
	} else {
		const hashPwd = await hash(password);
		const result = await usersModel.addUser({ username, password: hashPwd });
		if (result) {
			// 注册成功
			res.render("success", {
				data: JSON.stringify({
					username
				}),
				msg: "注册用户成功"
			});
		} else {
			// 注册失败
			res.render("error", {
				data: "null",
				msg: "注册用户失败"
			});
		}
	}
};

// 处理登录请求
exports.signin = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { username, password } = req.body;
	const result = await usersModel.findUser(username);
	if (result) {
		const { password: hash } = result;
		const isCompared = await compare(password, hash);
		if (isCompared) {
			const token = sign(username); // 获取token
			res.set("X-Access-Token", token); // 将token发送给前端

			// 用户名与密码均正确
			res.render("success", {
				data: JSON.stringify({
					username
				}),
				msg: "登录成功"
			});
		} else {
			// 用户名正确，密码错误
			res.render("error", {
				data: "null",
				msg: "密码错误"
			});
		}
	} else {
		// 用户名不存在
		res.render("error", {
			data: "null",
			msg: "用户不存在"
		});
	}
};

// 处理获取登录状态请求
exports.isAuth = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const token = req.get("X-Access-Token");
	try {
		const result = verify(token);
    console.log(result);
		// token验证成功，用户已登录
		res.render("success", {
			data: JSON.stringify(result),
			msg: "用户已登录"
		});
	} catch (err) {
		// token验证失败，用户未登录
		res.render("error", {
			data: "null",
			msg: "用户未登录"
		});
	}
};
