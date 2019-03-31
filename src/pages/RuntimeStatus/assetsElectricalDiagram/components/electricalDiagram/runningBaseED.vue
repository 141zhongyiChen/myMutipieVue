<template>
  <div id="main-wrapper">
    <Row style="background:#3399FF;">
      <Col span="24">
        <span class="header">当前的实时运行状态图：{{diagramName}}({{diagramCode}})</span>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <div id="Diagram_Wrapper" style="height:100vh;" v-show="showDiagram">
          <staticElectricalDiagram
            ref="myDiagram"
            v-bind:compomentAllowSelect="false"
            v-bind:ctRaiseClickEvent="true"
            v-on:create-ed-completed="diagramCreateCompleted"
            v-on:update-status-completed="updateStatusCompleted"
          ></staticElectricalDiagram>
        </div>
        <div v-show="showAnalysisCT">
          <Row>
            <Col span="24">
              <Button class="bigButton" type="ghost" @click="closeAnalysisCT">关闭信息窗口</Button>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <dataAnalysisChart ref="ctAnalysis"></dataAnalysisChart>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from "vue";
import staticElectricalDiagram from "./staticElectricalDiagram.vue";
import dataAnalysisChart from "@/components/Charts/dataAnalysisChart.vue";

document.addEventListener("analysisCT", handleEvent_AnalysisCT);

let myvue = null;
let canUpdateStatusTimer = null;
let statusTimer = null;

export default {
  data() {
    return {
      diagramName: "", // 当前运行图的控制点名称
      diagramCode: "", // 当前运行图的控制点的编码
      showDiagram: true,
      showAnalysisCT: false,
      currentTerminalCode: ""
    };
  },
  components: {
    staticElectricalDiagram,
    dataAnalysisChart
  },
  mounted() {
    myvue = this;
  },
  methods: {
    diagramCreateCompleted: function() {
      if (canUpdateStatusTimer === null) {
        canUpdateStatusTimer = window.setTimeout(
          canUpdateStatusTimerCallback,
          2000
        );
      }
    },
    updateStatusCompleted: function(data) {
      if (statusTimer === null) {
        statusTimer = window.setTimeout(changeRunningStatus, 5000);
      }
    },
    closeAnalysisCT: function() {
      myvue.$data.showDiagram = true;
      myvue.$data.showAnalysisCT = false;
    },
    beginPaintElectricalDiagram: function(
      diagramName,
      diagramCode,
      objectCode,
      terminalCode
    ) {
      myvue.$refs.ctAnalysis.$data.isSelectNodeUpdateData = false;

      if (statusTimer !== null) {
        window.clearTimeout(statusTimer);
        statusTimer = null;
      }

      myvue.$data.diagramName = diagramName;
      myvue.$data.diagramCode = diagramCode;
      myvue.$data.currentTerminalCode = terminalCode;

      if (myvue.$refs.myDiagram !== undefined) {
        myvue.$refs.myDiagram.queryDiagramData(objectCode, false, 1);
      }
    },
    stopUpdateStatus: function() {
      if (statusTimer !== null) {
        window.clearTimeout(statusTimer);
        statusTimer = null;
      }
      if (canUpdateStatusTimer !== null) {
        window.clearTimeout(canUpdateStatusTimer);
        canUpdateStatusTimer = null;
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("analysisCT", handleEvent_AnalysisCT);
  }
};

function canUpdateStatusTimerCallback() {
  if (canUpdateStatusTimer !== null) {
    window.clearTimeout(canUpdateStatusTimer);
    canUpdateStatusTimer = null;
  }

  // changeRunningStatus();
}

function changeRunningStatus() {
  if (statusTimer !== null) {
    window.clearTimeout(statusTimer);
    statusTimer = null;
  }

  myvue.$refs.myDiagram.changeRunningStatus(myvue.$data.currentTerminalCode);
}

function handleEvent_AnalysisCT(e) {
  let data = e.detail;

  myvue.$data.showDiagram = false;

  myvue.$refs.ctAnalysis.InitDatatoShow(
    data.terminalCode,
    data.index,
    data.phase
  );
  myvue.$data.showAnalysisCT = true;
}
</script>

<style>
.header {
  padding-left: 10px;
}
.info,
.header {
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  vertical-align: middle;
}
.mButton {
  font-size: 15px;
}
.bigButton {
  font-size: 18px;
  font-weight: bold;
  margin: 5px;
  color: red;
}
</style>
