const airlinesModel = require("../models/airlines");

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
			data: null,
			msg: "获取航班全部列表失败"
		});
	}
};

// 处理根据出发地获取航班列表的请求
exports.findByFrom = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
  const {from} = req.body;
  const result = await airlinesModel.findByFrom(from);
  if(result) {
    // 根据出发地获取到航班
    res.render("success", {
      data: JSON.stringify(result),
      msg: `获取到从${from}出发的所有航班`
    })
  } else {
		// 根据出发地获取航班失败
		res.render("error", {
			data: null,
			msg: `从${from}出发的所有航班获取失败`
		});
	}
};

// 处理根据抵达地获取航班列表的请求
exports.findByTo = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
  const {to} = req.body;
  const result = await airlinesModel.findByTo(to);
  if(result) {
    // 根据抵达地获取到航班
    res.render("success", {
      data: JSON.stringify(result),
      msg: `获取到抵达${to}的所有航班`
    })
  } else {
		// 根据抵达地获取航班失败
		res.render("error", {
			data: null,
			msg: `抵达${to}的所有航班获取失败`
		});
	}
};
