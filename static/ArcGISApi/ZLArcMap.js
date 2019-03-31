//经纬度转墨卡托
function lonlat2mercator(lonlat) {
	var mercator = {
		x: 0,
		y: 0
	};
	var x = lonlat.x * 20037508.34 / 180;
	var y = Math.log(Math.tan((90 + lonlat.y) * Math.PI / 360)) / (Math.PI / 180);
	y = y * 20037508.34 / 180;
	mercator.x = x;
	mercator.y = y;
	return mercator;
}

//墨卡托转经纬度
function mercator2lonlat(mercator) {
	var lonlat = {
		x: 0,
		y: 0
	};
	var x = mercator.x / 20037508.34 * 180;
	var y = mercator.y / 20037508.34 * 180;
	y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
	lonlat.x = x;
	lonlat.y = y;
	return lonlat;
}

function outOfChina(lat, lng) {
	if((lng < 72.004) || (lng > 137.8347)) {
		return true;
	}
	if((lat < 0.8293) || (lat > 55.8271)) {
		return true;
	}
	return false;
}

function transformLat(x, y) {
	var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
	ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
	return ret;
}

function transformLon(x, y) {
	var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
	ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
	return ret;
}

function delta(lat, lng) {
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
	var dLat = transformLat(lng - 105.0, lat - 35.0);
	var dLng = transformLon(lng - 105.0, lat - 35.0);
	var radLat = lat / 180.0 * Math.PI;
	var magic = Math.sin(radLat);
	magic = 1 - ee * magic * magic;
	var sqrtMagic = Math.sqrt(magic);
	dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
	dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
	return {
		"lat": dLat,
		"lng": dLng
	};
}

function wgs2gcj(wgsLat, wgsLng) {
	if(outOfChina(wgsLat, wgsLng)) {
		return {
			"lat": wgsLat,
			"lng": wgsLng
		};
	}
	var d = delta(wgsLat, wgsLng);
	return {
		"lat": wgsLat - (-d.lat),
		"lng": wgsLng - (-d.lng)
	};
}

function gcj2wgs(gcjLat, gcjLng) {
	if(outOfChina(gcjLat, gcjLng)) {
		return {
			"lat": gcjLat,
			"lng": gcjLng
		};
	}
	var d = delta(gcjLat, gcjLng);
	return {
		"lat": gcjLat - d.lat,
		"lng": gcjLng - d.lng
	};
}

function gcj2wgs_exact(gcjLat, gcjLng) {
	var initDelta = 0.01;
	var threshold = 0.000001;
	var dLat = initDelta,
		dLng = initDelta;
	var mLat = gcjLat - dLat,
		mLng = gcjLng - dLng;
	var pLat = gcjLat + dLat,
		pLng = gcjLng + dLng;
	var wgsLat, wgsLng;
	for(var i = 0; i < 30; i++) {
		wgsLat = (mLat + pLat) / 2;
		wgsLng = (mLng + pLng) / 2;
		var tmp = wgs2gcj(wgsLat, wgsLng)
		dLat = tmp.lat - gcjLat;
		dLng = tmp.lng - gcjLng;
		if((Math.abs(dLat) < threshold) && (Math.abs(dLng) < threshold)) {
			return {
				"lat": wgsLat,
				"lng": wgsLng
			};
		}
		if(dLat > 0) {
			pLat = wgsLat;
		} else {
			mLat = wgsLat;
		}
		if(dLng > 0) {
			pLng = wgsLng;
		} else {
			mLng = wgsLng;
		}
	}
	return {
		"lat": wgsLat,
		"lng": wgsLng
	};
}

function distance(latA, lngA, latB, lngB) {
	var earthR = 6371000;
	var x = Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.cos((lngA - lngB) * Math.PI / 180);
	var y = Math.sin(latA * Math.PI / 180) * Math.sin(latB * Math.PI / 180);
	var s = x + y;
	if(s > 1) {
		s = 1;
	}
	if(s < -1) {
		s = -1;
	}
	var alpha = Math.acos(s);
	var distance = alpha * earthR;
	return distance;
}

$.extend($, {
	eviltransform: {
		wgs2gcj: wgs2gcj,
		gcj2wgs: gcj2wgs,
		gcj2wgs_exact: gcj2wgs_exact,
		distance: distance
	}
});

(function($) {
	$.fn.ZLMap = function(options) {
		var defaults = {
			isShowJW: true, //显示经纬度
			Elements: [],
			city: false, //是否显示行政区划
			tool: false, //是否显示工具条
			layerTools: true,
			prePoint: {
				x: 0,
				y: 0
			},
			MapWay: "OnlineMap", //LocalMap
			layers: [],
			titles: {
				"0035000": "控制箱",
				"0036000": "路灯",
				"0071000": "专变",
				"0177000": "路灯变"
			}
			//事件,MouseClick,MouseMove
			//newLayer
			//获取map对象
			//获取地图对象
			//Elements 要加载的要素数据图层数据 ['0036000','0035000']，
		};

		this.Method = {
			init: function(holder, options) {
				var self = this;
				self.options = options || {};
				self.layers = {};
				self.box = holder;
				if(!self.box) {
					throw "实例 ZLMap 时需要指定 element";
				}
				self.options.path = self.getPath();
				var MapID = $(holder).attr("id");
				require(["esri/map", "gzzl/GoogleLayer", "gzzl/PFLayer", "gzzl/SatelliteLayer", "esri/geometry/Point", "esri/geometry/Polygon", "esri/toolbars/draw", "esri/toolbars/edit", "dojo/_base/event", "dojo/domReady!"],
					function(Map, GoogleLayer, ZLLayer, SatelliteLayer, Point, Polygon, Draw, Edit, event) {
						var map;
						var Marker;
						var layerDict = {};
						var baselayer;
						var baseSatelayer;
						var infoLayer;
						map = new Map(MapID, {
							logo: false
						});
						
						if(self.options.MapWay != 'DPMap') {
							map.setZoom(14);
						} else {
							map.setZoom(7);
						}
						map.on("load", function() {
							options.point.isShow = false;
							self.PanTo(options.point);
							self.Load();
						});

						baselayer = new GoogleLayer({
							GetMapWay: self.options.MapWay,
							id: 'baselayer'
						});
						baseSatelayer = new SatelliteLayer({
							visible: false,
							id: 'baseSatelayer'
						});

						self.options.map = map;
						self.layers.baselayer = baselayer;
						self.layers.baseSatelayer = baseSatelayer;

						map.addLayer(baselayer);
						map.addLayer(baseSatelayer);

						var cityLayer = new esri.layers.GraphicsLayer({
							visible: false,
							id: "cityLayer"
						});
						self.layers.cityLayer = cityLayer;
						map.addLayer(cityLayer);
						self.initCityLayer();

						var arrs = ["0036000", "0035000", "0071000", "0177000", "0519000", "0167000"];
						$.each(arrs, function(key, value) {
							var layer = new ZLLayer({
								GetMapWay: self.options.MapWay,
								ElementCode: value,
								cache: false,
								visible: false,
								id: "" + value
							});
							self.layers[value] = layer;
							map.addLayer(layer);
						});

						infoLayer = new esri.layers.GraphicsLayer();
						self.layers.infoLayer = infoLayer;
						map.addLayer(infoLayer);

						dojo.connect(cityLayer, "onMouseOver", function(evt) {
							//evt.graphic.attributes.Name
						});

						if(self.options.tool == true) {

							var drawLayer = new esri.layers.GraphicsLayer({
								visible: true,
								id: "drawLayer"
							});
							self.layers.drawLayer = drawLayer;
							map.addLayer(drawLayer);

							var editToolbar = new Edit(map);
							self.editToolbar = editToolbar;

							drawLayer.on("dbl-click", function(evt) {
								event.stop(evt);
								editToolbar.activate(Edit.EDIT_VERTICES, evt.graphic);

							});

							drawLayer.on("click", function(evt) {
								event.stop(evt);
								editToolbar.deactivate();
							})

						}

						self.initElement();
						self.initEvent();
						self.layerShow(self.options.Elements);

					});
			},
			initElement: function() {
				var self = this;
				if(self.options.isShowJW == true) {
					var $html = '<div  class="noselect"   style="background-color:rgba(29,28,28,.75);color:#fff;width:200px;position:absolute;z-index:10;right:10px;bottom:10px;line-height:25px;text-align:center"><ul style="text-align: center;text-align: left;"><li><label><input name="Map" type="radio" value="Street" checked="checked"   >街道图</label><label><input name="Map" type="radio" value="Satellite"  >卫星图</label></li><li><span id="span_pointlng"></span></li><li><span id="span_pointlat"></span></li></ul></div>';

					if(self.options.tool == true) {
						$html += '<div style="position:absolute;right:20px;top:20px;width:270px;z-index:1;" class="row clearfix"><div class="col-md-12 column"><div class="btn-group"><button class="btn btn-default" type="button" data-tool="tool" data-val="拉框"><em class="glyphicon  glyphicon-retweet"></em> 拉框</button><button class="btn btn-default" type="button" data-tool="tool" data-val="清除"><em class="glyphicon glyphicon-repeat" ></em> 清除</button> <button class="btn btn-default" type="button" data-tool="tool" data-val="分析"><em class="glyphicon glyphicon-search" ></em> 分析</button> </div></div></div>';
					}

					if(self.options.Elements.length > 0 && self.options.layerTools == true) {
						$html += '<div  class="noselect"   style="height:auto;background-color:#fff;width:130px;position:absolute;z-index:15;left:430px;top:20px;"> <div style="height:40px;border-bottom:1px solid #999;text-align:center;line-height:40px;cursor:pointer;" data-layer="layercotrol" data-show="false"><span style="font-weight:bolder;color:gray;padding-top:10px;font-size:16px;">显示控制</span></div><ul class="list-group" style="display:none;">';
						var title = "";

						if(self.options.city == true) {
							$html += '<li class ="list-group-item" style="list-style-type:none;padding: 2px 5px;"> <label for="GIS_city_Check"><input type="checkbox" id="GIS_city_Check" value="cityLayer"  />行政区划</label></li>';
						}

						$.each(self.options.Elements, function(index, value, array) {
							if(typeof(self.options.titles[value] != "undefined")) {
								$html += '<li class ="list-group-item" style="list-style-type:none;padding: 2px 5px;"> <label for="GIS_' + value + '_Check"><input type="checkbox" checked="checked" id="GIS_' + value + '_Check" value="' + value + '"  /> ' + self.options.titles[value] + '</label></li>';
							}
						});
						$html += "</ul></div>";
					}

					$(self.box).append($html);
					$(self.box).append(self.getTip());
					$(self.box).find('[name="Map"]').change(function() {
						self.layers.baselayer.hide();
						self.layers.baseSatelayer.hide();
						switch($(this).val()) {
							case "Street":
								self.layers.baselayer.show();
								break;
							case "Satellite":
								self.layers.baseSatelayer.show();
								break;
						}
					});

					$(self.box).find('[type="checkbox"]').change(function() {
						var layerCode = $(this).val();
						var arr = [];
						arr.push(layerCode);
						if($(this).prop("checked") == true) {
							self.layerShow(arr);
						} else {
							self.layerHide(arr);
						}
					});

					$(self.box).find('[data-layer="layercotrol"]').click(function() {
						var isShow = $(this).attr("data-show");
						if(typeof(isShow) == 'undefined' || isShow == 'false') {
							$(this).attr("data-show", "true");
							$(this).next().show(500);
						} else {
							$(this).attr("data-show", "false");
							$(this).next().hide(500);
						}
					});

					var map = self.options.map;
					var drawLayer = self.getLayer("drawLayer");
					var editToolbar = self.editToolbar;
					var toolbar = new esri.toolbars.Draw(map);

					//结束拉框
					dojo.connect(toolbar, "onDrawEnd", function(geometry) {
						toolbar.deactivate();
						var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#ea5c5c"), 2), new dojo.Color());

						var color = new esri.Color("#ea5c5c")
						color.a = 0.2;
						symbol.setColor(color)

						var graphic = new esri.Graphic(geometry, symbol);
						drawLayer.add(graphic);

					});

					//拉框事件
					$(self.box).find('[data-tool="tool"]').click(function() {

						switch($(this).attr("data-val")) {

							case "拉框":
								drawLayer.clear();
								toolbar.activate(esri.toolbars.Draw.POLYGON);
								editToolbar.deactivate();
								break;

							case "清除":
								drawLayer.clear();
								editToolbar.deactivate();
								break;

							case "分析":
								toolbar.finishDrawing();
								var graphics = drawLayer.graphics;
								editToolbar.deactivate();
								var Arry = graphics[0].geometry.rings[0];

								var ArryLonLat = new Array();
								for(var i = 0; i < Arry.length; i++) {
									var arr = Arry[i];
									var x = Arry[i][0];
									var y = Arry[i][1];
									var mercator = {
										x: x,
										y: y
									};
									var point = mercator2lonlat(mercator);
									var lonlat = gcj2wgs(point.y, point.x);
									lonlat.lat = lonlat.lat.toFixed(7);
									lonlat.lng = lonlat.lng.toFixed(7);
									var obj = {
										jd: lonlat.lng,
										wd: lonlat.lat
									};

									ArryLonLat.push(obj);
								}
								self.AnalysisData(ArryLonLat);
								break;
						}
					});

					$("#arcgis_tip_div").find('.map-3d-nav10').click(function() {
						if(self.options.MarkClickEvent) {
							self.options.MarkClickEvent($(this).attr('data-Code'));
						}
					});
				}
			},
			initCityLayer: function() {
				var self = this;
				var cityLayer = self.getLayer("cityLayer");

				if(self.options.city == true) {
					$('#mapDiv_baseSatelayer').after($('#cityLayer_layer').parent());

					$.ajax({
						url: self.options.path + '/gDataInterface/DataHandler.ashx',
						type: 'POST',
						data: {
							active: "GetCityPolygon"
						},
						dataType: 'json',
						timeout: 700,
						success: function(data) {
							if(data) {
								$.each(data, function(index, value, array) {
									var attr = {
										"Name": value.name,
										"Code": value.code,
										"Color": new dojo.Color("#436EEE")
									};
									var polygonJson = {
										"rings": [value.pts],
										"spatialReference": {
											"wkid": 102100
										} //a为 [[[]]] 格式
									};
									var polygon = new esri.geometry.Polygon(polygonJson);
									var colorA = new dojo.Color("#104E8B");
									colorA.a = 0.15;
									var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 1.5);
									var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, colorA);
									//symbol.setColor(color)
									var graphic = new esri.Graphic(polygon, fillSymbol, attr);
									cityLayer.add(graphic);
								});

							}
						}
					});
				}
			},
			initEvent: function() {
				var self = this;
				var map = self.options.map;
				map.on("mouse-move", function(evt) {
					var mercator = {
						x: evt.mapPoint.x,
						y: evt.mapPoint.y
					};
					self.showCoordinates(mercator);
					//self.MouseMove(mercator);
				});

				map.on("click", function(evt) {
					var mercator = {
						x: evt.mapPoint.x,
						y: evt.mapPoint.y
					};
					self.MouseMove(mercator);
				});

				function MapChange(panend, extent) {
					if(self.options.currentTipValue) {
						var movedelta = panend.delta;
						self.updateTip(self.options.currentTipValue, movedelta);
					}
				}
				map.on("pan", MapChange);
				map.on("zoom", MapChange);

				dojo.connect(map, "onExtentChange", function(extent, delta, outLevelChange, outLod) {
					if(self.options.currentTipValue) {
						self.updateTip(self.options.currentTipValue);
					}
					if(typeof(self.layers.infoLayer) != 'undefined') {
						if(outLod.level >= 16) {
							self.layers.infoLayer.show();
						} else {
							self.layers.infoLayer.hide();
						}
					}
				});

				map.on("click", function(evt) {
					var gcj02 = mercator2lonlat(evt.mapPoint);
					var wgs = gcj2wgs(gcj02.y, gcj02.x);
					self.MouseClick(wgs, gcj02, evt.mapPoint);
				});

			},
			Load: function() {
				var self = this;
				if(typeof(self.options.Load) != 'undefined') {
					setTimeout(function() {
						self.options.Load();
					}, 200);
				}
			},
			newLayer: function(layerID) {
				var self = this;
				var layer = new esri.layers.GraphicsLayer();
				self.layers[layerID] = layer;
				map.addLayer(layer);
				return layer;
			},
			MouseClick: function(wgs, gcj02, mercator) {
				var self = this;
				if(self.options.MouseClick) {
					self.options.MouseClick(wgs, gcj02, mercator);
				}
			},
			MouseMove: function(mercator) {
				var self = this;
				var map = self.options.map;

				if(self.options.MapWay != 'DPMap') {
					var gcj02 = mercator2lonlat(mercator);
					if(self.options.MouseMove) {
						var wgs = gcj2wgs(gcj02.y, gcj02.x);
						self.options.MouseMove(wgs);
					}

					var prePoint = self.options.prePoint;
					var currentPoint = {
						x: gcj02.x,
						y: gcj02.y
					};
					var xp = {
						x: Math.abs(prePoint.x - currentPoint.x),
						y: Math.abs(prePoint.y - currentPoint.y)
					};
					if(xp.x > 0.000008 || xp.y > 0.000008) {
						self.options.prePoint = currentPoint;

						var level = map.getLevel();
						if(level >= 17) {
							self.getPointInfo(gcj02, true);
						}
					}
				} else {
					if(self.options.MouseMove) {
						self.PanTo({
							lon: mercator.x,
							lat: mercator.y
						});
					}
					var level = map.getLevel() + 10;
					if(level >= 15) {
						self.getPointInfo({
							x: mercator.x,
							y: mercator.y
						}, true);
					}
				}
			},
			MarkClickEvent: function(point) {
				var self = this;
				//if (self.options.MarkClickEvent) {
				//    self.getPointInfo(point, true);
				//}
			},
			updateTip: function(value, movedelta) {
				var self = this;
				var map = self.options.map;
				var level = map.getLevel();
				if(self.options.MapWay == 'DPMap') {
					level += 10;
				}

				if(level >= 15) {
					if(value) {
						self.options.currentTipValue = value;
						$("#arcgis_tip_div").show(200);
						var isShow = false;
						var strE = self.options.Elements.join(",");
						var ElementCode = value.ID.substring(0, 7);

						if(strE.indexOf(ElementCode) >= 0) {
							$("#arcgis_tip_div").find(".map-3d-nav10").attr("data-Code", value.ID);
							var mercator;

							if(self.options.MapWay == 'DPMap') {
								mercator = value.wgs;
							}
							else
							{
								mercator = value.mercator;
							}

							var screenPoint = map.toScreen({
								x: mercator.X,
								y: mercator.Y
							});
							if(typeof(movedelta) != 'undefined') {
								screenPoint.x = screenPoint.x + movedelta.x;
								screenPoint.y = screenPoint.y + movedelta.y;
							}

							var name = value.name;
							if(name) {
								var strlen = self.gblen(name);
								var top = screenPoint.y - 36 - 24;
								var left = screenPoint.x - strlen * 5;
								$("#arcgis_tip_div").find('span').html(name);
								$("#arcgis_tip_div").css({
									"width": strlen * 10 + "px",
									"top": top + "px",
									"left": left + "px",
									"font-size": "16px"
								});
							}
						}
					}
				} else {
					$("#arcgis_tip_div").hide();
				}
			},
			gblen: function(str) {
				var len = 0;
				//JS判断字符串长度
				for(var i = 0; i < str.length; i++) {
					var c = str.charCodeAt(i);
					if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
						len++;
					} else {
						len += 2;
					}
				}
				return len;
			},
			getTip: function() {
				return '<div  class="noselect"  id="arcgis_tip_div" style="text-align:center;position:absolute;left:-200px;top:-200px;"><div style="height: 20px;min-height:22px;border-radius:5px;border: 1px solid #5CACEE;background-color:white;text-align:center;font-size:16px;min-width:30px;"><span>东风路0xxxx13xxxxxx</span></div><div><img  class="noselect"  style="height:16px;margin-top:-10px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAQCAMAAADd04TjAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACylBMVEUAAABIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNxIoNwAAAB/GVqjAAAA7XRSTlMAABENAAAAAAAHFQAAaZcOAAAAAAAEeoIAABuulwwAAAAAAAN2wy8AAAAbsZMLAAAAAAACcsQxAAAAAAAds5AKAAAAAAFuxjQAAAAAAAAftowIAAAAAAFqxzcAAAAAAAAiuYgHAAAAAABmyDsAAAAAAAAku4QGAAAAAABiyT4AAAAAAAAnvYAFAAAAAABeykIAAAAAAAAqv3wEAAAAAABay0UAAAAAAAAtwXgDAAAAAFfLSQAAAAAAADDDdAIAAFPLTAAAAAAAADPFcAFPzFAAAAAAAAA2xJvIVAAAAAAAADnAVwAAAAAAABQCAADlDCviAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAABLAAAASwAc4jpUgAAAAd0SU1FB+AJGhccJ7IwOWsAAAEySURBVBjTY2BkYmZhZWPAAOwcnFzcDDy8fPwCgkLoksIiomLiEgySUtIysnLyCqiSikrKKqpq6gwamlraOrp6+gbIkoZGxiamZuYWDJZW1ja2dvYOjkiSTs4urm7uHp5eDAzePr5+/gGBQcFwyZDQsPCIyKjoGBAnNi4+ITEpOSUVKpmWnpGZlZ2Tmwfh5hcUFhWXlJaVg3kVlVXVNbV19Q0woxqbmlta29o7OoHsru6e3r7+CRMnIZwxecrUadNnzJw1m2HO3HnzFyxctHgJsheWLlu+YuWq1WvWrlu/YeOmzVu2onp/2/YdO3ft3rN33/4DBw8dPoIedEePHT9x8tTpM2fPnb9wETPYL12+cvXa9Rs3b92+w4AF3L13/8HDR4+fPGXACp49f/Hy1es3SCIAFldtP2DK2mgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMTEtMTJUMTE6MjU6MDYrMDg6MDD1m2MSAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA5LTI2VDIzOjI4OjM5KzA4OjAw6YfihAAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAY3RFWHRzdmc6Y29tbWVudAAgR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICDT3YPcAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAAxNDVrl5q7AAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADI2OcGgWhYAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ3NDkwMzcxOYJBG6kAAAASdEVYdFRodW1iOjpTaXplADIuMDZLQl0hVfsAAABfdEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvc2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzEyMDU0LzEyMDU0MDYucG5nf+Ln/AAAAABJRU5ErkJggg==" /></div><div class="map-3d-nav10" style="width:32px;height:25px;margin:0 auto; cursor:pointer;margin-top:-65px;border:none;" /></div></body>';
			},
			getPointInfo: function(point, isMarkClick) {
				var self = this;
				var map = self.options.map;
				var level = map.getLevel();

				var Soordinatetype = "gcj02";
				if(self.options.MapWay == 'DPMap') {
					level += 10;
					Soordinatetype = "wgs84";
				}

				setTimeout(function() {
					self.options.isAjax = true;
				}, 300);
				if(true == isMarkClick) {
					self.options.isAjax == true;
				}
				if(true == self.options.isAjax && self.options.Elements.length > 0) {
					var tmpElementCodes = [];
					$.each(self.options.Elements, function(index, value, array) {
						if(self.layers[value].visible == true) {
							tmpElementCodes.push(value);
						}
					});

					self.options.isAjax = false;
					if(tmpElementCodes.length > 0) {
						$.ajax({
							url: self.options.path + '/gDataInterface/DataHandler.ashx',
							type: 'POST',
							data: {
								active: "FindMark",
								Soordinatetype: Soordinatetype,
								level: level,
								ElementCodes: tmpElementCodes.join(","),
								lon: point.x,
								lat: point.y
							},
							dataType: 'json',
							timeout: 700,
							success: function(data) {
								if(data) {
									if(typeof(data["0035000"]) != "undefined") {
										self.updateTip(data["0035000"]);
									} else if(typeof(data["0071000"]) != "undefined") {
										self.updateTip(data["0071000"]);
									} else if(typeof(data["0177000"]) != "undefined") {
										self.updateTip(data["0177000"]);
									} else if(typeof(data["0036000"]) != "undefined") {
										self.updateTip(data["0036000"]);
									}
								}
							}
						});
					}
				}
			},
			getPath: function() {
				var strFullPath = window.document.location.href;
				var strPath = window.document.location.pathname;
				var pos = strFullPath.indexOf(strPath);
				var prePath = strFullPath.substring(0, pos);
				var path = "";
				var postPath = "";
				if(prePath.indexOf("localhost") >= 0) {
					path = prePath;
				} else {
					var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
					path = prePath + postPath;
				}
				return path;
			},
			layerShow: function(arr) {
				var self = this;
				if(arr) {
					$.each(arr, function(key, value) {
						if(self.layers[value]) {
							var layer = self.layers[value];
							layer.show();
						}
					});
				}
			},
			layerHide: function(arr) {
				var self = this;
				$("#arcgis_tip_div").hide();
				if(arr) {
					$.each(arr, function(key, value) {
						if(self.layers[value]) {
							var layer = self.layers[value];
							layer.hide();
						}
					});
				}
			},
			showCoordinates: function(mercator) {
				var self = this;
				if(self.options.MapWay != 'DPMap') {
					var point = mercator2lonlat(mercator);
					var lonlat = gcj2wgs(point.y, point.x);
					if(self.options.isShowJW == true) {
						dojo.byId("span_pointlng").innerHTML = "东经: " + lonlat.lng.toFixed(7);
						dojo.byId("span_pointlat").innerHTML = "北纬: " + lonlat.lat.toFixed(7);
					}
				} else {
					if(self.options.isShowJW == true) {
						dojo.byId("span_pointlng").innerHTML = "东经: " + mercator.x.toFixed(7);
						dojo.byId("span_pointlat").innerHTML = "北纬: " + mercator.y.toFixed(7);
					}
				}
			},
			PanTo: function(xpoint) {
				var self = this;
				var map = self.options.map;
				if(self.options.MapWay != 'DPMap') {
					var point = wgs2gcj(xpoint.lat, xpoint.lon);
					var mypoint = {
						x: point.lng,
						y: point.lat
					};
					mypoint = lonlat2mercator(mypoint);
					var pt = new esri.geometry.Point(mypoint.x, mypoint.y, map.spatialReference);
					map.centerAt(pt);
				} else {
					var pt = new esri.geometry.Point(xpoint.x, xpoint.y, map.spatialReference);
					map.centerAt(pt);
				}
			},
			MoveTo: function(xpoint) {
				var self = this;
				var map = self.options.map;
				var level = map.getLevel();

				if(self.options.MapWay == 'DPMap') {
					level += 10;
					var pt = new esri.geometry.Point(xpoint.lon, xpoint.lat, map.spatialReference);
					if(level < 16) {
						map.setZoom(8);
					}
					if(typeof(xpoint.isShow) == 'undefined') {
						xpoint.isShow = false;
					}
					if(typeof(self.layers.infoLayer) != 'undefined' && xpoint.isShow == true) {
						xpoint.mercator = {
							X: xpoint.lon,
							Y: xpoint.lat
						};
						xpoint.wgs = {
							X: xpoint.lon,
							Y: xpoint.lat
						};

						self.updateTip(xpoint);

						if(typeof(self.options.Marker) == 'undefined') {
							var symbol = new esri.symbol.PictureMarkerSymbol({
								url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVFhH7ZexDYAwDAQ/iDFo2ITNMwoUjIEIbxIhkKALmOJPsqK4sC/pHmdWICYgvVncMZZ1O0053XgS6AMQapbNzKOv/PYHPkMCEpCABCQgAQlIQAISkIAE3AUssx1YOmZjYIqdeV1ytxotZ3ecPfHVtznRIZ4DGxH/bnpSTNdKAAAAAElFTkSuQmCC',
								height: 32,
								width: 32,
								yoffset: 12
							});
							self.options.symbol = symbol;
							self.options.Marker = new esri.Graphic(pt, symbol);
							self.layers.infoLayer.add(self.options.Marker);
						} else {
							var height = 32 - (18 - level) * 3;
							var width = 32 - (18 - level) * 3;
							self.options.symbol.setHeight(height * 4 / 3);
							self.options.symbol.setWidth(width * 4 / 3);
							self.options.Marker.setGeometry(pt);
						}
					}
					map.centerAt(pt);

				} else {
					var point = wgs2gcj(xpoint.lat, xpoint.lon);
					var mypoint = {
						x: point.lng,
						y: point.lat
					};

					if(typeof(xpoint.isShow) == 'undefined') {
						xpoint.isShow = false;
					}

					mypoint = lonlat2mercator(mypoint);
					var pt = new esri.geometry.Point(mypoint.x, mypoint.y, map.spatialReference);
					if(level < 16) {
						map.setZoom(18);
					}

					if(typeof(self.layers.infoLayer) != 'undefined' && xpoint.isShow == true) {
						xpoint.mercator = {
							X: mypoint.x,
							Y: mypoint.y
						};
						self.updateTip(xpoint);
						if(typeof(self.options.Marker) == 'undefined') {
							var symbol = new esri.symbol.PictureMarkerSymbol({
								url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVFhH7ZexDYAwDAQ/iDFo2ITNMwoUjIEIbxIhkKALmOJPsqK4sC/pHmdWICYgvVncMZZ1O0053XgS6AMQapbNzKOv/PYHPkMCEpCABCQgAQlIQAISkIAE3AUssx1YOmZjYIqdeV1ytxotZ3ecPfHVtznRIZ4DGxH/bnpSTNdKAAAAAElFTkSuQmCC',
								height: 32,
								width: 32,
								yoffset: 12
							});
							self.options.symbol = symbol;
							self.options.Marker = new esri.Graphic(pt, symbol);
							self.layers.infoLayer.add(self.options.Marker);
						} else {
							var height = 32 - (18 - level) * 3;
							var width = 32 - (18 - level) * 3;
							self.options.symbol.setHeight(height * 4 / 3);
							self.options.symbol.setWidth(width * 4 / 3);
							self.options.Marker.setGeometry(pt);
						}
					}
					map.centerAt(pt);
				}
			},
			getMap: function() {
				var self = this;
				return self.options.map;
			},
			getLayer: function(layerID) {
				var self = this;
				return self.layers[layerID];
			},
			drawCompleted: function(data) {
				var self = this;
				if(typeof(self.options.drawCompleted) != 'undefined') {
					self.options.drawCompleted(data);
				}
			},
			AjaxSarech: function(parm) {
				var self = this;
				//var parm = { ElementCode: '0036000', whereJson: [{ key: 'Field5', val: '003400070000000000000001' }] }
				var layer = self.layers[parm.ElementCode];
				if(typeof(layer) != 'undefined') {
					$.ajax({
						url: self.options.path + '/gDataInterface/DataHandler.ashx',
						type: 'POST',
						data: {
							active: "AjaxTilesByWhereObj",
							whereJson: JSON.stringify(parm.whereJson),
							ElementCode: layer.ElementCode,
							UniqueCode: layer.UniqueCode
						},
						dataType: 'json',
						timeout: 0,
						success: function(data) {
							if(data) {
								if(typeof(data.pt) != "undefined") {
									self.PanTo(data.pt[0]);
								}
								setTimeout(function() {
									layer.refresh();
								}, 500);
							}
						}
					});
				}
			},
			AnalysisData: function(data) {
				var self = this;
				if(typeof(self.options.AnalysisData) === 'function') {
					self.options.AnalysisData(data);
				}
			}
		};

		this.Method.init(this, $.extend(defaults, options));
		return this;
	};
})(jQuery);