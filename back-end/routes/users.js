const express = require("express");
const router = express.Router();

const { signup, signin, isAuth } = require("../controller/users");

// 注册
router.post("/signup", signup);
// 登录
router.post("/signin", signin);
//是否登录
router.get("/isAuth", isAuth);

module.exports = router;
