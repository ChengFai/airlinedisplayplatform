const airportsModel = require("../models/airports");

// 处理获取全部机场列表请求
exports.list = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const result = await airportsModel.findList();
	if (result) {
		res.render("success", {
			data: JSON.stringify(result),
			msg: "成功获取全部机场列表"
		});
	} else {
		res.render("error", {
			data: [],
			msg: "获取全部机场列表失败"
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
				data: [],
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
				data: [],
				msg: "暂无该机场信息"
			});
		}
	}
};
