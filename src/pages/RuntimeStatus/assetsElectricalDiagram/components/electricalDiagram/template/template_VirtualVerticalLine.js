/* eslint-disable */
import go from "gojs";

export function initTemplate_VirtualVerticalLine() {
    let GO = go.GraphObject.make;
    let templateMap = new Map();
    /****** 三相 ******/
    let vVerticalLineTemplate_42 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, {
            geometryString: "M0 0 V80z",
            strokeWidth: 2,
            stroke: "yellow"
        }),
        GO(go.Shape, {
            geometryString: "M15 10 V90z",
            strokeWidth: 2,
            stroke: "green"
        }),
        GO(go.Shape, {
            geometryString: "M30 20 V100z",
            strokeWidth: 2,
            stroke: "red"
        })
    );

    /****** A相 ******/
    let vVerticalLineTemplate_43 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, {
            geometryString: "M15 0 V80z",
            strokeWidth: 2,
            stroke: "yellow"
        })
    );

    /****** B相 ******/
    let vVerticalLineTemplate_44 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, {
            geometryString: "M15 10 V90z",
            strokeWidth: 2,
            stroke: "green"
        })
    );

    /****** C相 ******/
    let vVerticalLineTemplate_45 = GO(
        go.Node,
        "Position",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        GO(go.Shape, {
            geometryString: "M15 20 V100z",
            strokeWidth: 2,
            stroke: "red"
        })
    );

    templateMap.set("vVerticalLine_42", vVerticalLineTemplate_42);
    templateMap.set("vVerticalLine_43", vVerticalLineTemplate_43);
    templateMap.set("vVerticalLine_44", vVerticalLineTemplate_44);
    templateMap.set("vVerticalLine_45", vVerticalLineTemplate_45);

    return templateMap;
}