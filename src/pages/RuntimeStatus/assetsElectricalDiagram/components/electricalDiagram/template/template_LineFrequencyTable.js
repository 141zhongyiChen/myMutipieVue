/* eslint-disable */
import go from "gojs";

export function initTemplate_LineFrequencyTable() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    let lineFrequencyTableTemplate_99 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 100 }),
            GO(go.RowColumnDefinition, { row: 0, height: 35 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 35 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "线频率 (Hz)",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(go.TextBlock, {
                row: 1,
                textAlign: "center",
                stroke: "blue",
                font: "bold 25px Microsoft Yahei"
            }, new go.Binding("text", "", function (m) {
                if (m.hasOwnProperty("lineFrequency")) {
                    return m.lineFrequency;
                }
                return "---";
            }))
        )
    );



    templateMap.set("lineFrequencyTable_99", lineFrequencyTableTemplate_99);

    return templateMap;
}