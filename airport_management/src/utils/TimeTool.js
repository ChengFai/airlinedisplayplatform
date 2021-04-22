export default {
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
	getTime() {
		const date = new Date();
		const hour = date.getHours() > 9 ? `${date.getHours()}` : `0${date.getHours()}`;
		const min = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
		return hour + ":" + min;
	},
	timeToNumb(timeStr) {
		// 格式：19:20
		const array = timeStr.split(":");
		return parseInt(array[0]) + parseInt(array[1]) * 0.01;
	}
};
