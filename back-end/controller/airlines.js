const airlinesModel = require("../models/airlines");

// 处理获取全部航班列表请求
exports.list = async (req, res, next) => {
  res.set("content-type","application/json;charset=utf-8");
  const result =await airlinesModel.findList();
  if(result) {
    res.render("success", {
      data: JSON.stringify(result),
      msg: "获取到航班全部列表"
    })
  } else {
    res.render("error", {
      data: null,
      msg: "获取航班全部列表失败"
    })
  }
};
