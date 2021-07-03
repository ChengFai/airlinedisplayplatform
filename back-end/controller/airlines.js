const airlinesModel = require("../models/airlines");
const { arrAddFirst } = require("../utils/tools");

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
	let resultList = result.map(item => {
		return item.endAirport;
	});
	const resultSet = new Set(resultList);
	resultList = Array.from(resultSet);
	resultList = resultList.map(item => {
		return { name: item };
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

// 处理根据机场获取航班列表的请求
exports.findByAirports = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { startAirport, endAirport } = req.body;
	const result = await airlinesModel.findByAirports(startAirport, endAirport);
	if (result) {
		res.render("success", {
			data: JSON.stringify(result),
			msg: `获取从${startAirport}到${endAirport}的航班列表`
		});
	} else {
		res.render("error", {
			data: "null",
			msg: `获取从${startAirport}到${endAirport}的航班列表失败`
		});
	}
};

// 处理获取抵达xx机场的所有航班列表的请求
exports.findByTAirport = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { endAirport } = req.body;
	const result = await airlinesModel.findByToAirport(endAirport);
	let resultList = result.map(item => {
		return item.startAirport;
	});
	const resultSet = new Set(resultList);
	resultList = Array.from(resultSet);
	resultList = resultList.map(item => {
		return { name: item };
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

// 处理根据查询信息获取航班列表的请求
exports.findByQuery = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	let query = {};
	const { from, to, numb, weekday } = req.body.queryInfo;
	if (from !== "") query.from = from;
	if (to !== "") query.to = to;
	if (numb !== "") query.numb = numb;
	if (weekday !== "") query["date." + weekday] = 1;
	const { queryPage, querySize } = req.body;
	const result = await airlinesModel.findByQuery(query, queryPage, querySize);
	const total = await airlinesModel.findCount(query);
	if (result) {
		res.render("success", {
			data: JSON.stringify({
				result,
				total
			}),
			msg: "成功获取列表"
		});
	} else {
		res.render("error", {
			data: "null",
			msg: "获取列表失败"
		});
	}
};

// 处理获取全部相关城市的请求
exports.findCitys = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	let result = await airlinesModel.findCitys();
	let citySet = new Set();
	for (item of result) {
		citySet.add(item.from);
		citySet.add(item.to);
	}
	result = [...citySet];
	if (result) {
		res.render("success", {
			data: JSON.stringify({
				result
			}),
			msg: "成功获取城市列表"
		});
	} else {
		res.render("error", {
			data: "null",
			msg: "获取城市列表失败"
		});
	}
};

// 处理根据时间获取航班的请求
exports.findByTime = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { weekday, time, page } = req.query;
	const result = await airlinesModel.findByTime(weekday, time, page).data;
	const total = await airlinesModel.findByTime(weekday, time, page).total;
	if (result) {
		res.render("success", {
			data: JSON.stringify({ result, total }),
			msg: "根据时间获取航班成功"
		});
	} else {
		res.render("error", {
			data: "null",
			msg: "根据时间获取航班失败"
		});
	}
};

// 处理根据从/到某个城市/机场的条件获取航班的请求
exports.findByMap = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { byFrom, byCity, query } = req.query;
	let result = "";
	if (byFrom == "true") {
		if (byCity == "true") {
			// 从某个城市出发
			result = await airlinesModel.findByFrom(query);
		} else {
			// 从某个机场出发
			result = await airlinesModel.findByFromAirport(query);
		}
	} else {
		if (byCity == "true") {
			// 到某个城市
			result = await airlinesModel.findByTo(query);
		} else {
			// 到某个机场
			result = await airlinesModel.findByToAirport(query);
		}
	}
	if (result !== "") {
		res.render("success", {
			data: JSON.stringify(result),
			msg: "获取列表成功"
		});
	} else {
		res.render("error", {
			data: "null",
			msg: "获取列表失败"
		});
	}
};

// 处理根据用户选择侧重获取航班列表的请求
exports.findByRecommend = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const { from, to, date, time } = req.query;
	const query = {
		startAirport: from,
		endAirport: to
	};
	query["date." + date] = 1;
	if (time == "beforenoon") query.startTime = { $lt: "12:00" };
	else if (time == "afternoon") query.startTime = { $gt: "12:00" };
	const result = await airlinesModel.findByRecommend(query);
	if (result !== "") {
		res.render("success", {
			data: JSON.stringify(result),
			msg: "获取列表成功"
		});
	} else {
		res.render("error", {
			data: "null",
			msg: "获取列表失败"
		});
	}
};
