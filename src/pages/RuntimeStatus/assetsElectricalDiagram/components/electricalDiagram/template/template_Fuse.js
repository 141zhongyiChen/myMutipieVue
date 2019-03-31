/* eslint-disable */
import go from "gojs";

export function initTemplate_Fuse() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    /****** S型A相 ******/
    let fuseTemplate_12 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 0 V30z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 70 V80z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 文字
        GO(go.TextBlock, {
            position: new go.Point(34, 20),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "text")),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(34, 49),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 元件的形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(18, 28),
            width: 5,
            height: 5,
            stroke: "black",
            fill: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(18, 68),
            width: 5,
            height: 5,
            stroke: "black",
            fill: "black"
        }),
        GO(go.Shape, {
            geometryString: "M20 30 A10 10 45 0 0 20 50" + "M20 50 A10 10 45 0 1 20 70",
            strokeWidth: 2,
            stroke: "black"
        })
    );

    /****** S型B相 ******/
    let fuseTemplate_13 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 10 V30z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 70 V90z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 文字
        GO(go.TextBlock, {
            position: new go.Point(34, 20),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "text")),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(34, 49),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 元件的形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(18, 28),
            width: 5,
            height: 5,
            stroke: "black",
            fill: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(18, 68),
            width: 5,
            height: 5,
            stroke: "black",
            fill: "black"
        }),
        GO(go.Shape, {
            geometryString: "M20 30 A10 10 45 0 0 20 50" + "M20 50 A10 10 45 0 1 20 70",
            strokeWidth: 2,
            stroke: "black"
        })
    );

    /****** S型C相 ******/
    let fuseTemplate_14 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 20 V30z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 70 V100z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 文字
        GO(go.TextBlock, {
            position: new go.Point(34, 20),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "text")),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(34, 49),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 元件的形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(18, 28),
            width: 5,
            height: 5,
            stroke: "black",
            fill: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(18, 68),
            width: 5,
            height: 5,
            stroke: "black",
            fill: "black"
        }),
        GO(go.Shape, {
            geometryString: "M20 30 A10 10 45 0 0 20 50" + "M20 50 A10 10 45 0 1 20 70",
            strokeWidth: 2,
            stroke: "black"
        })
    );

    /****** 矩形A相 ******/
    let fuseTemplate_15 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 0 V30z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 70 V80z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 文字
        GO(go.TextBlock, {
            position: new go.Point(35, 20),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "text")),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(35, 49),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 元件的形状
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(10, 30),
            width: 20,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M20 28 V74z",
            strokeWidth: 2,
            stroke: "yellow"
        })
    );

    /****** 矩形B相 ******/
    let fuseTemplate_16 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 10 V30z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 70 V90z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 文字
        GO(go.TextBlock, {
            position: new go.Point(35, 20),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "text")),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(35, 49),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 元件的形状
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(10, 30),
            width: 20,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M20 28 V74z",
            strokeWidth: 2,
            stroke: "green"
        })
    );

    /****** 矩形C相 ******/
    let fuseTemplate_17 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 20 V30z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 70 V100z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 文字
        GO(go.TextBlock, {
            position: new go.Point(35, 20),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "text")),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(35, 49),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 元件的形状
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(10, 30),
            width: 20,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M20 28 V74z",
            strokeWidth: 2,
            stroke: "red"
        })
    );

    /****** 三相（出线） ******/
    let fuseTemplate_38 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 元件的形状1
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(10, 30),
            width: 20,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(40, 30),
            width: 20,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(70, 30),
            width: 20,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(18, 0),
            width: 5,
            height: 5,
            stroke: "yellow",
            fill: "yellow"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(48, 0),
            width: 5,
            height: 5,
            stroke: "green",
            fill: "green"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(78, 0),
            width: 5,
            height: 5,
            stroke: "red",
            fill: "red"
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 50 V80z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M50 50 V90z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M80 50 V100z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 文字
        GO(go.TextBlock, {
            position: new go.Point(95, 30),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "text")),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(95, 49),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 元件的形状2
        GO(go.Shape, {
            geometryString: "M20 0 V54z",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        GO(go.Shape, {
            geometryString: "M50 0 V54z",
            strokeWidth: 2,
            stroke: "green"
        }),
        GO(go.Shape, {
            geometryString: "M80 0 V54z",
            strokeWidth: 2,
            stroke: "red"
        })
    );

    templateMap.set("fuse_12", fuseTemplate_12);
    templateMap.set("fuse_13", fuseTemplate_13);
    templateMap.set("fuse_14", fuseTemplate_14);
    templateMap.set("fuse_15", fuseTemplate_15);
    templateMap.set("fuse_16", fuseTemplate_16);
    templateMap.set("fuse_17", fuseTemplate_17);
    templateMap.set("fuse_38", fuseTemplate_38);

    return templateMap;
}