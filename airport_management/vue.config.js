const { debug } = require("console");
const path = require("path");

module.exports = {
	pluginOptions: {
		"style-resources-loader": {
			preProcessor: "less",
			patterns: [path.resolve(__dirname, "src/assets/less/colorstyle.less")]
		}
	},
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:3000/api/airmana", // 后台接口域名
				changeOrigin: true, //是否跨域
				logLevel: "debug", // 查看日志
				pathRewrite: {
					"^/api": ""
				}
			},
			"/baidu": {
				target: "http://api.map.baidu.com",
				changeOrigin: true,
				logLevel: "debug",
				pathRewrite: {
					"^/baidu": ""
				}
			}
		}
	},
	configureWebpack: {
		externals: {
			BMap: "BMap"
		}
	}
};
