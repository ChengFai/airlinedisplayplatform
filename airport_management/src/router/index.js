import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import("../views/Login");
const Home = () => import("../views/Home");
const Map = () => import("../views/map/Map");
const Airports = () => import("../views/airports/Airports");
const DetailPage = () => import("../views/airports/DetailPage");
const MoreDetailPage = () => import("../views/airports/MoreDetailPage");
const Airlines = () => import("../views/airlines/Airlines");

Vue.use(VueRouter);

const routes = [
	{ path: "/", redirect: "/login" },
	{ path: "/login", meta: { title: "登录" }, component: Login },
	{
		path: "/home",
		component: Home,
		redirect: "/map",
		children: [
			{ path: "/map", meta: { title: "地图" }, component: Map },
			{ path: "/airports", meta: { title: "机场查询" }, component: Airports },
			{ path: "/detail/:name", meta: { title: "详情页", noAlive: true }, component: DetailPage, props: true },
			{ path: "/moredetail", name: "moredetail", meta: { title: "航班详情", noAlive: true }, component: MoreDetailPage },
			{ path: "/airlines", meta: { title: "航班动态" }, component: Airlines }
		]
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
	document.title = to.meta.title || "airports_management";
	if (to.path == "/login") return next(); // 如果访问登录页则继续
	const tokenStr = window.sessionStorage.getItem("token");
	if (!tokenStr) return next("/login"); // 如果没有token访问其他页跳转至登录页
	next(); // 如果有token正常访问
});

export default router;
