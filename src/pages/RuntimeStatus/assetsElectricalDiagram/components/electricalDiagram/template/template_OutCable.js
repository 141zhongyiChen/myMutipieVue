/* eslint-disable */
import go from "gojs";

export function initTemplate_OutCable() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();
    /****** A相 ******/
    let outCableTemplate_73 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M15 0 V29z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M15 79 V90z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(35, 55),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 元件形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 29),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M12 37 L3 50 L26 62 L17 71",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 70),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    /****** B相 ******/
    let outCableTemplate_74 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M15 10 V29z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M15 79 V100z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(35, 55),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 元件形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 29),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M12 37 L3 50 L26 62 L17 71",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 70),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    /****** C相 ******/
    let outCableTemplate_75 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M15 20 V29z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M15 79 V110z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(35, 55),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 元件形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 29),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M12 37 L3 50 L26 62 L17 71",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 70),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    /****** 三相 ******/
    let outCableTemplate_95 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M-45 0 V35z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M15 10 V29z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M75 20 V35z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M-45 90 V74z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M15 80 V100z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M75 74 V110z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(35, 55),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 元件形状
        GO(go.Shape, {
            geometryString: "M-45 34 H10z",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        GO(go.Shape, {
            geometryString: "M75 34 H20z",
            strokeWidth: 2,
            stroke: "red"
        }),
        GO(go.Shape, {
            geometryString: "M-45 75 H10z",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        GO(go.Shape, {
            geometryString: "M75 75 H20z",
            strokeWidth: 2,
            stroke: "red"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 29),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M12 37 L3 50 L26 62 L17 71",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(10, 70),
            width: 10,
            height: 10,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    templateMap.set("outCable_73", outCableTemplate_73);
    templateMap.set("outCable_74", outCableTemplate_74);
    templateMap.set("outCable_75", outCableTemplate_75);
    templateMap.set("outCable_95", outCableTemplate_95);

    return templateMap;
}