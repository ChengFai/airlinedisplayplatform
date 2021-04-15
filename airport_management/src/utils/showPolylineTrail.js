const path = require("path");

export default {
	// 根据起点终点生成曲线
	_generateCurve(startPoint, endPoint) {
		let addPointCartesian = new Cesium.Cartesian3();
		Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);
		let midPointCartesian = new Cesium.Cartesian3();
		Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
		let midPointCartographic = Cesium.Cartographic.fromCartesian(midPointCartesian);
		midPointCartographic.height = Cesium.Cartesian3.distance(startPoint, endPoint) / 10;
		let midPoint = new Cesium.Cartesian3();
		Cesium.Ellipsoid.WGS84.cartographicToCartesian(midPointCartographic, midPoint);
		let spline = new Cesium.CatmullRomSpline({
			times: [0.0, 0.5, 1.0],
			points: [startPoint, midPoint, endPoint]
		});
		let curvePointsArr = [];
		for (let i = 0, len = 300; i < len; i++) {
			curvePointsArr.push(spline.evaluate(i / len));
		}
		return curvePointsArr;
	},

	// 绘制
	generateMigrationMap(viewer, data, data_geo) {
		viewer.entities.removeAll();
		if (!data) {
			return;
		}
		for (let geoLine of data) {
			let startName = geoLine.startAirport;
			let destinationName = geoLine.endAirport;
			let airlineNumb = geoLine.numb;
			// 用于拟合当前曲线的笛卡尔坐标点数组
			let startPt = Cesium.Cartesian3.fromDegrees(data_geo[startName][0], data_geo[startName][1], 0);
			let endPt = Cesium.Cartesian3.fromDegrees(data_geo[destinationName][0], data_geo[destinationName][1], 0);
			let curLinePointsArr = this._generateCurve(startPt, endPt);
			viewer.entities.add({
				// 背景线
				description: "background-line",
				name: startName + " -> " + destinationName + " " + airlineNumb + "人",
				polyline: {
					width: 1,
					positions: curLinePointsArr,
					material: new Cesium.PolylineDashMaterialProperty({
						color: new Cesium.Color(255 / 255, 249 / 255, 0, 0.2)
					})
				}
			});

			viewer.entities.add({
				// 尾迹线
				description: "trail-line",
				name: startName + " -> " + destinationName + " " + airlineNumb + "人",
				polyline: {
					width: 3,
					positions: curLinePointsArr,
					material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
				}
			});

			viewer.entities.add({
				// 起点
				description: "start-point",
				name: startName,
				position: Cesium.Cartesian3.fromDegrees(data_geo[startName][0], data_geo[startName][1]),
				point: {
					color: new Cesium.Color(255 / 255, 249 / 255, 0, 1),
					pixelSize: 5
				}
			});

			viewer.entities.add({
				// 终点
				description: "end-point",
				name: destinationName,
				position: Cesium.Cartesian3.fromDegrees(data_geo[destinationName][0], data_geo[destinationName][1]),
				point: {
					color: new Cesium.Color(251 / 255, 7 / 255, 0, 0.7),
					pixelSize: 10
				}
			});
		}
	}
};
