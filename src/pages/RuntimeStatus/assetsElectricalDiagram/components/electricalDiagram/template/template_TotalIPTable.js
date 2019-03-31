/* eslint-disable */
import go from "gojs";

export function initTemplate_TotalIPTable() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    let totalIPTableTemplate_88 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 280 }),
            GO(go.RowColumnDefinition, { row: 0, height: 26 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 50 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "总电流 / 总有功",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.Panel, "Table",
                { row: 1 },
                GO(go.RowColumnDefinition, { column: 0, width: 55 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { column: 2, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { column: 3, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { row: 0, height: 25 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 25 }),
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    stroke: "yellow",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_A")) {
                        return m.totalI_A;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    column: 2,
                    stroke: "green",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_B")) {
                        return m.totalI_B;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    column: 3,
                    stroke: "red",
                    textAlign: "center",
                    text: "0",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_C")) {
                        return m.totalI_C;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    stroke: "yellow",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_A")) {
                        return m.totalP_A;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 2,
                    stroke: "green",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_B")) {
                        return m.totalP_B;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 3,
                    stroke: "red",
                    textAlign: "center",
                    text: "0",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_C")) {
                        return m.totalP_C;
                    }
                    return 0;
                })),
            )
        )
    );

    let totalIPTableTemplate_89 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 130 }),
            GO(go.RowColumnDefinition, { row: 0, height: 26 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 50 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "总电流 / 总有功",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.Panel, "Table",
                { row: 1 },
                GO(go.RowColumnDefinition, { column: 0, width: 55 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { row: 0, height: 25 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 25 }),
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    stroke: "yellow",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_A")) {
                        return m.totalI_A;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    stroke: "yellow",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_A")) {
                        return m.totalP_A;
                    }
                    return 0;
                }))
            )
        )
    );

    let totalIPTableTemplate_90 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 130 }),
            GO(go.RowColumnDefinition, { row: 0, height: 26 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 50 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "总电流 / 总有功",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.Panel, "Table",
                { row: 1 },
                GO(go.RowColumnDefinition, { column: 0, width: 55 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { row: 0, height: 25 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 25 }),
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    stroke: "green",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_B")) {
                        return m.totalI_B;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    stroke: "green",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_B")) {
                        return m.totalP_B;
                    }
                    return 0;
                }))
            )
        )
    );

    let totalIPTableTemplate_91 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 130 }),
            GO(go.RowColumnDefinition, { row: 0, height: 26 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 50 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "总电流 / 总有功",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.Panel, "Table",
                { row: 1 },
                GO(go.RowColumnDefinition, { column: 0, width: 55 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { row: 0, height: 25 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 25 }),
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    stroke: "red",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_C")) {
                        return m.totalI_C;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    stroke: "red",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_C")) {
                        return m.totalP_C;
                    }
                    return 0;
                }))
            )
        )
    );

    let totalIPTableTemplate_97 = GO(
        go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
        GO(
            go.Panel, "Table",
            GO(go.RowColumnDefinition, { column: 0, width: 280 }),
            GO(go.RowColumnDefinition, { row: 0, height: 26 }),
            GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 75 }),
            GO(go.TextBlock, {
                textAlign: "center",
                text: "总电流 / 总有功",
                font: "bold 15px Microsoft Yahei"
            }),
            GO(
                go.Panel, "Table",
                { row: 1 },
                GO(go.RowColumnDefinition, { column: 0, width: 55 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { column: 2, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { column: 3, separatorStroke: "black", width: 75 }),
                GO(go.RowColumnDefinition, { row: 0, height: 25 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 25 }),
                GO(go.RowColumnDefinition, { row: 2, separatorStroke: "black", height: 25 }),
                // 总参考电流
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I参(A)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    stroke: "yellow",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("tRefCurrentA")) {
                        return m.tRefCurrentA;
                    }
                    return "---";
                })),
                GO(go.TextBlock, {
                    column: 2,
                    stroke: "green",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("tRefCurrentB")) {
                        return m.tRefCurrentB;
                    }
                    return "---";
                })),
                GO(go.TextBlock, {
                    column: 3,
                    stroke: "red",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("tRefCurrentC")) {
                        return m.tRefCurrentC;
                    }
                    return "---";
                })),
                // 总电流
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    stroke: "yellow",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_A")) {
                        return m.totalI_A;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 2,
                    stroke: "green",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_B")) {
                        return m.totalI_B;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 3,
                    stroke: "red",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalI_C")) {
                        return m.totalI_C;
                    }
                    return 0;
                })),
                // 总有功
                GO(go.TextBlock, {
                    row: 2,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 15px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 2,
                    column: 1,
                    stroke: "yellow",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_A")) {
                        return m.totalP_A;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 2,
                    column: 2,
                    stroke: "green",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_B")) {
                        return m.totalP_B;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 2,
                    column: 3,
                    stroke: "red",
                    textAlign: "center",
                    font: "bold 15px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("totalP_C")) {
                        return m.totalP_C;
                    }
                    return 0;
                })),
            )
        )
    );

    templateMap.set("totalIPTable_88", totalIPTableTemplate_88);
    templateMap.set("totalIPTable_89", totalIPTableTemplate_89);
    templateMap.set("totalIPTable_90", totalIPTableTemplate_90);
    templateMap.set("totalIPTable_91", totalIPTableTemplate_91);
    templateMap.set("totalIPTable_97", totalIPTableTemplate_97);

                

    return templateMap;
}