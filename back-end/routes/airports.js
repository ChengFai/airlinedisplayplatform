const express = require("express");
const router = express.Router();
const { getHot, list, find, getAll } = require("../controller/airports");

// 判断登录中间件
const { auth } = require("../middleware/auth");

// 获取热门机场列表
router.get("/hot", auth, getHot);
// 获取全部机场列表
router.get("/all", auth, getAll);
// 获取机场列表
router.post("/", auth, list);
// 根据机场名获取坐标（from,to?）
router.post("/", auth, find);

module.exports = router;
