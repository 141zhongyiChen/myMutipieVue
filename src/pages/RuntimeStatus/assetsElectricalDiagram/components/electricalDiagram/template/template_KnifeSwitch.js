/* eslint-disable */
import go from "gojs";
import { convertStatusColor_OpenClose } from "../convertStatus.js";

export function initTemplate_KnifeSwitch() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    /****** 三相（只有出线）******/
    let knifeSwitchTemplate33 = GO(go.Node, "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 元件内部形状
        GO(go.Shape, {
            geometryString: "M2,30 v30z" + "M2,45 H22" + "M30,45 H50" + "M60,45 H80",
            strokeWidth: 4,
            stroke: "black"
        }),
        // 断开、闭合动作
        GO(go.Shape, {
            strokeWidth: 2
        }, new go.Binding("stroke", "", convertStatusColor_OpenClose),
            new go.Binding("geometryString", "", function (m) {
                if (m.hasOwnProperty("statusCode") && m.statusCode === 1) {
                    return "M40,30 V60";
                }
                return "M26,27 L40,61";
            })
        ),
        GO(go.Shape, {
            strokeWidth: 2
        }, new go.Binding("stroke", "", convertStatusColor_OpenClose),
            new go.Binding("geometryString", "", function (m) {
                if (m.hasOwnProperty("statusCode") && m.statusCode === 1) {
                    return "M70,30 V60";
                }
                return "M56,27 L70,61";
            })
        ),
        GO(go.Shape, {
            strokeWidth: 2
        }, new go.Binding("stroke", "", convertStatusColor_OpenClose),
            new go.Binding("geometryString", "", function (m) {
                if (m.hasOwnProperty("statusCode") && m.statusCode === 1) {
                    return "M100,30 V60";
                }
                return "M86,27 L100,61";
            })
        ),
        // A相进线（固定）
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(38, 0),
            width: 5,
            height: 5,
            fill: "yellow",
            stroke: "yellow"
        }),
        GO(go.Shape, {
            geometryString: "M40 0 V30" + "M35,30 H45",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        // B相进线（固定）
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(68, 0),
            width: 5,
            height: 5,
            fill: "green",
            stroke: "green"
        }),
        GO(go.Shape, {
            geometryString: "M70 0 V30" + "M65,30 H75",
            strokeWidth: 2,
            stroke: "green"
        }),
        // C相进线（固定）
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(98, 0),
            width: 5,
            height: 5,
            fill: "red",
            stroke: "red"
        }),
        GO(go.Shape, {
            geometryString: "M100 0 V30" + "M95,30 H105",
            strokeWidth: 2,
            stroke: "red"
        }),
        // A相出线
        GO(go.Shape, {
            geometryString: "M40, 60 V70",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // B相出线
        GO(go.Shape, {
            geometryString: "M70, 60 V80",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // C相出线
        GO(go.Shape, {
            geometryString: "M100, 60 V90",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(110, 25),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return ("000" + n).slice(-3);
        })),


    )


    templateMap.set("knifeSwitch_33", knifeSwitchTemplate33);

    return templateMap;
}