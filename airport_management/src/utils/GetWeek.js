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
	}
};
