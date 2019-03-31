/* eslint-disable */
import go from "gojs";
import { getReferenceCurrentDefaultNullStr, getCurrentDefaultZero, getActivePowerDefaultZero, getPowerFactorDefaultZero, getLIndexAndPhaseStrDefaultEmpty } from "../convertStatus.js";

export function initTemplate_CT() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();
    /****** A相 ******/
    let ctTemplate_9 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 0 V21z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 79 V100z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件形状
        GO(go.Shape, {
            geometryString: "M20 20 V80z",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        GO(go.Shape, {
            geometryString:
                "M20 30 A10 10 45 0 0 20 50" +
                "M20 50 A10 10 45 0 0 20 70" +
                "M20 30 H40" +
                "M20 70 H40",
            strokeWidth: 4,
            stroke: "black"
        }),
        // 表格
        GO(
            go.Panel, "Auto",
            { position: new go.Point(45, 25) },
            GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
            GO(go.Panel, "Table",
                GO(go.RowColumnDefinition, { column: 0, width: 43 }),
                GO(go.RowColumnDefinition, {
                    column: 1,
                    separatorStroke: "black",
                    width: 55
                }),
                GO(go.RowColumnDefinition, { row: 0, height: 17 }),
                GO(go.RowColumnDefinition, {
                    row: 1,
                    separatorStroke: "black",
                    height: 17
                }),
                GO(go.RowColumnDefinition, {
                    row: 2,
                    separatorStroke: "black",
                    height: 17
                }),
                GO(go.RowColumnDefinition, {
                    row: 3,
                    separatorStroke: "black",
                    height: 17
                }),
                // 参考电流
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(参)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        column: 1,
                        textAlign: "center",
                        stroke: "purple",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getReferenceCurrentDefaultNullStr)
                ),
                // 电流
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 1,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getCurrentDefaultZero)
                ),
                // 有功功率
                GO(go.TextBlock, {
                    row: 2,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 2,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getActivePowerDefaultZero)
                ),
                // 功率因数
                GO(go.TextBlock, {
                    row: 3,
                    textAlign: "center",
                    text: "cosφ",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 3,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getPowerFactorDefaultZero)
                )
            )
        ),
        // 编号
        GO(go.TextBlock, {
            position: new go.Point(50, 97),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "number", function (n) {
            return n.toString().padStart(3, "0");
        })),
        // 线路信息
        GO(go.TextBlock, {
            position: new go.Point(80, 97),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "", getLIndexAndPhaseStrDefaultEmpty)),
        // 警告标识
        GO(go.Panel, "Position",
            { position: new go.Point(25, 45), visible: false },
            new go.Binding("visible", "warning"),
            GO(go.Shape, {
                geometryString: "F M7.5,0 L0,15 L15,15 Z",
                stroke: "orange",
                fill: "orange"
            }),
            GO(go.TextBlock, {
                position: new go.Point(5.5, 1),
                text: "!",
                font: "bold 14px Microsoft Yahei"
            })
        )
    );

    /****** B相 ******/
    let ctTemplate_10 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 10 V31z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 79 V110z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件形状
        GO(go.Shape, {
            geometryString: "M20 30 V80z",
            strokeWidth: 2,
            stroke: "green"
        }),
        GO(go.Shape, {
            geometryString:
                "M20 30 A10 10 45 0 0 20 50" +
                "M20 50 A10 10 45 0 0 20 70" +
                "M20 30 H40" +
                "M20 70 H40",
            strokeWidth: 4,
            stroke: "black"
        }),
        // 表格
        GO(
            go.Panel,
            "Auto",
            { position: new go.Point(45, 25) },
            GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
            GO(
                go.Panel,
                "Table",
                GO(go.RowColumnDefinition, { column: 0, width: 43 }),
                GO(go.RowColumnDefinition, {
                    column: 1,
                    separatorStroke: "black",
                    width: 55
                }),
                GO(go.RowColumnDefinition, { row: 0, height: 17 }),
                GO(go.RowColumnDefinition, {
                    row: 1,
                    separatorStroke: "black",
                    height: 17
                }),
                GO(go.RowColumnDefinition, {
                    row: 2,
                    separatorStroke: "black",
                    height: 17
                }),
                GO(go.RowColumnDefinition, {
                    row: 3,
                    separatorStroke: "black",
                    height: 17
                }),
                // 参考电流
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(参)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        column: 1,
                        textAlign: "center",
                        stroke: "purple",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getReferenceCurrentDefaultNullStr)
                ),
                // 电流
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 1,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getCurrentDefaultZero)
                ),
                // 有功功率
                GO(go.TextBlock, {
                    row: 2,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 2,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getActivePowerDefaultZero)
                ),
                // 功率因数
                GO(go.TextBlock, {
                    row: 3,
                    textAlign: "center",
                    text: "cosφ",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 3,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getPowerFactorDefaultZero)
                )
            )
        ),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(50, 97),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 线路信息
        GO(
            go.TextBlock,
            {
                position: new go.Point(80, 97),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "", getLIndexAndPhaseStrDefaultEmpty)
        ),
        // 警告标识
        GO(go.Panel, "Position",
            { position: new go.Point(25, 45), visible: false },
            new go.Binding("visible", "warning"),
            GO(go.Shape, {
                geometryString: "F M7.5,0 L0,15 L15,15 Z",
                stroke: "orange",
                fill: "orange"
            }),
            GO(go.TextBlock, {
                position: new go.Point(5.5, 1),
                text: "!",
                font: "bold 14px Microsoft Yahei"
            })
        )
    );

    /****** C相 ******/
    let ctTemplate_11 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 20 V31z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 79 V120z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件形状
        GO(go.Shape, {
            geometryString: "M20 30 V80z",
            strokeWidth: 2,
            stroke: "red"
        }),
        GO(go.Shape, {
            geometryString:
                "M20 30 A10 10 45 0 0 20 50" +
                "M20 50 A10 10 45 0 0 20 70" +
                "M20 30 H40" +
                "M20 70 H40",
            strokeWidth: 4,
            stroke: "black"
        }),
        // 表格
        GO(
            go.Panel,
            "Auto",
            { position: new go.Point(45, 25) },
            GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
            GO(
                go.Panel,
                "Table",
                GO(go.RowColumnDefinition, { column: 0, width: 43 }),
                GO(go.RowColumnDefinition, {
                    column: 1,
                    separatorStroke: "black",
                    width: 55
                }),
                GO(go.RowColumnDefinition, { row: 0, height: 17 }),
                GO(go.RowColumnDefinition, {
                    row: 1,
                    separatorStroke: "black",
                    height: 17
                }),
                GO(go.RowColumnDefinition, {
                    row: 2,
                    separatorStroke: "black",
                    height: 17
                }),
                GO(go.RowColumnDefinition, {
                    row: 3,
                    separatorStroke: "black",
                    height: 17
                }),
                // 参考电流
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(参)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        column: 1,
                        textAlign: "center",
                        stroke: "purple",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getReferenceCurrentDefaultNullStr)
                ),
                // 电流
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 1,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getCurrentDefaultZero)
                ),
                // 有功功率
                GO(go.TextBlock, {
                    row: 2,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 2,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getActivePowerDefaultZero)
                ),
                // 功率因数
                GO(go.TextBlock, {
                    row: 3,
                    textAlign: "center",
                    text: "cosφ",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(
                    go.TextBlock,
                    {
                        row: 3,
                        column: 1,
                        textAlign: "center",
                        stroke: "lime",
                        font: "bold 12px Microsoft Yahei"
                    },
                    new go.Binding("text", "", getPowerFactorDefaultZero)
                )
            )
        ),
        // 编号
        GO(
            go.TextBlock,
            {
                position: new go.Point(50, 97),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "number", function (n) {
                return n.toString().padStart(3, "0");
            })
        ),
        // 线路信息
        GO(
            go.TextBlock,
            {
                position: new go.Point(80, 97),
                stroke: "#F0F8FF",
                font: "bold 12px Microsoft Yahei"
            },
            new go.Binding("text", "", getLIndexAndPhaseStrDefaultEmpty)
        ),
        // 警告标识
        GO(go.Panel, "Position",
            { position: new go.Point(25, 45), visible: false },
            new go.Binding("visible", "warning"),
            GO(go.Shape, {
                geometryString: "F M7.5,0 L0,15 L15,15 Z",
                stroke: "orange",
                fill: "orange"
            }),
            GO(go.TextBlock, {
                position: new go.Point(5.5, 1),
                text: "!",
                font: "bold 14px Microsoft Yahei"
            })
        )
    );

    /****** 三相 ******/
    let ctTemplate_86 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 进线
        GO(go.Shape, {
            geometryString: "M20 0 V21z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "Ain",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M35 10 V31z",
            strokeWidth: 2,
            stroke: "green",
            portId: "Bin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        GO(go.Shape, {
            geometryString: "M50 20 V31z",
            strokeWidth: 2,
            stroke: "red",
            portId: "Cin",
            toLinkable: true,
            toSpot: go.Spot.Top
        }),
        // 出线
        GO(go.Shape, {
            geometryString: "M20 79 V100z",
            strokeWidth: 2,
            stroke: "yellow",
            portId: "A",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M35 79 V110z",
            strokeWidth: 2,
            stroke: "green",
            portId: "B",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        GO(go.Shape, {
            geometryString: "M50 79 V120z",
            strokeWidth: 2,
            stroke: "red",
            portId: "C",
            fromLinkable: true,
            fromSpot: go.Spot.Bottom
        }),
        // 元件形状
        GO(go.Shape, {
            geometryString: "M20 20 V80z",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        GO(go.Shape, {
            geometryString: "M35 30 V80z",
            strokeWidth: 2,
            stroke: "green"
        }),
        GO(go.Shape, {
            geometryString: "M50 30 V80z",
            strokeWidth: 2,
            stroke: "red"
        }),
        GO(go.Shape, {
            geometryString:
                "M20 40 H70" +
                "M20 80 H70" +
                "M20 40 A10 10 45 0 0 20 60" +
                "M20 60 A10 10 45 0 0 20 80" +
                "M35 40 A10 10 45 0 0 35 60" +
                "M35 60 A10 10 45 0 0 35 80" +
                "M50 40 A10 10 45 0 0 50 60" +
                "M50 60 A10 10 45 0 0 50 80",
            strokeWidth: 4,
            stroke: "black"
        }),
        // 表格
        GO(go.Panel, "Auto",
            { position: new go.Point(73, 28) },
            GO(go.Shape, { fill: "transparent", stroke: "black", strokeWidth: 1 }),
            GO(go.Panel, "Table",
                GO(go.RowColumnDefinition, { column: 0, width: 41 }),
                GO(go.RowColumnDefinition, { column: 1, separatorStroke: "black", width: 45 }),
                GO(go.RowColumnDefinition, { column: 2, separatorStroke: "black", width: 45 }),
                GO(go.RowColumnDefinition, { column: 3, separatorStroke: "black", width: 45 }),
                GO(go.RowColumnDefinition, { row: 0, height: 18 }),
                GO(go.RowColumnDefinition, { row: 1, separatorStroke: "black", height: 17 }),
                GO(go.RowColumnDefinition, { row: 2, separatorStroke: "black", height: 17 }),
                GO(go.RowColumnDefinition, { row: 3, separatorStroke: "black", height: 17 }),
                // 参考电流
                GO(go.TextBlock, {
                    textAlign: "center",
                    text: "I(参)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    column: 1,
                    textAlign: "center",
                    stroke: "purple",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("reference_IA")) {
                        return m.reference_IA;
                    }
                    return "---";
                })),
                GO(go.TextBlock, {
                    column: 2,
                    textAlign: "center",
                    stroke: "purple",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("reference_IB")) {
                        return m.reference_IB;
                    }
                    return "---";
                })),
                GO(go.TextBlock, {
                    column: 3,
                    textAlign: "center",
                    stroke: "purple",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("reference_IC")) {
                        return m.reference_IC;
                    }
                    return "---";
                })),
                // 电流
                GO(go.TextBlock, {
                    row: 1,
                    textAlign: "center",
                    text: "I(A)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 1,
                    column: 1,
                    textAlign: "center",
                    stroke: "yellow",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("currentA")) {
                        return m.currentA;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 2,
                    textAlign: "center",
                    stroke: "green",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("currentB")) {
                        return m.currentB;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 1,
                    column: 3,
                    textAlign: "center",
                    stroke: "red",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("currentC")) {
                        return m.currentC;
                    }
                    return 0;
                })),
                // 有功功率
                GO(go.TextBlock, {
                    row: 2,
                    textAlign: "center",
                    text: "P(KW)",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 2,
                    column: 1,
                    textAlign: "center",
                    stroke: "yellow",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("activePowerA")) {
                        return m.activePowerA;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 2,
                    column: 2,
                    textAlign: "center",
                    stroke: "green",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("activePowerB")) {
                        return m.activePowerB;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 2,
                    column: 3,
                    textAlign: "center",
                    stroke: "red",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("activePowerC")) {
                        return m.activePowerC;
                    }
                    return 0;
                })),
                // 功率因数
                GO(go.TextBlock, {
                    row: 3,
                    textAlign: "center",
                    text: "cosφ",
                    font: "bold 12px Microsoft Yahei"
                }),
                GO(go.TextBlock, {
                    row: 3,
                    column: 1,
                    textAlign: "center",
                    stroke: "yellow",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("powerFactorA")) {
                        return m.powerFactorA;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 3,
                    column: 2,
                    textAlign: "center",
                    stroke: "green",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("powerFactorB")) {
                        return m.powerFactorB;
                    }
                    return 0;
                })),
                GO(go.TextBlock, {
                    row: 3,
                    column: 3,
                    textAlign: "center",
                    stroke: "red",
                    font: "bold 12px Microsoft Yahei"
                }, new go.Binding("text", "", function (m) {
                    if (m.hasOwnProperty("powerFactorC")) {
                        return m.powerFactorC;
                    }
                    return 0;
                }))
            )
        ),
        // 编号&线路信息
        GO(go.TextBlock, {
            position: new go.Point(82, 101),
            stroke: "#F0F8FF",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "", function (m) {
            return m.numberA.toString().padStart(3, "0") + "(" + m.indexA + "A) / " +
                m.numberB.toString().padStart(3, "0") + "(" + m.indexB + "B) / " +
                m.numberC.toString().padStart(3, "0") + "(" + m.indexC + "C)";
        })),
        // 警告标识
        GO(go.Panel, "Position",
            { position: new go.Point(55, 50), visible: false },
            new go.Binding("visible", "warning"),
            GO(go.Shape, {
                geometryString: "F M7.5,0 L0,15 L15,15 Z",
                stroke: "orange",
                fill: "orange"
            }),
            GO(go.TextBlock, {
                position: new go.Point(5.5, 1),
                text: "!",
                font: "bold 14px Microsoft Yahei"
            })
        )
    );

    templateMap.set("ct_9", ctTemplate_9);
    templateMap.set("ct_10", ctTemplate_10);
    templateMap.set("ct_11", ctTemplate_11);
    templateMap.set("ct_86", ctTemplate_86);

    return templateMap;
}
