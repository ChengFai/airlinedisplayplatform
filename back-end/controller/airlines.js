const airlinesModel = require("../models/airlines");
const { arrAddFirst } = require("../utils/tools");
//

// 处理获取全部航班列表的请求
exports.list = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const result = await airlinesModel.findList();
	if (result) {
		// 获取全部列表成功
		res.render("success", {
			data: JSON.stringify(result),
			msg: "获取到航班全部列表"
		});
	} else {
		// 获取全部列表失败
		res.render("error", {
			data: "null",
			msg: "获取航班全部列表失败"
		});
	}
};

// 处理获取从xx机场启航的所有航班列表的请求
exports.findByFAirport = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { startAirport } = req.body;
	const result = await airlinesModel.findByFromAirport(startAirport);
	const resultList = result.map(item => {
		return { name: item.endAirport };
	});
	const arr = arrAddFirst(resultList);
	if (arr) {
		res.render("success", {
			data: JSON.stringify(arr),
			msg: `获取从${startAirport}启航的所有机场列表`
		});
	} else {
		res.render("error", {
			data: "null",
			msg: `获取从${startAirport}启航的所有机场列表失败`
		});
	}
};

// 处理获取抵达xx机场的所有航班列表的请求
exports.findByTAirport = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { endAirport } = req.body;
	const result = await airlinesModel.findByToAirport(endAirport);
	const resultList = result.map(item => {
		return { name: item.startAirport };
	});
	const arr = arrAddFirst(resultList);
	if (arr) {
		res.render("success", {
			data: JSON.stringify(arr),
			msg: `获取抵达${endAirport}的所有机场列表`
		});
	} else {
		res.render("error", {
			data: "null",
			msg: `获取抵达${endAirport}的所有机场列表失败`
		});
	}
};

// 处理根据出发地获取航班列表的请求
exports.findByFrom = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { from } = req.body;
	const result = await airlinesModel.findByFrom(from);
	if (result) {
		// 根据出发地获取到航班
		res.render("success", {
			data: JSON.stringify(result),
			msg: `获取到从${from}出发的所有航班`
		});
	} else {
		// 根据出发地获取航班失败
		res.render("error", {
			data: "null",
			msg: `从${from}出发的所有航班获取失败`
		});
	}
};

// 处理根据抵达地获取航班列表的请求
exports.findByTo = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { to } = req.body;
	const result = await airlinesModel.findByTo(to);
	if (result) {
		// 根据抵达地获取到航班
		res.render("success", {
			data: JSON.stringify(result),
			msg: `获取到抵达${to}的所有航班`
		});
	} else {
		// 根据抵达地获取航班失败
		res.render("error", {
			data: "null",
			msg: `抵达${to}的所有航班获取失败`
		});
	}
};
