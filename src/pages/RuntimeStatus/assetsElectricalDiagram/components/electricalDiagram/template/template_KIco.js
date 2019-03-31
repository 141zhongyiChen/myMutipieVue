/* eslint-disable */
import go from "gojs";
import { convertStatusToArrowColor_KIco, convertStatusToArrowAngle_KIco, convertStatusToArrowLocation_KIco } from "../convertStatus.js";

(function () {
    try {
        new window.CustomEvent('T');
    } catch (e) {
        var CustomEvent = function (event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };

            var evt = document.createEvent('CustomEvent');

            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

            return evt;
        };

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    }
})();

export function initTemplate_KIco() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    let kicoTemplate_26 = GO(
        go.Node,
        "Position",
        { margin: 5 },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // 元件的矩形框
        GO(go.Shape, {
            figure: "RoundedRectangle",
            parameter1: 10,
            width: 125,
            height: 125,
            fill: "white"
        }),
        // K路自动状态的文字
        GO(go.TextBlock, {
            desiredSize: new go.Size(125, 20),
            position: new go.Point(0, 5),
            textAlign: "center",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "autoText")),
        // K路手动开灯状态的文字
        GO(go.TextBlock, {
            desiredSize: new go.Size(20, 65),
            position: new go.Point(4, 28),
            textAlign: "center",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "handOnText")),
        // K路手动关灯状态的文字
        GO(go.TextBlock, {
            desiredSize: new go.Size(20, 65),
            position: new go.Point(102, 28),
            textAlign: "center",
            font: "bold 12px Microsoft Yahei"
        }, new go.Binding("text", "handOffText")),
        // K路开灯操作区域
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(5, 5),
            width: 15,
            height: 15,
            fill: "red",
            stroke: null,
            click: function (e, obj) {
                let isDisable = false;
                if (obj.panel.data.hasOwnProperty("isDisable")) {
                    isDisable = obj.panel.data.isDisable;
                }
                if (!isDisable) {
                    let kSwitchEvent = new CustomEvent("userSwitchK", {
                        detail: {
                            kIndex: obj.panel.data.index,
                            action: "on",
                            eventSender: e,
                            graphObject: obj
                        },
                        bubbles: true,
                        cancelable: false
                    })
                    document.dispatchEvent(kSwitchEvent);
                }
            }
        }),
        // K路关灯操作区域
        GO(go.Shape, {
            figure: "Ellipse",
            position: new go.Point(105, 5),
            width: 15,
            height: 15,
            fill: "green",
            stroke: null,
            click: function (e, obj) {
                let isDisable = false;
                if (obj.panel.data.hasOwnProperty("isDisable")) {
                    isDisable = obj.panel.data.isDisable;
                }
                if (!isDisable) {
                    let kSwitchEvent = new CustomEvent("userSwitchK", {
                        detail: {
                            kIndex: obj.panel.data.index,
                            action: "off",
                            eventSender: e,
                            graphObject: obj
                        },
                        bubbles: true,
                        cancelable: false
                    })
                    document.dispatchEvent(kSwitchEvent);
                }
            }
        }),
        // 控制状态及输出状态
        GO(go.Shape, {
            geometryString: "F M17 0 L34 27 H24 V57 H10 V27 H0z",
            stroke: null
        }, new go.Binding("fill", "", convertStatusToArrowColor_KIco),
            new go.Binding("angle", "", convertStatusToArrowAngle_KIco),
            new go.Binding("position", "", convertStatusToArrowLocation_KIco)),
        // K路序号及名称
        GO(go.TextBlock, {
            desiredSize: new go.Size(125, 20),
            position: new go.Point(0, 125),
            textAlign: "center",
            font: "bold 15px Microsoft Yahei"
        }, new go.Binding("text", "", function (dataModel) {
            let temp = "K" + dataModel.index;
            if (dataModel.name !== null && dataModel.name.length > 0) {
                temp += ":" + dataModel.name;
            }

            return temp;
        })),
        // 断电保护 标识
        GO(go.TextBlock, {
            desiredSize: new go.Size(24, 30),
            position: new go.Point(20, 90),
            text: "断电保护",
            stroke: "red",
            textAlign: "center",
            font: "12px Microsoft Yahei"
        }, new go.Binding("visible", "", function (dataModel) {
            if (dataModel.hasOwnProperty("isLeakageProtection")) {
                if (dataModel.isLeakageProtection === true) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        })),
        // 停运 标识
        GO(go.TextBlock, {
            position: new go.Point(50, 95),
            text: "停运",
            stroke: "gray",
            textAlign: "center",
            font: "bold 16px Microsoft Yahei"
        }, new go.Binding("visible", "", function (dataModel) {
            if (dataModel.hasOwnProperty("isDisable")) {
                if (dataModel.isDisable === true) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }))
    );

    templateMap.set("kico_26", kicoTemplate_26);

    return templateMap;
}

