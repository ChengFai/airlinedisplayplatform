const https = require("https");
const fs = require("fs");
const express = require("express");
const compression = require("compression");

const app = express();

app.use(compression());
app.use(express.static("./dist"));

app.listen(8990, () => {
	console.log("server started on 8990");
});
