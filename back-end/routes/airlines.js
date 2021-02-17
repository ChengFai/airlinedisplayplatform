const express = require("express");
const router = express.Router();
// 航班相关controller
const { list } = require("../controller/airlines");

// 获取全部航班列表
router.get("/", list);

module.exports = router;
