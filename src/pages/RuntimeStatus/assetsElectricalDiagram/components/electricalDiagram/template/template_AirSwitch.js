/* eslint-disable */
import go from "gojs";
import { convertStatusAngle_OpenClose, convertStatusColor_OpenClose } from "../convertStatus.js";

export function initTemplate_AirSwitch() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();
    /****** A相 ******/
    let airSwitchTemplate_35 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 0 V37z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 60 V80z",
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
                position: new go.Point(30, 30),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M20 36 V60z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            geometryString: " M15 57 L25 62" + " M25 57 L15 62",
            strokeWidth: 2,
            stroke: "yellow"
        })
    );

    /****** B相 ******/
    let airSwitchTemplate_36 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 10 V37z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 60 V90z",
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
                position: new go.Point(30, 30),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M20 36 V60z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            geometryString: " M15 57 L25 62" + " M25 57 L15 62",
            strokeWidth: 2,
            stroke: "green"
        })
    );

    /****** C相 ******/
    let airSwitchTemplate_37 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 20 V37z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 60 V100z",
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
                position: new go.Point(30, 30),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M20 36 V60z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            geometryString: " M15 57 L25 62" + " M25 57 L15 62",
            strokeWidth: 2,
            stroke: "red"
        })
    );

    /****** A相 V2 ******/
    let airSwitchTemplate_79 = GO(
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
            geometryString: "M20 66 V80z",
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
                position: new go.Point(30, 30),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M20 36 V60z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 29),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 59),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    /****** B相 V2 ******/
    let airSwitchTemplate_80 = GO(
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
            geometryString: "M20 66 V90z",
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
                position: new go.Point(30, 30),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M20 36 V60z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 29),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 59),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    /****** C相 V2 ******/
    let airSwitchTemplate_81 = GO(
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
            geometryString: "M20 66 V100z",
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
                position: new go.Point(30, 30),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M20 36 V60z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 29),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 59),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    /****** 三相 ******/
    let airSwitchTemplate_96 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M-35 -10 V20 H5 V30",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M20 0 V30",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M75 10 V20 H35 V30",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M-35 90 V80 H5 V70",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M20 70 V100",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M75 110 V80 H35 V70",
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
                position: new go.Point(47, 51),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M5 36 V63",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        GO(
            go.Shape,
            {
                geometryString: "M20 36 V63",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        GO(
            go.Shape,
            {
                geometryString: "M35 36 V63",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(1, 29),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(1, 63),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 29),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(16, 63),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(31, 29),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(31, 63),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        })
    );

    templateMap.set("airSwitch_35", airSwitchTemplate_35);
    templateMap.set("airSwitch_36", airSwitchTemplate_36);
    templateMap.set("airSwitch_37", airSwitchTemplate_37);
    templateMap.set("airSwitch_79", airSwitchTemplate_79);
    templateMap.set("airSwitch_80", airSwitchTemplate_80);
    templateMap.set("airSwitch_81", airSwitchTemplate_81);
    templateMap.set("airSwitch_96", airSwitchTemplate_96);

    return templateMap;
}