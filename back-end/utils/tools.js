const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const Pinyin = require("../utils/ChinesePY");

// 将密码加密为hash
exports.hash = password => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, function (err, hash) {
			// Store hash in your password DB.
			if (err) reject(err);
			else {
				resolve(hash);
			}
		});
	});
};

// 验证密码与hash值是否相符
exports.compare = (password, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, function (err, result) {
			// result == true
			if (err) reject(err);
			else resolve(result);
		});
	});
};

// 根据用户名生成token
exports.sign = username => {
	const privateKey = fs.readFileSync(path.join(__dirname, "../keys/rsa_private_key.pem"));
	const token = jwt.sign({ username }, privateKey, { algorithm: "RS256" });
	return token;
};

// 判断token是否合法
exports.verify = token => {
	const publicKey = fs.readFileSync(path.join(__dirname, "../keys/rsa_public_key.pem"));
	const result = jwt.verify(token, publicKey);
	return result;
};

// 将数组添加拼音并去重 arr:[{name:"xxx"}] => [{name:"xxx",first:"X"}]
exports.arrAddFirst = arr => {
	for (item of arr) {
		let { name } = item;
		let first = Pinyin.GetJP(name)[0];
		item.first = first.toUpperCase();
	}
	return arr
};
