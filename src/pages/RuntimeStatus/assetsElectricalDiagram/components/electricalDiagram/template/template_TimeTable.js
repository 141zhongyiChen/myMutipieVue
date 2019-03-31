/* eslint-disable */
import go from "gojs";
import { getTimeStrDefaultEmpty } from "../convertStatus.js";

export function initTemplate_TimeTable() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    let networkUpdateTimeTableTemplate_93 = GO(
        go.Node,
        "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel,
            "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 180 }),
            GO(go.RowColumnDefinition, { row: 0, height: 25 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 25 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "网络更新时间",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                },
                new go.Binding("text", "", getTimeStrDefaultEmpty)
            )
        )
    );

    let dataUpdateTimeTableTemplate_92 = GO(
        go.Node,
        "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel,
            "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 180 }),
            GO(go.RowColumnDefinition, { row: 0, height: 25 }),
            GO(go.RowColumnDefinition, {
                row: 1,
                separatorStroke: "black",
                height: 25
            }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "数据更新时间",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                },
                new go.Binding("text", "", getTimeStrDefaultEmpty)
            )
        )
    );

    templateMap.set("dataUpdateTimeTable_92", dataUpdateTimeTableTemplate_92);
    templateMap.set("networkUpdateTimeTable_93", networkUpdateTimeTableTemplate_93);

    return templateMap;
}