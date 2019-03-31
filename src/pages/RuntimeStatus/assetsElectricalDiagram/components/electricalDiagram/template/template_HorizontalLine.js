/* eslint-disable */
import go from "gojs";

export function initTemplate_HorizontalLine() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();

    let horizontalLineTemplate = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        // A相横线
        GO(go.Shape, {
            geometryString: "",
            strokeWidth: 3,
            stroke: "yellow"
        }, new go.Binding("geometryString", "", function (d) {
            let tempA = "";
            if (d.hasOwnProperty("hasPhaseA") && d.hasPhaseA === true) {
                let startA = 0;
                let endA = 0;
                if (d.hasOwnProperty("startPointA")) {
                    startA = d.startPointA;
                }
                if (d.hasOwnProperty("endPointA")) {
                    endA = d.endPointA;
                }

                tempA = "M" + startA + " 0 H" + endA + "z";
            }
            return tempA;
        })),
        // B相横线
        GO(go.Shape, {
            geometryString: "",
            strokeWidth: 3,
            stroke: "green"
        }, new go.Binding("geometryString", "", function (d) {
            let tempB = "";
            if (d.hasOwnProperty("hasPhaseB") && d.hasPhaseB === true) {
                let startB = 0;
                let endB = 0;
                if (d.hasOwnProperty("startPointB")) {
                    startB = d.startPointB;
                }
                if (d.hasOwnProperty("endPointB")) {
                    endB = d.endPointB;
                }

                tempB = "M" + startB + " 10 H" + endB + "z";
            }
            return tempB;
        })),
        // C相横线
        GO(go.Shape, {
            geometryString: "",
            strokeWidth: 3,
            stroke: "red"
        }, new go.Binding("geometryString", "", function (d) {
            let tempC = "";
            if (d.hasOwnProperty("hasPhaseC") && d.hasPhaseC === true) {
                let startC = 0;
                let endC = 0;
                if (d.hasOwnProperty("startPointC")) {
                    startC = d.startPointC;
                }
                if (d.hasOwnProperty("endPointC")) {
                    endC = d.endPointC;
                }

                tempC = "M" + startC + " 20 H" + endC + "z";
            }
            return tempC;
        }))
    );

    templateMap.set("horizontalLine", horizontalLineTemplate);

    return templateMap;
}