const airlinesModel = require("../models/airlines");

// 处理获取全部航班列表的请求
exports.list = async (req, res, next) => {
	res.set("content-type", "application/json;charset=utf-8");
	const result = await airlinesModel.findList();
	if (result) {
		res.render("success", {
			data: JSON.stringify(result),
			msg: "获取到航班全部列表"
		});
	} else {
		res.render("error", {
			data: [],
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
    res.render("success", {
      data: JSON.stringify(result),
      msg: `获取到从${from}出发的所有航班`
    })
  } else {
    res.render("error", {
			data: [],
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
    res.render("success", {
      data: JSON.stringify(result),
      msg: `获取到抵达${to}的所有航班`
    })
  } else {
    res.render("error", {
			data: [],
			msg: `抵达${to}的所有航班获取失败`
		});
  }
};
