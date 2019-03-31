/* eslint-disable */
import go from "gojs";

export function initTemplate_VirtualPoint() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();
    /****** A相 ******/
    let virtualPointTemplate_82 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M18 50 V60z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 元件形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(13, 60),
            width: 10,
            height: 10,
            stroke: "yellow",
            strokeWidth: 2,
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M10 70 L26 60",
            stroke: "yellow",
            strokeWidth: 2
        })
    );

    /****** B相 ******/
    let virtualPointTemplate_83 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M18 20 V60z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 元件形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(13, 60),
            width: 10,
            height: 10,
            stroke: "green",
            strokeWidth: 2,
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M10 70 L26 60",
            stroke: "green",
            strokeWidth: 2
        })
    );

    /****** C相 ******/
    let virtualPointTemplate_84 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M18 30 V60z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 元件形状
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(13, 60),
            width: 10,
            height: 10,
            stroke: "red",
            strokeWidth: 2,
            fill: "transparent"
        }),
        GO(go.Shape, {
            geometryString: "M10 70 L26 60",
            stroke: "red",
            strokeWidth: 2
        })
    );

    templateMap.set("virtualPoint_82", virtualPointTemplate_82);
    templateMap.set("virtualPoint_83", virtualPointTemplate_83);
    templateMap.set("virtualPoint_84", virtualPointTemplate_84);

    return templateMap;
}