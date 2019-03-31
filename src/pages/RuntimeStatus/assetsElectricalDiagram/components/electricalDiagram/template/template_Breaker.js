/* eslint-disable */
import go from "gojs";
import { convertStatusAngle_OpenClose, convertStatusColor_OpenClose } from "../convertStatus.js";

export function initTemplate_Breaker() {
  let GO = go.GraphObject.make;
  let templateMap = new Map();
  /****** 三相（只有出线）******/
  let breakerTemplate1 = GO(
    go.Node,
    "Position",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // 三相进线（固定）
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(14, 0),
      width: 5,
      height: 5,
      fill: "yellow",
      stroke: "yellow"
    }),
    GO(go.Shape, {
      geometryString: "M16 0 V29z",
      strokeWidth: 2,
      stroke: "yellow"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(29, 0),
      width: 5,
      height: 5,
      fill: "green",
      stroke: "green"
    }),
    GO(go.Shape, {
      geometryString: "M31 0 V29z",
      strokeWidth: 2,
      stroke: "green"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(44, 0),
      width: 5,
      height: 5,
      fill: "red",
      stroke: "red"
    }),
    GO(go.Shape, {
      geometryString: "M46 0 V29z",
      strokeWidth: 2,
      stroke: "red"
    }),
    // 三相出线
    GO(go.Shape, {
      geometryString: "M15 90 V100z",
      strokeWidth: 2,
      stroke: "yellow",
      portId: "A",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    GO(go.Shape, {
      geometryString: "M30 90 V110z",
      strokeWidth: 2,
      stroke: "green",
      portId: "B",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    GO(go.Shape, {
      geometryString: "M45 90 V120z",
      strokeWidth: 2,
      stroke: "red",
      portId: "C",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    // 元件矩形框
    GO(go.Shape, {
      figure: "Rectangle",
      position: new go.Point(0, 30),
      width: 60,
      height: 60,
      strokeWidth: 4,
      stroke: "black",
      fill: "transparent"
    }),
    // 文字
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 50),
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "text")
    ),
    // 编号
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 70),
        stroke: "#F0F8FF",
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "number", function (n) {
        return ("000" + n).slice(-3);
      })
    ),
    // 断开、闭合动作
    GO(
      go.Shape,
      {
        geometryString: "M16 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    GO(
      go.Shape,
      {
        geometryString: "M31 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    GO(
      go.Shape,
      {
        geometryString: "M46 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    // 三相元件内部触点
    GO(go.Shape, {
      geometryString: "M15 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(11, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(11, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M15 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      geometryString: "M30 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M30 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      geometryString: "M45 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(41, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(41, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M45 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    })
  );

  /****** A相（只有出线）******/
  let breakerTemplate2 = GO(
    go.Node,
    "Position",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // 进线（固定）
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(29, 0),
      width: 5,
      height: 5,
      fill: "yellow",
      stroke: "yellow"
    }),
    GO(go.Shape, {
      geometryString: "M31 0 V29z",
      strokeWidth: 2,
      stroke: "yellow"
    }),
    // 出线
    GO(go.Shape, {
      geometryString: "M31 90 V100z",
      strokeWidth: 2,
      stroke: "yellow",
      portId: "A",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    // 元件矩形框
    GO(go.Shape, {
      figure: "Rectangle",
      position: new go.Point(0, 30),
      width: 60,
      height: 60,
      strokeWidth: 4,
      stroke: "black",
      fill: "transparent"
    }),
    // 文字
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 50),
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "text")
    ),
    // 编号
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 70),
        stroke: "#F0F8FF",
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "number", function (n) {
        return ("000" + n).slice(-3);
      })
    ),
    // 断开、闭合动作
    GO(
      go.Shape,
      {
        geometryString: "M31 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    // 元件内部触点
    GO(go.Shape, {
      geometryString: "M30 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M30 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    })
  );

  /****** B相（只有出线）******/
  let breakerTemplate3 = GO(
    go.Node,
    "Position",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // 进线（固定）
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(29, 0),
      width: 5,
      height: 5,
      fill: "green",
      stroke: "green"
    }),
    GO(go.Shape, {
      geometryString: "M31 0 V29z",
      strokeWidth: 2,
      stroke: "green"
    }),
    // 出线
    GO(go.Shape, {
      geometryString: "M31 90 V110z",
      strokeWidth: 2,
      stroke: "green",
      portId: "B",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    // 元件矩形框
    GO(go.Shape, {
      figure: "Rectangle",
      position: new go.Point(0, 30),
      width: 60,
      height: 60,
      strokeWidth: 4,
      stroke: "black",
      fill: "transparent"
    }),
    // 文字
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 50),
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "text")
    ),
    // 编号
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 70),
        stroke: "#F0F8FF",
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "number", function (n) {
        return ("000" + n).slice(-3);
      })
    ),
    // 断开、闭合动作
    GO(
      go.Shape,
      {
        geometryString: "M31 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    // 元件内部触点
    GO(go.Shape, {
      geometryString: "M30 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M30 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    })
  );

  /****** C相（只有出线）******/
  let breakerTemplate4 = GO(
    go.Node,
    "Position",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // 进线（固定）
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(29, 0),
      width: 5,
      height: 5,
      fill: "red",
      stroke: "red"
    }),
    GO(go.Shape, {
      geometryString: "M31 0 V29z",
      strokeWidth: 2,
      stroke: "red"
    }),
    // 三相出线
    GO(go.Shape, {
      geometryString: "M31 90 V120z",
      strokeWidth: 2,
      stroke: "red",
      portId: "C",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    // 元件矩形框
    GO(go.Shape, {
      figure: "Rectangle",
      position: new go.Point(0, 30),
      width: 60,
      height: 60,
      strokeWidth: 4,
      stroke: "black",
      fill: "transparent"
    }),
    // 文字
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 50),
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "text")
    ),
    // 编号
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 70),
        stroke: "#F0F8FF",
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "number", function (n) {
        return ("000" + n).slice(-3);
      })
    ),
    // 断开、闭合动作
    GO(
      go.Shape,
      {
        geometryString: "M31 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    // 三相元件内部触点
    GO(go.Shape, {
      geometryString: "M30 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M30 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    })
  );

  /****** 三相（进线&出线）******/
  let breakerTemplate34 = GO(
    go.Node,
    "Position",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // 三相进线
    GO(go.Shape, {
      geometryString: "M16 0 V29z",
      strokeWidth: 2,
      stroke: "yellow",
      portId: "Ain",
      toLinkable: true,
      toSpot: go.Spot.Top
    }),
    GO(go.Shape, {
      geometryString: "M31 10 V29z",
      strokeWidth: 2,
      stroke: "green",
      portId: "Bin",
      toLinkable: true,
      toSpot: go.Spot.Top
    }),
    GO(go.Shape, {
      geometryString: "M46 20 V29z",
      strokeWidth: 2,
      stroke: "red",
      portId: "Cin",
      toLinkable: true,
      toSpot: go.Spot.Top
    }),
    // 三相出线
    GO(go.Shape, {
      geometryString: "M15 90 V100z",
      strokeWidth: 2,
      stroke: "yellow",
      portId: "A",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    GO(go.Shape, {
      geometryString: "M30 90 V110z",
      strokeWidth: 2,
      stroke: "green",
      portId: "B",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    GO(go.Shape, {
      geometryString: "M45 90 V120z",
      strokeWidth: 2,
      stroke: "red",
      portId: "C",
      fromLinkable: true,
      fromSpot: go.Spot.Bottom
    }),
    // 元件矩形框
    GO(go.Shape, {
      figure: "Rectangle",
      position: new go.Point(0, 30),
      width: 60,
      height: 60,
      strokeWidth: 4,
      stroke: "black",
      fill: "transparent"
    }),
    // 文字
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 50),
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "text")
    ),
    // 编号
    GO(
      go.TextBlock,
      {
        position: new go.Point(70, 70),
        stroke: "#F0F8FF",
        font: "bold 12px Microsoft Yahei"
      },
      new go.Binding("text", "number", function (n) {
        return ("000" + n).slice(-3);
      })
    ),
    // 断开、闭合动作
    GO(
      go.Shape,
      {
        geometryString: "M16 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    GO(
      go.Shape,
      {
        geometryString: "M31 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    GO(
      go.Shape,
      {
        geometryString: "M46 49 V73z",
        strokeWidth: 2
      },
      new go.Binding("angle", "", convertStatusAngle_OpenClose),
      new go.Binding("stroke", "", convertStatusColor_OpenClose)
    ),
    // 三相元件内部触点
    GO(go.Shape, {
      geometryString: "M15 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(11, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(11, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M15 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      geometryString: "M30 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(26, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M30 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      geometryString: "M45 30 V39z",
      strokeWidth: 4,
      stroke: "black"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(41, 39),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      figure: "Ellipse",
      position: new go.Point(41, 73),
      width: 10,
      height: 10,
      strokeWidth: 2,
      stroke: "black",
      fill: "transparent"
    }),
    GO(go.Shape, {
      geometryString: "M45 81 V90z",
      strokeWidth: 4,
      stroke: "black"
    })
  );

  templateMap.set("breaker_1", breakerTemplate1);
  templateMap.set("breaker_2", breakerTemplate2);
  templateMap.set("breaker_3", breakerTemplate3);
  templateMap.set("breaker_4", breakerTemplate4);
  templateMap.set("breaker_34", breakerTemplate34);

  return templateMap;
}