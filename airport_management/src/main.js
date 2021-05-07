import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 引用样式
import "./assets/less/style.less";
import "./assets/less/loading.less";
// 引用element-ui
import "./plugins/element.js";

// 引用axios
import axios from "axios";
// 配置基础url
// axios.defaults.baseURL = "http://localhost:3000/api/airmana";

// 配置发送前拦截并添加token
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem("token");
	return config;
});
// 将axios工具添加至axios原型链中
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
