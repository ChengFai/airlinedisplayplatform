const express = require("express");
const router = express.Router();
// 航班相关controller
const { list, findByFrom, findByTo, findByFAirport, findByTAirport } = require("../controller/airlines");

// 判断登录中间件
const { auth } = require("../middleware/auth");

// 获取全部航班列表
router.get("/", auth, list);
// 根据启航机场获取列表
router.post("/findbyfairport", findByFAirport);
// 根据抵达机场获取列表
router.post("/findbytairport", findByTAirport);
// 根据出发地获取航班列表
router.post("/findbyfrom", auth, findByFrom);
// 根据抵达地获取航班列表
router.post("/findbyto", auth, findByTo);

module.exports = router;
