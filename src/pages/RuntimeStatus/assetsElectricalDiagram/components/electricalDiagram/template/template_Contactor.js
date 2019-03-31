/* eslint-disable */
import go from "gojs";
import { convertStatusAngle_OpenClose, convertStatusColor_OpenClose } from "../convertStatus.js";

export function initTemplate_Contactor() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();
    /****** 三相 ******/
    let contactorTemplate_5 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 三相进线
        GO(go.Shape, {
            geometryString: "M25 0 V30z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M40 10 V30z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M55 20 V30z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 三相出线
        GO(go.Shape, {
            geometryString: "M25 70 V80z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M40 70 V90z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M55 70 V100z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件矩形框
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(0, 30),
            width: 80,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        // 文字
        GO(
            go.TextBlock,
            {
                position: new go.Point(90, 35),
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "text")
        ),
        // 编号&关联K路
        GO(
            go.Panel,
            "Horizontal",
            { position: new go.Point(90, 55) },
            GO(
                go.TextBlock,
                {
                    stroke: "#F0F8FF",
                    font: "bold 12px Microsoft Yahei"
                },
                new go.Binding("text", "number", function (n) {
                    return ("000" + n).slice(-3);
                })
            ),
            GO(
                go.TextBlock,
                {
                    stroke: "#F0F8FF",
                    font: "bold 12px Microsoft Yahei"
                },
                new go.Binding("text", "indexK", function (index) {
                    if (index > 0) {
                        return "\u00AD (K" + index + ")";
                    }

                    return "";
                })
            )
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M25 43 V59z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        GO(
            go.Shape,
            {
                geometryString: "M40 43 V59z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        GO(
            go.Shape,
            {
                geometryString: "M55 43 V59z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 三相元件内部触点
        GO(go.Shape, {
            geometryString: "M24 35 V30z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(21, 36),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(21, 58),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M24 65 V70z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            geometryString: "M39 35 V30z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 36),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 58),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M39 65 V70z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            geometryString: "M54 35 V30z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(51, 36),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(51, 58),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M54 65 V70z",
            strokeWidth: 4,
            stroke: "black"
        })
    );

    /****** A相 ******/
    let contactorTemplate_6 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M40 0 V30z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M40 70 V80z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件矩形框
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(0, 30),
            width: 80,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        // 文字
        GO(
            go.TextBlock,
            {
                position: new go.Point(90, 35),
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "text")
        ),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(90, 55),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return ("000" + n).slice(-3);
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M40 43 V59z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            geometryString: "M39 35 V30z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 36),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 58),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M39 65 V70z",
            strokeWidth: 4,
            stroke: "black"
        })
    );

    /****** B相 ******/
    let contactorTemplate_7 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M40 10 V30z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M40 70 V90z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件矩形框
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(0, 30),
            width: 80,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        // 文字
        GO(
            go.TextBlock,
            {
                position: new go.Point(90, 35),
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "text")
        ),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(90, 55),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return ("000" + n).slice(-3);
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M40 43 V59z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            geometryString: "M39 35 V30z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 36),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 58),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M39 65 V70z",
            strokeWidth: 4,
            stroke: "black"
        })
    );

    /****** C相 ******/
    let contactorTemplate_8 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M40 20 V30z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M40 70 V100z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件矩形框
        GO(go.Shape, {
            figure: "Rectangle",
            position: new go.Point(0, 30),
            width: 80,
            height: 40,
            strokeWidth: 4,
            stroke: "black",
            fill: "transparent"
        }),
        // 文字
        GO(
            go.TextBlock,
            {
                position: new go.Point(90, 35),
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "text")
        ),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(90, 55),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return ("000" + n).slice(-3);
            })
        ),
        // 断开、闭合动作
        GO(
            go.Shape,
            {
                geometryString: "M40 43 V59z",
                strokeWidth: 2
            },
            new go.Binding("angle", "", convertStatusAngle_OpenClose),
            new go.Binding("stroke", "", convertStatusColor_OpenClose)
        ),
        // 元件内部触点
        GO(go.Shape, {
            geometryString: "M39 35 V30z",
            strokeWidth: 4,
            stroke: "black"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 36),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(36, 58),
            width: 8,
            height: 8,
            strokeWidth: 2,
            stroke: "black",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M39 65 V70z",
            strokeWidth: 4,
            stroke: "black"
        })
    );

    templateMap.set("contactor_5", contactorTemplate_5);
    templateMap.set("contactor_6", contactorTemplate_6);
    templateMap.set("contactor_7", contactorTemplate_7);
    templateMap.set("contactor_8", contactorTemplate_8);

    return templateMap;
}