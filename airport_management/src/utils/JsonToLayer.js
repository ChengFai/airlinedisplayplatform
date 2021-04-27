export default {
	// 根据json生成featurelayer，需要填充feature属性
	/*
    {
      "attributes" : {
        "FID" : 0,
        "x" : 121.346817,
        "y" : 31.203347000000001
      },
      "geometry" : {
        "x" : 121.346817,
        "y" : 31.203347000000001
      }
    },
  */
	_featureSetTemplate: {
		displayFieldName: "",
		fieldAliases: {
			FID: "FID",
			x: "x",
			y: "y"
		},
		geometryType: "esriGeometryPoint",
		spatialReference: {
			wkid: 4326,
			latestWkid: 4326
		},
		fields: [
			{
				name: "FID",
				type: "esriFieldTypeOID",
				alias: "FID"
			},
			{
				name: "x",
				type: "esriFieldTypeDouble",
				alias: "x"
			},
			{
				name: "y",
				type: "esriFieldTypeDouble",
				alias: "y"
			}
		],
		features: []
	},
	/*
    [
      {
        x: "number",
        y: "number"
      }
    ]
  */
	jsonToFeatureSet(arr) {
		// let featureSet = this._featureSetTemplate;
		let features = [];
		for (let i in arr) {
			features.push({
				attributes: {
					ObjectID: i,
					numb: 1,
					x: Number(arr[i].x),
					y: Number(arr[i].y)
				},
				geometry: {
					type: "point",
					x: Number(arr[i].x),
					y: Number(arr[i].y)
				}
			});
		}
		return features;
	}
};
