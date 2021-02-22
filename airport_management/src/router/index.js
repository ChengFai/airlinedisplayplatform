import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import("../views/Login");
const Home = () => import("../views/Home");
const Map = () => import("../views/map/Map");
const Airports = () => import("../views/airports/Airports");
const Airlines = () => import("../views/airlines/Airlines");

Vue.use(VueRouter);

const routes = [
	{ path: "/", redirect: "/login" },
	{ path: "/login", component: Login },
	{
		path: "/home",
		component: Home,
		redirect: "/airports",
		children: [
			{ path: "/map", component: Map },
			{ path: "/airports", component: Airports },
			{ path: "/airlines", component: Airlines }
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
	if (to.path == "/login") return next(); // 如果访问登录页则继续
	const tokenStr = window.sessionStorage.getItem("token");
	if (!tokenStr) return next("/login"); // 如果没有token访问其他页跳转至登录页
	next(); // 如果有token正常访问
});

export default router;
