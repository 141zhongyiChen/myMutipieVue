<template>
  <div id="main-wrapper">
    <Row>
      <Col span="24">
        <div style="margin:8px;height:90vh;">
          <staticElectricalDiagram ref="myDiagram" v-on:create-ed-no-data="diagramCreateNoData"></staticElectricalDiagram>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
/* eslint-disable */
import staticElectricalDiagram from "./components/electricalDiagram/staticElectricalDiagram.vue";
import Vue from "vue";

export default {
  mounted() {
    let keyCode = this.$route.query.code;

    console.log("keyCode : " + keyCode);
    if (keyCode !== undefined) {
      this.$refs.myDiagram.queryDiagramData(keyCode, true, 7);
    }
  },
  components: {
    staticElectricalDiagram
  },
  methods: {
    diagramCreateNoData: function() {
      this.$Notice.error({
        title: "没有查询到电气图信息!",
        desc: "",
        duration: 0
      });
    }
  }
};
</script>

