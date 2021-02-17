const express = require("express");
const router = express.Router();
const { list, find } = require("../controller/airports");

// 判断登录中间件
const { auth } = require("../middleware/auth");

// 获取全部机场列表
router.get("/", auth, list);
// 根据机场名获取坐标（from,to?）
router.post("/", auth, find);

module.exports = router;
