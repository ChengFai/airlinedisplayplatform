const express = require("express");
const router = express.Router();
// 航班相关controller
const { 
  list, findByFrom, findByTo, 
  findByFAirport, findByTAirport, findByAirports, 
  findByQuery, findCitys, findByTime, 
  findByMap 
} = require("../controller/airlines");

// 判断登录中间件
const { auth } = require("../middleware/auth");

// 获取全部航班列表
router.get("/", auth, list);
// 根据启航机场获取列表
router.post("/findbyfairport", auth, findByFAirport);
// 根据抵达机场获取列表
router.post("/findbytairport", auth, findByTAirport);
// 根据机场获取列表
router.post("/findbyairports", auth, findByAirports);
// 根据出发地获取航班列表
router.post("/findbyfrom", auth, findByFrom);
// 根据抵达地获取航班列表
router.post("/findbyto", auth, findByTo);
// 根据查询获取航班列表
router.post("/findbyquery", auth, findByQuery);
// 获取相关城市列表
router.get("/findcitys", auth, findCitys);
// 根据时间获取航班列表
router.get("/findbytime", findByTime);
// 根据从/到某个城市/机场的条件获取航班列表
router.get("/findbymap", findByMap);

module.exports = router;
