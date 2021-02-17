const express = require("express");
const router = express.Router();
const { list, find } = require("../controller/airports");

// 获取全部机场列表
router.get("/", list);
// 根据机场名获取坐标（from,to?）
router.post("/", find);

module.exports = router;
