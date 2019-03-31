<template>
  <div id="myDiagramDiv" style="width:100%; height:100%; background:gray;"></div>
</template>

<script>
/* eslint-disable */
import go from "gojs";
import moment from "moment";
import { API_TREES } from "api/config";
import { initTemplate_BJIco } from "./template/template_BJIco.js";
import { initTemplate_Breaker } from "./template/template_Breaker.js";
import { initTemplate_Contactor } from "./template/template_Contactor.js";
import { initTemplate_CT } from "./template/template_CT.js";
import { initTemplate_KIco } from "./template/template_KIco.js";
import { initTemplate_AirSwitch } from "./template/template_AirSwitch.js";
import { initTemplate_OutCable } from "./template/template_OutCable.js";
import { initTemplate_Load } from "./template/template_Load.js";
import { initTemplate_VirtualPoint } from "./template/template_VirtualPoint.js";
import { initTemplate_VirtualVerticalLine } from "./template/template_VirtualVerticalLine.js";
import { initTemplate_KClock } from "./template/template_KClock.js";
import { initTemplate_HorizontalLine } from "./template/template_HorizontalLine.js";
import { initTemplate_TimeTable } from "./template/template_TimeTable.js";
import { initTemplate_VoltageTable } from "./template/template_VoltageTable.js";
import { initTemplate_TotalIPTable } from "./template/template_TotalIPTable.js";
import { initTemplate_Fuse } from "./template/template_Fuse.js";
import { initTemplate_ChildMenuItem } from "./template/template_childMenuItem.js";
import { initTemplate_KnifeSwitch } from "./template/template_KnifeSwitch.js";
import { initTemplate_EnergySave } from "./template/template_EnergySave.js";
import { initTemplate_LineFrequencyTable } from "./template/template_LineFrequencyTable.js";
import { changeStatus } from "./changeRunningStatus.js";

let GO = go.GraphObject.make;
let myDiagram;
let templateMap = null;
let currentKeyCode = "";
let currentTerminalCode = "";
let myvue = null;
let linePhaseRatioMap = new Map();
let kClockTimerID = null;
let kClockDataArray = [];

function CustomLink() {
  go.Link.call(this);
}
go.Diagram.inherit(CustomLink, go.Link);

CustomLink.prototype.computeEndSegmentLength = function(
  node,
  port,
  spot,
  from
) {
  let esl = go.Link.prototype.computeEndSegmentLength.call(
    this,
    node,
    port,
    spot,
    from
  );
  let other = this.getOtherPort(port);
  if (port !== null && other !== null) {
    let thispt = port.getDocumentPoint(this.computeSpot(from));
    let otherpt = other.getDocumentPoint(this.computeSpot(!from));
    if (
      Math.abs(thispt.x - otherpt.x) > 20 ||
      Math.abs(thispt.y - otherpt.y) > 20
    ) {
      let idx = -1;
      if (port.portId !== null && port.portId.length > 0) {
        let keyId = port.portId.slice(0, 1);
        switch (keyId) {
          case "A":
            idx = 0;
            break;
          case "B":
            idx = 1;
            break;
          case "C":
            idx = 2;
            break;
          default:
            break;
        }
      }

      let count = 3;
      if (otherpt.x < thispt.x) {
        return esl + 4 + idx * 8;
      } else {
        return esl + (count - idx - 1) * 8;
      }
    }
  }
  return esl;
};

CustomLink.prototype.hasCurviness = function() {
  if (isNaN(this.curviness)) return true;
  return go.Link.prototype.hasCurviness.call(this);
};

CustomLink.prototype.computeCurviness = function() {
  if (isNaN(this.curviness)) {
    let fromnode = this.fromNode;
    let fromport = this.fromPort;
    let fromspot = this.computeSpot(true);
    let frompt = fromport.getDocumentPoint(fromspot);
    let tonode = this.toNode;
    let toport = this.toPort;
    let tospot = this.computeSpot(false);
    let topt = toport.getDocumentPoint(tospot);
    if (Math.abs(frompt.x - topt.x) > 20 || Math.abs(frompt.y - topt.y) > 20) {
      if (
        (fromspot.equals(go.Spot.Left) || fromspot.equals(go.Spot.Right)) &&
        (tospot.equals(go.Spot.Left) || tospot.equals(go.Spot.Right))
      ) {
        let fromseglen = this.computeEndSegmentLength(
          fromnode,
          fromport,
          fromspot,
          true
        );
        let toseglen = this.computeEndSegmentLength(
          tonode,
          toport,
          tospot,
          false
        );
        let c = (fromseglen - toseglen) / 2;
        if (frompt.x + fromseglen >= topt.x - toseglen) {
          if (frompt.y < topt.y) return c;
          if (frompt.y > topt.y) return -c;
        }
      } else if (
        (fromspot.equals(go.Spot.Top) || fromspot.equals(go.Spot.Bottom)) &&
        (tospot.equals(go.Spot.Top) || tospot.equals(go.Spot.Bottom))
      ) {
        let fromseglen = this.computeEndSegmentLength(
          fromnode,
          fromport,
          fromspot,
          true
        );
        let toseglen = this.computeEndSegmentLength(
          tonode,
          toport,
          tospot,
          false
        );
        let c = (fromseglen - toseglen) / 2;
        if (frompt.x + fromseglen >= topt.x - toseglen) {
          if (frompt.y < topt.y) return c;
          if (frompt.y > topt.y) return -c;
        }
      }
    }
  }
  return go.Link.prototype.computeCurviness.call(this);
};

export default {
  name: "diagram",
  props: {
    compomentAllowSelect: {
      type: Boolean,
      default: true
    },
    ctRaiseClickEvent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      diagram: myDiagram
    };
  },
  mounted() {
    myvue = this;
    myDiagram = GO(go.Diagram, "myDiagramDiv", {
      // grid: GO(go.Panel, "Grid",
      //     GO(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
      //     GO(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
      //     GO(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
      //     GO(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
      // ),
      "undoManager.isEnabled": true,
      isReadOnly: true,
      allowSelect: myvue.compomentAllowSelect,
      // isReadOnly: false,
      // allowSelect: true,
      "animationManager.isEnabled": false, // turn off automatic animations
      initialAutoScale: go.Diagram.Uniform,
      initialContentAlignment: go.Spot.Top,
      // any initial diagram is centered in the viewport
      //initialContentAlignment: go.Spot.Center,
      // have mouse wheel events zoom in and out instead of scroll up and down
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      scrollMode: go.Diagram.InfiniteScroll // go.Diagram.DocumentScroll
    });

    loadComponentTemplate();

    let templmap = new go.Map("string", go.Node);

    templateMap.forEach(function(value, key) {
      templmap.add(key, value);
    }, templateMap);

    myDiagram.nodeTemplateMap = templmap;

    myDiagram.linkTemplate = GO(
      CustomLink,
      {
        routing: go.Link.AvoidsNodes,
        corner: 3,
        //curve: go.Link.JumpGap,
        //curve: go.Link.JumpOver,
        toShortLength: -2,
        fromShortLength: -2,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true
      },
      new go.Binding("points").makeTwoWay(),
      GO(
        go.Shape,
        { strokeWidth: 2 },
        new go.Binding("stroke", "fromPort", function(obj) {
          if ("portId" in obj) {
            switch (obj.portId) {
              case "A":
                return "yellow";
              case "B":
                return "green";
              case "C":
                return "red";
              default:
                return "black";
            }
          }
          return "black";
        }).ofObject()
      )
    );

    // event
    // myDiagram.addDiagramListener("ChangedSelection", function(e) {
    //   console.log("has selected.");
    //   if (e.diagram.selection.count > 0) {
    //     // 元件对象
    //     let item = e.diagram.selection.first();
    //     // 元件数据
    //     let data = item.data;

    //     console.log(data);
    //   }
    //   // var part = e.subject.part;
    //   // if (!(part instanceof go.Link)) {
    //   //   console.log("Clicked on " + part.data.key);
    //   // }
    // });

    myDiagram.addDiagramListener("ObjectDoubleClicked", handleDoubleClickedCT);

    if (myvue.$props.compomentAllowSelect) {
      myDiagram.addDiagramListener(
        "ObjectSingleClicked",
        handleSingleClickedComponent
      );
    }

    myvue.$emit("staticElectricalDiagram-mounted");
  },
  methods: {
    queryDiagramData: function(keyCode, isAssets, platformNumber) {
      // 停止K路时钟的定时器
      stopKClockTimer();
      // 清空画布的数据
      myDiagram.model.nodeDataArray = [];

      currentKeyCode = keyCode;
      let request = JSON.stringify({
        ObjectCode: keyCode,
        PlatformNumber: platformNumber,
        IsAssets: isAssets
      });
      let url = API_TREES;

      $.ajax({
        //url: url,
        url: 'static/gojs.json',
        //type: "POST",
        type: "GET",
        data: {
          active: "ElectricalDiagramData.GetElectricalDiagramSavedData",
          request: request
        },
        dataType: "json",
        timeout: 0,
        error: function(ex) {
          console.log("error!");
        },
        success: function(res) {
          const resArr = JSON.parse(JSON.stringify(res))
          if (resArr.length) {
            resArr.forEach(data => {
              // 本次返回的数据与当前查询的对象相一致时
              if (data.objectCode === currentKeyCode) {
                console.log(data);
                if (data.nodeDataList.length > 0) {
                  // 添加二级操作区域数据
                  data.nodeDataList.push({
                    key: -1,
                    category: "ctAI",
                    visible: false
                  });

                  document.getElementById("myDiagramDiv").style.backgroundColor =
                    data.backgroundColor;
                  myDiagram.model = GO(go.GraphLinksModel, {
                    linkFromPortIdProperty: "fromPort", // required information:
                    linkToPortIdProperty: "toPort", // identifies data property names
                    nodeDataArray: data.nodeDataList,
                    linkDataArray: [
                      // no predeclared links
                    ]
                  });

                  // 线路相关的变比数据
                  let ctArray = data.nodeDataList.filter(
                    x => x.cType === "CT" || "ThreePhaseCT"
                  );
                  handleLinePhaseRatioMap(ctArray);

                  // K路时钟元件的数据处理
                  data.nodeDataList
                    .filter(x => x.cType === "KClock")
                    .forEach(function(data) {
                      kClockDataArray.push(data);
                    });
                  handleKClockDateTime();

                  // 激发事件
                  myvue.$emit("create-ed-completed");
                } else {
                  myvue.$emit("create-ed-no-data");
                  document.getElementById("myDiagramDiv").style.backgroundColor =
                    "rgba(0,0,0,1)";
                }
              }
            })
          }
        }
      });
    },
    changeRunningStatus: function(terminalCode) {
      currentTerminalCode = terminalCode;

      let request = JSON.stringify({
        TerminalCode: terminalCode,
        HelpDictionary: null
      });
      let url = API_TREES;

      $.ajax({
        url: url,
        type: "POST",
        data: {
          active: "ElectricalDiagramData.GetElectricalDiagramRunningStatus",
          request: request
        },
        dataType: "json",
        timeout: 0,
        error: function(ex) {
          console.log("error!");
        },
        success: function(statusData) {
          // 本次返回的数据与当前查询的对象相一致时
          if (statusData.terminalCode === currentTerminalCode) {
            //console.log(statusData);

            let model = myDiagram.model;
            model.startTransaction("change_status");

            model.nodeDataArray.forEach(function(item, index, array) {
              switch (item.cType) {
                case "BJIco":
                  changeStatus.forBJIco(
                    model,
                    item,
                    statusData.bjStatusDictionary
                  );
                  break;
                case "Breaker":
                  changeStatus.forBreaker(
                    model,
                    item,
                    statusData.bjStatusDictionary
                  );
                  break;
                case "KnifeSwitch":
                  changeStatus.forKnifeSwitch(
                    model,
                    item,
                    statusData.bjStatusDictionary
                  );
                  break;
                case "ACContactor":
                  changeStatus.forContactor(
                    model,
                    item,
                    statusData.bjStatusDictionary
                  );
                  break;
                case "CT":
                  changeStatus.forCT(
                    model,
                    item,
                    statusData.lineStatusDictionary,
                    statusData.kStatusDictionary,
                    statusData.isOnline
                  );
                  break;
                case "ThreePhaseCT":
                  changeStatus.forThreePhaseCT(
                    model,
                    item,
                    statusData.lineStatusDictionary,
                    statusData.kStatusDictionary,
                    statusData.isOnline
                  );
                  break;
                case "KIco":
                  changeStatus.forKIco(
                    model,
                    item,
                    statusData.kStatusDictionary
                  );
                  break;
                case "AirSwitch":
                  changeStatus.forAirSwitch(
                    model,
                    item,
                    statusData.bjStatusDictionary
                  );
                  break;
                case "Load":
                  changeStatus.forLoad(
                    model,
                    item,
                    statusData.bjStatusDictionary
                  );
                  break;
                case "NetworkUpdateTimeTable":
                  changeStatus.forTimeTable(
                    model,
                    item,
                    statusData.networkUpdateTimeStr
                  );
                  break;
                case "DataUpdateTimeTable":
                  changeStatus.forTimeTable(
                    model,
                    item,
                    statusData.dataUpdateTimeStr
                  );
                  break;
                case "VoltageTable":
                  let voltageA = 0;
                  let voltageB = 0;
                  let voltageC = 0;
                  let isIn = false;
                  switch (item.direction) {
                    case "Input":
                      isIn = true;
                      voltageA = statusData.inputUA;
                      voltageB = statusData.inputUB;
                      voltageC = statusData.inputUC;
                      break;
                    case "Output":
                      isIn = false;
                      voltageA = statusData.outputUA;
                      voltageB = statusData.outputUB;
                      voltageC = statusData.outputUC;
                      break;
                    default:
                      break;
                  }
                  changeStatus.forVoltageTable(
                    model,
                    item,
                    isIn,
                    voltageA,
                    voltageB,
                    voltageC
                  );
                  break;
                case "TotalIPTable":
                  changeStatus.forTotalIPTable(
                    model,
                    item,
                    statusData.lineStatusDictionary,
                    linePhaseRatioMap
                  );
                  break;
                case "KClock":
                  changeStatus.forKClock(
                    model,
                    item,
                    statusData.kStatusDictionary
                  );
                  break;
                case "LineFrequencyTable":
                  changeStatus.forLineFrequency(
                    model,
                    item,
                    statusData.lineFrequency
                  );
                  break;
                default:
                  break;
              }
            });

            model.commitTransaction("change_status");
          }

          // 激发事件
          myvue.$emit("update-status-completed", statusData.refreshTimeStr);
        }
      });
    },
    setCurrentTerminalCode: function(terminalCode) {
      currentTerminalCode = terminalCode;
    }
  }
};

// 处理线路相关变比数据
function handleLinePhaseRatioMap(ctArray) {
  linePhaseRatioMap.clear();

  ctArray.forEach(function(item) {
    switch (item.cType) {
      case "CT":
        /******** 单相CT ********/
        if (!linePhaseRatioMap.has(item.indexL)) {
          // 不存在该线路记录，直接添加
          let newPhaseRatioMap = new Map();
          newPhaseRatioMap.set(item.phase, item.ratio);
          linePhaseRatioMap.set(item.indexL, newPhaseRatioMap);
        } else {
          // 已存在该线路记录，判断是否需要添加该相序的信息
          let phaseRatioMap = linePhaseRatioMap.get(item.indexL);
          if (!phaseRatioMap.has(item.phase)) {
            phaseRatioMap.set(item.phase, item.ratio);
          }
        }
        break;
      case "ThreePhaseCT":
        /******** 三相CT ********/
        // A相
        if (!linePhaseRatioMap.has(item.indexA)) {
          let newPhaseRatioMapA = new Map();
          newPhaseRatioMapA.set("A", item.ratioA);
          linePhaseRatioMap.set(item.indexA, newPhaseRatioMapA);
        } else {
          let phaseRatioMapA = linePhaseRatioMap.get(item.indexA);
          if (!phaseRatioMapA.has("A")) {
            phaseRatioMapA.set("A", item.ratioA);
          }
        }
        // B相
        if (!linePhaseRatioMap.has(item.indexB)) {
          let newPhaseRatioMapB = new Map();
          newPhaseRatioMapB.set("B", item.ratioB);
          linePhaseRatioMap.set(item.indexB, newPhaseRatioMapB);
        } else {
          let phaseRatioMapB = linePhaseRatioMap.get(item.indexB);
          if (!phaseRatioMapB.has("B")) {
            phaseRatioMapB.set("B", item.ratioB);
          }
        }
        // C相
        if (!linePhaseRatioMap.has(item.indexC)) {
          let newPhaseRatioMapC = new Map();
          newPhaseRatioMapC.set("C", item.ratioC);
          linePhaseRatioMap.set(item.indexC, newPhaseRatioMapC);
        } else {
          let phaseRatioMapC = linePhaseRatioMap.get(item.indexC);
          if (!phaseRatioMapC.has("C")) {
            phaseRatioMapC.set("C", item.ratioC);
          }
        }
        break;
      default:
        break;
    }
  });
}

function stopKClockTimer() {
  kClockDataArray.length = 0;
  if (kClockTimerID !== null) {
    window.clearInterval(kClockTimerID);
    kClockTimerID = null;
  }
}

function handleKClockDateTime() {
  if (kClockDataArray.length > 0 && kClockTimerID === null) {
    kClockTimerID = window.setInterval(function() {
      // 当前日期&时间
      let dtNow = moment();
      let dateStr = dtNow.format("YYYY-MM-DD");
      let timeStr = dtNow.format("HH:mm:ss");
      let hours = dtNow.hours();
      let minutes = dtNow.minutes();
      let seconds = dtNow.seconds();

      myDiagram.startTransaction("k_clock date time update");
      kClockDataArray.forEach(function(nodeData) {
        myDiagram.model.setDataProperty(nodeData, "time", timeStr);
        myDiagram.model.setDataProperty(nodeData, "date", dateStr);
        myDiagram.model.setDataProperty(
          nodeData,
          "hours",
          hours + minutes / 60 + seconds / 60 / 60
        );
        myDiagram.model.setDataProperty(
          nodeData,
          "minutes",
          (minutes * 24) / 60
        );
        myDiagram.model.setDataProperty(
          nodeData,
          "seconds",
          (seconds * 24) / 60
        );
      });
      myDiagram.commitTransaction("k_clock date time update");
    }, 1000);
  }
}

// 处理电流互感器元件的事件
function handleDoubleClickedCT(e) {
  let part = e.subject.part;
  if (!(part instanceof go.Link)) {
    let objData = part.data;

    if (objData.hasOwnProperty("cType")) {
      let keyType = objData.cType;
      switch (keyType) {
        case "CT":
        case "ThreePhaseCT":
          if (myvue.ctRaiseClickEvent) {
            let location = getComponentCenterLocation(part.actualBounds);
            displayChildMenuByCT(location.x, location.y, objData);
          }
          break;
        default:
          break;
      }
    }
  }
}

function handleSingleClickedComponent(e) {
  let part = e.subject.part;
  if (!(part instanceof go.Link)) {
    let objData = part.data;

    if (objData.hasOwnProperty("cType")) {
      let keyType = objData.cType;
      let objectCode = currentKeyCode;
      let terminalCode = currentTerminalCode;
      let setCode = "NNN";
      let k = -1;
      let bj = -1;
      let l = -1;
      let phase = "N";
      let isOK = false;

      switch (keyType) {
        case "EnergySavingDevice":
        case "Breaker":
        case "Fuse":
        case "ACContactor":
        case "CT":
        case "KnifeSwitch":
        case "AirSwitch":
        case "OutCable":
        case "Load":
          bj = objData.indexBJ;
          k = objData.indexK;
          l = objData.indexL;
          phase = objData.phase;
          isOK = true;
          setCode = objData.number.toString().padStart(3, "0");
          break;
        case "ThreePhaseCT":
          bj = objData.bjIndexA;
          k = objData.kIndexA;
          l = objData.indexA;
          phase = "T";
          isOK = true;
          break;
        default:
          break;
      }

      if (isOK) {
        let info = {
          objectCode: objectCode,
          terminalCode: terminalCode,
          setCode: setCode,
          indexK: k,
          indexBJ: bj,
          indexL: l,
          phase: phase,
          type: keyType
        };
        myvue.$emit("component-logic-information", info);
      }
    }
  }
}

function getComponentCenterLocation(actualBounds) {
  let height = actualBounds.height;
  let width = actualBounds.width;
  let x = actualBounds.x;
  let y = actualBounds.y;

  return new go.Point(width / 2 + x, height + y);
}

function displayChildMenuByCT(x, y, nodeData) {
  let model = myDiagram.model;
  let childArray = model.nodeDataArray.filter(function(element) {
    return element.category === "ctAI";
  });

  if (childArray.length > 0) {
    let terminalCode = currentTerminalCode;
    let index = nodeData.cType === "CT" ? nodeData.indexL : nodeData.indexA;
    let phase = nodeData.cType === "CT" ? nodeData.phase : "A";
    let title =
      nodeData.cType === "CT"
        ? "第" + index + "路" + phase + "相"
        : "第" + index + "路";

    model.startTransaction("displayChildMenuByCT");
    model.setDataProperty(childArray[0], "loc", new go.Point(x, y));
    model.setDataProperty(childArray[0], "title", title);
    model.setDataProperty(childArray[0], "visible", true);
    model.setDataProperty(childArray[0], "terminalCode", terminalCode);
    model.setDataProperty(childArray[0], "index", index);
    model.setDataProperty(childArray[0], "phase", phase);
    model.commitTransaction("displayChildMenuByCT");
  }
}

/******** 元件模板 ********/
function loadComponentTemplate() {
  templateMap = new Map([
    ...initTemplate_BJIco(),
    ...initTemplate_Breaker(),
    ...initTemplate_Contactor(),
    ...initTemplate_CT(),
    ...initTemplate_KIco(),
    ...initTemplate_AirSwitch(),
    ...initTemplate_OutCable(),
    ...initTemplate_Load(),
    ...initTemplate_VirtualPoint(),
    ...initTemplate_VirtualVerticalLine(),
    ...initTemplate_KClock(),
    ...initTemplate_HorizontalLine(),
    ...initTemplate_TimeTable(),
    ...initTemplate_VoltageTable(),
    ...initTemplate_TotalIPTable(),
    ...initTemplate_Fuse(),
    ...initTemplate_ChildMenuItem(),
    ...initTemplate_KnifeSwitch(),
    ...initTemplate_EnergySave(),
    ...initTemplate_LineFrequencyTable()
  ]);
}
</script>
