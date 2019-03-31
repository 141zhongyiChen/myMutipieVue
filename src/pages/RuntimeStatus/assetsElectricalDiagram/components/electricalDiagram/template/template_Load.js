/* eslint-disable */
import go from "gojs";
import { convertStatusColor_OpenClose } from "../convertStatus.js";

export function initTemplate_Load() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();
    /****** A相 ******/
    let loadTemplate_76 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M13 0 V39z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(30, 45),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 文字
        GO(
            go.TextBlock,
            {
                position: new go.Point(0, 70),
                width: 30,
                textAlign: "center",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "text")
        ),
        // 元件形状
        GO(
            go.Shape,
            {
                figure: "Ellipse",
                position: new go.Point(0, 40),
                width: 25,
                height: 25,
                strokeWidth: 4,
                fill: "transparent"
            },
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        GO(
            go.Shape,
            {
                geometryString: "M5 45 L20 60" + "M20 45 L5 60",
                strokeWidth: 4
            },
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        )
    );

    /****** B相 ******/
    let loadTemplate_77 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M13 10 V39z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(30, 45),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 文字
        GO(
            go.TextBlock,
            {
                position: new go.Point(0, 70),
                width: 30,
                textAlign: "center",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "text")
        ),
        // 元件形状
        GO(
            go.Shape,
            {
                figure: "Ellipse",
                position: new go.Point(0, 40),
                width: 25,
                height: 25,
                strokeWidth: 4,
                fill: "transparent"
            },
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        GO(
            go.Shape,
            {
                geometryString: "M5 45 L20 60" + "M20 45 L5 60",
                strokeWidth: 4
            },
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        )
    );

    /****** C相 ******/
    let loadTemplate_78 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M13 20 V39z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(30, 45),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 文字
        GO(
            go.TextBlock,
            {
                position: new go.Point(0, 70),
                width: 30,
                textAlign: "center",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "text")
        ),
        // 元件形状
        GO(
            go.Shape,
            {
                figure: "Ellipse",
                position: new go.Point(0, 40),
                width: 25,
                height: 25,
                strokeWidth: 4,
                fill: "transparent"
            },
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        GO(
            go.Shape,
            {
                geometryString: "M5 45 L20 60" + "M20 45 L5 60",
                strokeWidth: 4
            },
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        )
    );

    templateMap.set("load_76", loadTemplate_76);
    templateMap.set("load_77", loadTemplate_77);
    templateMap.set("load_78", loadTemplate_78);

    return templateMap;
}