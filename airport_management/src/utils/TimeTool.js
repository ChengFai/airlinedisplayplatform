export default {
	// 根据三位星期英文字母返回数字
	getWeekNumb(weekStr) {
		switch (weekStr) {
			case "Mon":
				return 0;
			case "Tue":
				return 1;
			case "Wed":
				return 2;
			case "Thu":
				return 3;
			case "Fri":
				return 4;
			case "Sat":
				return 5;
			case "Sun":
				return 6;
			default:
				console.log("星期类型错误");
				return null;
		}
	},
	// 根据三位星期英文字母返回汉字
	getWeekCharacter(weekStr) {
		switch (weekStr) {
			case "Mon":
				return "一";
			case "Tue":
				return "二";
			case "Wed":
				return "三";
			case "Thu":
				return "四";
			case "Fri":
				return "五";
			case "Sat":
				return "六";
			case "Sun":
				return "日";
			default:
				console.log("星期类型错误");
				return null;
		}
	},
	// 根据三位月份英文字母返回数字
	getMonthNumb(monthStr) {
		switch (monthStr) {
			case "Jan":
				return 1;
			case "Feb":
				return 2;
			case "Mar":
				return 3;
			case "Apr":
				return 4;
			case "May":
				return 5;
			case "Jun":
				return 6;
			case "Jul":
				return 7;
			case "Aug":
				return 8;
			case "Sept":
				return 9;
			case "Oct":
				return 10;
			case "Nov":
				return 11;
			case "Dec":
				return 12;
			default:
				console.log("月份类型错误");
				return null;
		}
	},
	// 获取当前星期
	getWeekday() {
		const date = new Date();
		return date.getDay() - 1;
	},
	// 获取当前时间
	getTime() {
		const date = new Date();
		const hour = date.getHours() > 9 ? `${date.getHours()}` : `0${date.getHours()}`;
		const min = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
		return hour + ":" + min;
	},
	// 时间字符串转数字
	timeToNumb(timeStr) {
		// 格式：19:20
		const array = timeStr.split(":");
		return parseInt(array[0]) + parseInt(array[1]) * 0.01;
	}
};
