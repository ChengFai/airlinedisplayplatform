export default {
	_PolylineTrailLinkMaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
		this._color = undefined;
		this._colorSubscription = undefined;
		this.color = color; // 颜色
		this.duration = duration || 3000; // 持续时间
		this._time = new Date().getTime();
		this.isTranslucent = function() {
			return true;
		};
  }
};