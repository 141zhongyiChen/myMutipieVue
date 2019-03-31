define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({ wkid: 102113 });
            //this.initialExtent = (this.fullExtent = new esri.geometry.Extent({
            //    "xmin": 9684795,
            //    "ymin": 1689200,
            //    "xmax": 14137575,
            //    "ymax": 7361866,
            //    "spatialReference": {
            //        "wkid": 102113
            //    }
            //}));
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(9684795.69766667, 1689200.13937276, 14137575.3287778, 7361866.11202641, this.spatialReference));

            this.tileInfo = new esri.layers.TileInfo({
                "rows": 329,
                "cols": 329,
                "compressionQuality": 0,
                "origin": {
                    "x": -20037508.342787,
                    "y": 20037508.342787
                },
                "spatialReference": {
                    "wkid": 102113
                },
                "lods": [
                    { "level": 0, "resolution": 156543.033928, "scale": 591657527.591555 },
                    { "level": 1, "resolution": 78271.5169639999, "scale": 295828763.795777 },
                    { "level": 2, "resolution": 39135.7584820001, "scale": 147914381.897889 },
                    { "level": 3, "resolution": 19567.8792409999, "scale": 73957190.948944 },
                    { "level": 4, "resolution": 9783.93962049996, "scale": 36978595.474472 },
                    { "level": 5, "resolution": 4891.96981024998, "scale": 18489297.737236 },
                    { "level": 6, "resolution": 2445.98490512499, "scale": 9244648.868618 },
                    { "level": 7, "resolution": 1222.99245256249, "scale": 4622324.434309 },
                    { "level": 8, "resolution": 611.49622628138, "scale": 2311162.217155 },
                    { "level": 9, "resolution": 305.748113140558, "scale": 1155581.108577 },
                    { "level": 10, "resolution": 152.874056570411, "scale": 577790.554289 },
                    { "level": 11, "resolution": 76.4370282850732, "scale": 288895.277144 },
                    { "level": 12, "resolution": 38.2185141425366, "scale": 144447.638572 },
                    { "level": 13, "resolution": 19.1092570712683, "scale": 72223.819286 },
                    { "level": 14, "resolution": 9.55462853563415, "scale": 36111.909643 },
                    { "level": 15, "resolution": 4.77731426794937, "scale": 18055.954822 },
                    { "level": 16, "resolution": 2.38865713397468, "scale": 9027.977411 },
                    { "level": 17, "resolution": 1.19432856685505, "scale": 4513.988705 },
                    { "level": 18, "resolution": 0.597164283559817, "scale": 2256.994353 }]
            });

            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {

            //string baseUrl = "http://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={1}&y={2}&z={3}"; ;

            //string quard = GetQuard(col, row, level);
            ////if (quard.Length < 1) { return ""; }
            //string url = string.Format(baseUrl, (quard.Length >= 1) ? ((object)quard[quard.Length - 1]) : (""), col, row, level);
            var turl = "http://202.104.124.117/SZV2.GIS/Handlers/MapPublishHostImage.aspx?group=dgumV2Web&service=sz&fullView=0,0,987,658&zoomLevel="+level+"&tileSize=329,329&tileIndex="+row+","+col+"";
            return turl;
        }
    });
});