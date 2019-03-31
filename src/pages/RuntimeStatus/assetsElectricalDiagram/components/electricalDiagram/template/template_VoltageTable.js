/* eslint-disable */
import go from "gojs";

export function initTemplate_VoltageTable() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    let voltageTableTemplate_24 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 198 }),
            GO(go.RowColumnDefinition, { row: 0, height: 21 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 42 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "输入电压(V)",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.Panel, "Table",
                { row: 1 },
                GO(go.RowColumnDefinition, { column: 0, width: 66 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 66 }),
                GO(go.RowColumnDefinition, { column: 2, separatorStroke: "black", width: 66 }),
                GO(go.RowColumnDefinition, { row: 0, height: 21 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 21 }),
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "A相",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    textAlign: "center",
                    text: "B相",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 2,
                    textAlign: "center",
                    text: "C相",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    stroke: "yellow",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("inputUA")) {
                        return m.inputUA;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    textAlign: "center",
                    stroke: "green",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("inputUB")) {
                        return m.inputUB;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 2,
                    textAlign: "center",
                    stroke: "red",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("inputUC")) {
                        return m.inputUC;
                    }
                    return 0;
                }))
            )
        )
    );

    let voltageTableTemplate_25 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 198 }),
            GO(go.RowColumnDefinition, { row: 0, height: 21 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 42 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "输出电压(V)",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.Panel, "Table",
                { row: 1 },
                GO(go.RowColumnDefinition, { column: 0, width: 66 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 66 }),
                GO(go.RowColumnDefinition, { column: 2, separatorStroke: "black", width: 66 }),
                GO(go.RowColumnDefinition, { row: 0, height: 21 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 21 }),
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "A相",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    textAlign: "center",
                    text: "B相",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 2,
                    textAlign: "center",
                    text: "C相",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    stroke: "yellow",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("outputUA")) {
                        return m.outputUA;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    textAlign: "center",
                    stroke: "green",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("outputUB")) {
                        return m.outputUB;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 2,
                    textAlign: "center",
                    stroke: "red",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("outputUC")) {
                        return m.outputUC;
                    }
                    return 0;
                }))
            )
        )
    );

    templateMap.set("voltageTable_24", voltageTableTemplate_24);
    templateMap.set("voltageTable_25", voltageTableTemplate_25);

    return templateMap;
}