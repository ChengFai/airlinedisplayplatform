const airportsModel = require("../models/airports");

// 处理获取热门机场列表请求
exports.getHot = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const result = await airportsModel.findHot();
	if (result) {
		// 热门列表获取成功
		res.render("success", {
			data: JSON.stringify(result),
			msg: "成功获取热门机场列表"
		});
	} else {
		// 热门列表获取失败
		res.render("error", {
			data: "null",
			msg: "获取热门机场列表失败"
		});
	}
};

// 处理机场列表请求
exports.list = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const queryInfo = req.body.queryInfo || "";
	const queryPage = req.body.queryPage || 1;
	const querySize = req.body.querySize || 5;
	const queryInfoReg = new RegExp(queryInfo, "i");
	const result = await airportsModel.findList(queryInfoReg, queryPage, querySize);
	const total = await airportsModel.findCount(queryInfoReg);
	if (result) {
		// 列表获取成功
		res.render("success", {
			data: JSON.stringify({
				result,
				total
			}),
			msg: "成功获取机场列表"
		});
	} else {
		// 列表获取失败
		res.render("error", {
			data: "null",
			msg: "获取机场列表失败"
		});
	}
};

// 处理根据机场名获取坐标的请求
exports.find = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { from } = req.body;
	let coords = [];
	const fromInfo = await airportsModel.findByName(from);
	if (fromInfo) coords.push(fromInfo.coord);
	if (req.body.to) {
		const { to } = req.body;
		const toInfo = await airportsModel.findByName(to);
		if (toInfo) coords.push(toInfo.coord);
		if (coords.length == 2) {
			// 请求两个机场信息，获取到两个机场的信息
			res.render("success", {
				data: JSON.stringify({
					coords
				}),
				msg: "获取到数据 * 2"
			});
		} else {
			// 请求两个机场信息，只获取到一个机场的信息
			res.render("error", {
				data: "null",
				msg: "暂无该机场信息"
			});
		}
	} else {
		// 请求一个机场信息，获取到一个机场信息
		if (coords.length == 1) {
			res.render("success", {
				data: JSON.stringify({
					coords
				}),
				msg: "获取到数据 * 1"
			});
		} else {
			// 请求一个机场信息，未获取任何信息
			res.render("error", {
				data: "null",
				msg: "暂无该机场信息"
			});
		}
	}
};
