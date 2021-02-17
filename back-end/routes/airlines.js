const express = require("express");
const router = express.Router();
// 航班相关controller
const { list, findByFrom, findByTo } = require("../controller/airlines");

// 获取全部航班列表
router.get("/", list);
// 根据出发地获取航班列表
router.post("/findbyfrom", findByFrom);
// 根据抵达地获取航班列表
router.post("/findbyto", findByTo);

module.exports = router;
