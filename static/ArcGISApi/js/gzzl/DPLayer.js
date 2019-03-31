define(["dojo/_base/declare","esri/layers/tiled"], function(declare){
return declare(esri.layers.TiledMapServiceLayer, {
        constructor: function() {
          this.spatialReference = new esri.SpatialReference({ wkid:4490 });
          this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
 
          this.tileInfo = new esri.layers.TileInfo({
            "rows" : 256,
            "cols" : 256,
            "compressionQuality" : 0,
            "origin" : {
              "x" : -400,
              "y" : 400
            },
            "spatialReference" : {
              "wkid" : 4490
            },
            "lods" : [
              {"level" : 0, "resolution" : 0.001373291015625, "scale" : 577143.73644287116},
              {"level" : 1, "resolution" : 0.0006866455078125, "scale" : 288571.86822143558},
              {"level" : 2, "resolution" : 0.00034332275390625, "scale" : 144285.93411071779},
              {"level" : 3, "resolution" : 0.000171661376953125, "scale" : 72142.967055358895},
              {"level" : 4, "resolution" : 8.58306884765625e-005, "scale" : 36071.483527679447},
              {"level" : 5, "resolution" : 4.291534423828125e-005, "scale" : 18035.741763839724},
              {"level" : 6, "resolution" : 2.1457672119140625e-005, "scale" : 9017.8708819198619},
              {"level" : 7, "resolution" : 1.0728836059570313e-005, "scale" : 4508.9354409599309},
              {"level" : 8, "resolution" : 5.3644180297851563e-006, "scale" : 2254.4677204799655},
              {"level" : 9, "resolution" : 2.682209014892579e-006, "scale" : 1127.23386023998275},
              {"level" : 10, "resolution" : 1.3411045074462895e-006, "scale" : 563.616930119991375}
            ]
          });
 
          this.loaded = true;
          this.onLoad(this);
        },
 
        getTileUrl: function(level, row, col) {
        
        var url='http://192.168.65.109:6160/igs/rest/mrms/tile/szmap_4490/{level}/{row}/{col}?size=256&token=50e8bd1c-1de9-4b03-88d2-f149584e8174';
        
        
                 return url.format({level:level,row:row,col:col});

        }
      });
      });