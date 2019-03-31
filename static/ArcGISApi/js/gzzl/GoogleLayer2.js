define(["dojo/_base/declare", "esri/layers/tiled"], function(declare) {
	return declare(esri.layers.TiledMapServiceLayer, {
		GetMapWay: "OnlineMap", //地图是否在线,OnlineMap,LocalMap,CustomerMap客户自定义的切片地图，DPMap,大鹏地图
		wkid: 102113,
		tileUrl: '',
		origin: {
			"x": -20037508.342787,
			"y": 20037508.342787
		},
		lods: [{
				"level": 0,
				"resolution": 156543.033928,
				"scale": 591657527.591555
			},
			{
				"level": 1,
				"resolution": 78271.5169639999,
				"scale": 295828763.795777
			},
			{
				"level": 2,
				"resolution": 39135.7584820001,
				"scale": 147914381.897889
			},
			{
				"level": 3,
				"resolution": 19567.8792409999,
				"scale": 73957190.948944
			},
			{
				"level": 4,
				"resolution": 9783.93962049996,
				"scale": 36978595.474472
			},
			{
				"level": 5,
				"resolution": 4891.96981024998,
				"scale": 18489297.737236
			},
			{
				"level": 6,
				"resolution": 2445.98490512499,
				"scale": 9244648.868618
			},
			{
				"level": 7,
				"resolution": 1222.99245256249,
				"scale": 4622324.434309
			},
			{
				"level": 8,
				"resolution": 611.49622628138,
				"scale": 2311162.217155
			},
			{
				"level": 9,
				"resolution": 305.748113140558,
				"scale": 1155581.108577
			},
			{
				"level": 10,
				"resolution": 152.874056570411,
				"scale": 577790.554289
			},
			{
				"level": 11,
				"resolution": 76.4370282850732,
				"scale": 288895.277144
			},
			{
				"level": 12,
				"resolution": 38.2185141425366,
				"scale": 144447.638572
			},
			{
				"level": 13,
				"resolution": 19.1092570712683,
				"scale": 72223.819286
			},
			{
				"level": 14,
				"resolution": 9.55462853563415,
				"scale": 36111.909643
			},
			{
				"level": 15,
				"resolution": 4.77731426794937,
				"scale": 18055.954822
			},
			{
				"level": 16,
				"resolution": 2.38865713397468,
				"scale": 9027.977411
			},
			{
				"level": 17,
				"resolution": 1.19432856685505,
				"scale": 4513.988705
			},
			{
				"level": 18,
				"resolution": 0.597164283559817,
				"scale": 2256.994353
			}
		],
		Extent: {
			minX: -20037508.342787,
			minY: -20037508.342787,
			maxX: 20037508.342787,
			maxY: 20037508.342787
		},
		rows: 256,
		cols: 256,
		constructor: function(args) {
			declare.safeMixin(this, args);
			var self = this;
			switch(self.GetMapWay) {
				case "DPMap":
					self.origin = {
						"x": -400,
						"y": 400
					};
					self.wkid = 4490;
					self.Extent = {
						minX: -180.0,
						minY: -90.0,
						maxX: 180.0,
						maxY: 90.0
					};
					self.lods = [{
							"level": 0,
							"resolution": 0.001373291015625,
							"scale": 577143.73644287116
						},
						{
							"level": 1,
							"resolution": 0.0006866455078125,
							"scale": 288571.86822143558
						},
						{
							"level": 2,
							"resolution": 0.00034332275390625,
							"scale": 144285.93411071779
						},
						{
							"level": 3,
							"resolution": 0.000171661376953125,
							"scale": 72142.967055358895
						},
						{
							"level": 4,
							"resolution": 8.58306884765625e-005,
							"scale": 36071.483527679447
						},
						{
							"level": 5,
							"resolution": 4.291534423828125e-005,
							"scale": 18035.741763839724
						},
						{
							"level": 6,
							"resolution": 2.1457672119140625e-005,
							"scale": 9017.8708819198619
						},
						{
							"level": 7,
							"resolution": 1.0728836059570313e-005,
							"scale": 4508.9354409599309
						},
						{
							"level": 8,
							"resolution": 5.3644180297851563e-006,
							"scale": 2254.4677204799655
						},
						{
							"level": 9,
							"resolution": 2.682209014892579e-006,
							"scale": 1127.23386023998275
						},
						{
							"level": 10,
							"resolution": 1.3411045074462895e-006,
							"scale": 563.616930119991375
						}
					];
					break;
			}

			this.spatialReference = new esri.SpatialReference({
				wkid: self.wkid
			});
			this.initialExtent = (this.fullExtent = new esri.geometry.Extent(self.Extent.minX, self.Extent.minY, self.Extent.maxX, self.Extent.maxY, this.spatialReference));
			this.tileInfo = new esri.layers.TileInfo({
				"rows": self.rows,
				"cols": self.cols,
				"compressionQuality": 0,
				"origin": self.origin,
				"spatialReference": {
					"wkid": self.wkid
				},
				"lods": self.lods
			});

			this.loaded = true;
			this.onLoad(this);
		},
		getTileUrl: function(level, row, col) {
			var url = "http://webrd0" + ((col % 4) + 1) + ".is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x=" + col + "&y=" + row + "&z=" + level;
			switch(this.GetMapWay) {
				case "OnlineMap":
					break;
				case "LocalMap":
					url = "/Map/" + level + "/" + col + "/" + row + ".png";
					break;
				case "CustomerMap":
					url = this.tileUr.format({
						level: level,
						row: row,
						col: col
					});
					break;
				case "DPMap": //大鹏地图
					url = "'http://192.168.65.109:6160/igs/rest/mrms/tile/szmap_4490/{level}/{row}/{col}?size=256&token=50e8bd1c-1de9-4b03-88d2-f149584e8174';
					url = url.format({
						level: level,
						row: row,
						col: col
					});
					break;
				default:
					url = "http://webrd0" + ((col % 4) + 1) + ".is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x=" + col + "&y=" + row + "&z=" + level;
					break;
			}

			return url;
		}
	});
});