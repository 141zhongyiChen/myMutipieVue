/* eslint-disable */
import go from "gojs";
import { convertValueToAngle } from "../convertStatus.js";

export function initTemplate_KClock() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    var kclockTemplate_67 = GO(go.Node, "Table",
        { margin: 2.5 },
        GO(go.RowColumnDefinition, { row: 1 }),
        GO(go.RowColumnDefinition, { row: 2 }),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 提示
        {
            toolTip:
                GO(go.Adornment, "Vertical",
                    { background: "orange" },
                    // 第一段
                    GO(go.TextBlock, {
                        margin: 5,
                        font: "bold 17px Microsoft Yahei",
                        visible: false
                    }, new go.Binding("visible", "", function (d) {
                        if (d.hasOwnProperty("open1") && d.open1.length > 0) {
                            return true;
                        }
                        return false;
                    }), new go.Binding("text", "open1", function (d) {
                        return "第一段开关灯时间：" + d;
                    }))
                )
        },
        GO(go.Panel, "Spot",
            // 红色外圈
            GO(go.Shape, {
                figure: "Ellipse",
                width: 129,
                height: 129,
                fill: "white",
                stroke: "red",
                strokeWidth: 1.5
            }),
            // 绿色底部圆圈
            GO(go.Shape, {
                //position: new go.Point(3.5, 3.25),
                figure: "Ellipse",
                width: 122.5,
                height: 122.5,
                fill: GO(go.Brush, "Linear", {
                    0.0: "white",
                    1.0: "#399D39",
                    start: go.Spot.Left,
                    end: go.Spot.Right
                }),
                stroke: "gray",
                strokeWidth: 1
            }),
            GO(go.Panel, "Position",
                {
                    desiredSize: new go.Size(129, 129)
                },
                // 第一段开灯区域
                GO(go.Shape, {
                    geometryString: "",
                    fill: "red",
                    stroke: "red",
                    strokeWidth: 1
                }, new go.Binding("geometryString", "areaData_1")),
            ),
            // 时间刻度
            GO(go.Panel, "Graduated",
                {
                    name: "SCALE",
                    graduatedTickUnit: 2,
                    graduatedMax: 24,
                    position: new go.Point(5.25, 5.25),
                    background: "transparent",
                    stretch: go.GraphObject.None
                },
                GO(go.Shape, {
                    name: "SHAPE",
                    geometryString:
                        "M59.5,0  A59.5,59.5 0 1,1 59.5,119" +
                        "M59.5,119  A59.5,59.5 0 1,1 59.5,0",
                    stroke: null,
                    fill: null
                }), GO(go.Shape, {
                    figure: "Ellipse",
                    width: 3,
                    height: 3,
                    fill: "black"
                }),
                GO(go.TextBlock, {
                    interval: 1,
                    graduatedStart: 1 / 12,
                    alignmentFocus: go.Spot.Center,
                    font: "bold 13px Microsoft Yahei",
                    segmentOffset: new go.Point(0, 13)
                })
            ),
            // // 当前日期
            // GO(go.TextBlock, {
            //     stroke: "black",
            //     font: "bold 10px Microsoft Yahei",
            //     alignment: new go.Spot(0.5, 0.5, 2, -23)
            // }, new go.Binding("text", "date")),
            // // 当前时刻
            // GO(go.TextBlock, {
            //     stroke: "black",
            //     font: "bold 10px Microsoft Yahei",
            //     alignment: new go.Spot(0.5, 0.5, 2, -13)
            // }, new go.Binding("text", "time")),
            // 时针
            GO(go.Shape, {
                stroke: "black",
                fill: "black",
                strokeWidth: 1,
                geometryString: "F M-4,0 L0,-4 30,0 0,4z x M-30,0",
            }, new go.Binding("angle", "hours", convertValueToAngle)),
            // 分针
            GO(go.Shape, {
                stroke: "blue",
                fill: "blue",
                strokeWidth: 1,
                geometryString: "F M-4,0 L0,-4 45,0 0,4z x M-45,0",
            }, new go.Binding("angle", "minutes", convertValueToAngle)),
            // 秒针
            GO(go.Shape, {
                stroke: "yellow",
                fill: "yellow",
                strokeWidth: 2,
                geometryString: "F M-5,0 L58,0z x M-58,0",
            }, new go.Binding("angle", "seconds", convertValueToAngle)),
            // 小红点
            GO(go.Shape, "Circle", {
                width: 1.5,
                height: 1.5,
                stroke: "red",
                strokeWidth: 1,
                fill: "red"
            })
        ),
        GO(go.TextBlock, {
            row: 2,
            stroke: "black",
            textAlign: "center",
            font: "bold 15px Microsoft Yahei"
        }, new go.Binding("text", "indexK", function (index) {
            return "K" + index;
        }))
    );

    templateMap.set("kclock_67", kclockTemplate_67);

    return templateMap;
}

