/* eslint-disable */
import go from "gojs";

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

export function initTemplate_ChildMenuItem() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    // CT的二级菜单
    let ctAnalysisItem = GO(
        go.Part, "Table",
        new go.Binding("visible", "visible"),
        new go.Binding("location", "loc"),
        GO(go.Shape, {
            row: 0,
            alignment: go.Spot.Left,
            geometryString: "F M0,25 L7,0 L14,25 Z",
            strokeWidth: 1,
            stroke: "#007acc",
            fill: "#007acc"
        }),
        GO(go.Panel, "Auto",
            { row: 1, desiredSize: new go.Size(200, 25), background: "#007acc", stretch: go.GraphObject.Fill },
            GO(go.TextBlock, {
                verticalAlignment: go.Spot.Center,
                textAlign: "left",
                margin: new go.Margin(0, 0, 0, 10),
                stroke: "white",
                font: "bold 15px Microsoft Yahei"
            }, new go.Binding("text", "title")),
            GO(go.TextBlock, {
                desiredSize: new go.Size(25, 25),
                alignment: go.Spot.RightCenter,
                alignmentFocus: go.Spot.RightCenter,
                stretch: go.GraphObject.Vertical,
                textAlign: "center",
                text: "X",
                stroke: "#dd12f1",
                font: "bold 21px Microsoft Yahei",
                mouseEnter: function (e, obj) { obj.background = "blue"; },
                mouseLeave: function (e, obj) { obj.background = null; },
                click: ctItemClickClose
            })
        ),
        GO(go.Panel, "Table",
            { row: 2, background: "white", desiredSize: new go.Size(200, 60) },
            GO(go.TextBlock, {
                desiredSize: new go.Size(120, 30),
                textAlign: "center",
                verticalAlignment: go.Spot.Center,
                text: "电参数曲线分析",
                background: "#eeeef2",
                font: "15px Microsoft Yahei",
                mouseEnter: function (e, obj) { obj.background = "#c9def5"; },
                mouseLeave: function (e, obj) { obj.background = "#eeeef2"; },
                click: ctItemClickOpenAnalysis
            })
        )
    );

    templateMap.set("ctAI", ctAnalysisItem);

    return templateMap;
}

function ctItemClickClose(e, obj) {
    e.handled = true;

    let data = obj.part.data;
    let myDiagram = obj.part.diagram;

    myDiagram.model.startTransaction("childMenuItemClosed");
    myDiagram.model.setDataProperty(data, "visible", false);
    myDiagram.model.commitTransaction("childMenuItemClosed");
}

function ctItemClickOpenAnalysis(e, obj) {
    e.handled = true;

    let data = obj.part.data;

    let analysisEvent = new CustomEvent("analysisCT", {
        detail: {
            terminalCode: data.terminalCode,
            index: data.index,
            phase: data.phase
        },
        bubbles: true,
        cancelable: false
    })
    document.dispatchEvent(analysisEvent);
}
