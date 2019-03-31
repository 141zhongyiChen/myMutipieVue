/* eslint-disable */
import go from "gojs";
import { convertStatusColor_BJIco, convertStatusContent_BJIco } from "../convertStatus.js";

export function initTemplate_BJIco() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    let switchTemplate = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        { margin: 5 },
        // 传统外观
        GO(
            go.Panel,
            "Position",
            GO(go.Shape, {
                figure: "RoundedRectangle",
                parameter1: 10,
                width: 100,
                height: 89,
                fill: "white"
            }),
            GO(
                go.Shape,
                {
                    figure: "Ellipse",
                    position: new go.Point(30, 12),
                    width: 40,
                    height: 40,
                    stroke: null
                },
                new go.Binding("fill", "", convertStatusColor_BJIco)
            ),
            GO(
                go.TextBlock,
                {
                    desiredSize: new go.Size(100, 25),
                    position: new go.Point(0, 58),
                    textAlign: "center",
                    font: "bold 16px Microsoft Yahei"
                },
                new go.Binding("text", "", convertStatusContent_BJIco)
            )
        ),
        // “遥控—外控”外观
        // 未完成

        GO(
            go.TextBlock,
            {
                desiredSize: new go.Size(100, 20),
                position: new go.Point(0, 88),
                textAlign: "center",
                font: "bold 15px Microsoft Yahei"
            },
            new go.Binding("text", "index", function (v) {
                return "BJ" + v;
            })
        )
    );

    templateMap.set("bjIco_27", switchTemplate);

    return templateMap;
}