/* eslint-disable */
import go from "gojs";

export function initTemplate_EnergySave() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    /****** A相 ******/
    let energySaveTemplate18 = GO(go.Node, "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M26,0 V30",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M26,71 V80",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件外观
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(12.5, 30),
            width: 25,
            height: 25,
            strokeWidth: 4,
            stroke: "yellow",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(9.5, 40),
            width: 30,
            height: 30,
            strokeWidth: 4,
            stroke: "yellow",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M0,60 L60,33" + "M60,33 L45,33" + "M60,33 L50,45",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(42, 60),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return ("000" + n).slice(-3);
        }))
    );

    /****** B相 ******/
    let energySaveTemplate19 = GO(go.Node, "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M26,10 V30",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M26,71 V90",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件外观
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(12.5, 30),
            width: 25,
            height: 25,
            strokeWidth: 4,
            stroke: "green",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(9.5, 40),
            width: 30,
            height: 30,
            strokeWidth: 4,
            stroke: "green",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M0,60 L60,33" + "M60,33 L45,33" + "M60,33 L50,45",
            strokeWidth: 2,
            stroke: "green"
        }),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(42, 60),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return ("000" + n).slice(-3);
        }))
    );

    /****** C相 ******/
    let energySaveTemplate20 = GO(go.Node, "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M26,20 V30",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M26,71 V100",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件外观
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(12.5, 30),
            width: 25,
            height: 25,
            strokeWidth: 4,
            stroke: "red",
            fill: "transparent"
        }),
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(9.5, 40),
            width: 30,
            height: 30,
            strokeWidth: 4,
            stroke: "red",
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M0,60 L60,33" + "M60,33 L45,33" + "M60,33 L50,45",
            strokeWidth: 2,
            stroke: "red"
        }),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(42, 60),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return ("000" + n).slice(-3);
        }))
    );

    templateMap.set("energySave_18", energySaveTemplate18);
    templateMap.set("energySave_19", energySaveTemplate19);
    templateMap.set("energySave_20", energySaveTemplate20);

    return templateMap;
}