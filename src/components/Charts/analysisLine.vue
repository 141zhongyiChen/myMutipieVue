<template>
  <div class="rightDiv" >
    <div style="width:150px;background-color:#F5F5F5;height:100%;margin-top:-36px;"  id="content_Left">
      <div style="margin-top:34px;">
        <h2 style="background-color: #0A59B5;color:#fff;padding:5px">
          基本数据分析
          <span style="cursor: default;padding: 0px 5px;color:#fff;"  v-on:click="collapseClick($event)">&lt;</span>
        </h2>
        <ul id="myUl" style="list-style: none;margin:16px;" >
          <todo-item  v-on:liClickHandler="selectedClick" style="padding:3px 13px; font-size: 20px;font-weight: bold;height: 36px;color:#000;cursor: default"
                      v-for="item in sites" v-bind:todo="item" :key="item.text"  :id="item.id"></todo-item>
        </ul>
      </div>
    </div>
    <div  id="divChart" style="position:absolute;left:150px;top:2px;background-color: #fff;">
      <div>
        <span style="color:blue;font-size: 14px;position: absolute;left:68px;top: 0px; background-color: #fff;">参数</span>
        <table id="mydt" style="height:120px;margin-left:5px;width:800px; border: 1px solid #A7A5A5;margin-top: 10px;">
          <tr >
            <td >
              <span style="color:blue;width: 30px;">元件序号：</span>
            </td>
            <td >
              <select  id="mySelect"  @change="Onchange"  v-model="LineNumCode" style="width:120px;border: solid 1px #4D4848;
                 -moz-border-radius: 5px;height: 32px; -webkit-border-radius: 5px;  border-radius:5px;font-size: 16px;"  placeholder="请选择元件序号">
                <option style="font-size: 18px;" v-for="(planInfo,index) in NumberList" :key="index" :value="planInfo.value" >{{planInfo.value}}</option>
              </select>
            </td>
            <td>
              <span style="padding-left: 50px;color:blue;">显示开始：</span>
            </td>
            <td >
              <DatePicker format="yyyy-MM-dd" @on-change="SelectSDateClick" type="date" :value="value1"   show-week-numbers style="width: 230px;border: solid 1px #4D4848; -moz-border-radius: 5px; -webkit-border-radius: 5px;  border-radius:5px"></DatePicker>
            </td>
            <td rowspan="2" style="">
              <button style="font-size: 18px; cursor:default; margin-left:62px;width:120px;border-radius:5px;height:34px;line-height:34px;background-color:lightgray;color:#151515;font-weight: bold;border:
                 solid 1px #4D4848; " v-on:click="onclickAnalysis">分析</button>
            </td>
          </tr>
          <tr style="margin-top: -5px;">
            <td>
              <span style="color:blue;width: 30px;">相对编号：</span>
            </td>
            <td >
              <select  id="lineCombox"  @change="Onchange"  v-model="PhaseLine"  style="width:120px;border: solid 1px #4D4848;
                font-size: 16px; -moz-border-radius: 5px;height: 32px; -webkit-border-radius: 5px;  border-radius:5px"  >
                <option style="font-size: 18px;" v-for="(line, index) in LineList" :value="line.value" :key="index">{{ line.value }}</option>
              </select>
            </td>
            <td >
              <span style="padding-left: 50px;color:blue;">显示结束：</span>
            </td>
            <td >
              <DatePicker format="yyyy-MM-dd" type="date" :value="value2" @on-change="SelectEDateClick" placeholder="请选择结束日期"  show-week-numbers style="width: 230px;border: solid 1px #4D4848; -moz-border-radius: 5px; -webkit-border-radius: 5px;  border-radius:5px"></DatePicker>
            </td>
          </tr>
        </table>
      </div>
      <div style="margin-left:5px;margin-top: 10px; background-color:#F0F8FF;border: #ADD8E6 solid 1px;" id="chartBox">
        <div style="text-align: -moz-center;text-align: -webkit-center;margin: 0 auto;width: 356px;">
          <p style="font-size: 28px;font-weight:bold;text-align: -moz-center;text-align: -webkit-center;margin: 0 auto;">{{picTitle}}</p>
          <p style="font-size: 14px;color:purple;margin: 0 auto;">{{TerminalMes}}</p>
        </div>
        <Chart1 ref="myChart"></Chart1>
      </div>
    </div>
  </div>
</template>
<script>
import Chart1 from './LineChart'
import { mapGetters, mapMutations } from 'vuex'
/*import { getTreeData } from 'api/getTreeData'
  import { getUniqueData } from './js/getUniqueData'*/
import Vue from 'vue'
import 'jquery'
var selectedLi = null
// 定义我的报表数据显示内容
var typeData = 'Current'
var picTitle = '负荷电流'
// 定义我的报表数据源
var chartData = null
var s = 2
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li  v-on:click="liClickEvent($event)">{{ todo.text }}</li>',
  methods: {
    liClickEvent: function (a) {
      if (selectedLi != null) {
        selectedLi.style.setProperty('background-color', '#F5F5F5')
        selectedLi.style.setProperty('color', '#000')
      }
      selectedLi = a.currentTarget
      selectedLi.style.setProperty('background-color', '#2986F2')
      selectedLi.style.setProperty('color', '#fff')
      typeData = selectedLi.id.slice(3)
      picTitle = selectedLi.innerHTML
      if (chartData != null) {
        this.$emit('liClickHandler') // 监听
      }
    }
  }

})
export default {
  name: 'analysisLine',
  components: {
    Chart1
  },
  data () {
    return {
      lineSelectplaceholder: '请选择相对编码',
      isShow: true,
      sites: [
        {text: '负荷电流', id: 'li_Current'},
        {text: '输入电压', id: 'li_InputU'},
        {text: '输出电压', id: 'li_OutputU'},
        {text: '有功功率', id: 'li_AveragePower'},
        {text: '无功功率', id: 'li_ReactivePower'},
        {text: '视在功率', id: 'li_ApparentPower'},
        {text: '功率因数', id: 'li_PowerFactory'}
      ],
      LineList: [],
      NumberList: [],
      picTitle: '负荷电流曲线图',
      allCodeName: {},
      TerminalMes: '',
      value1: null,
      value2: null,
      curCode: '',
      sDate: null,
      eDate: null,
      curCodeName: '',
      isShowSelected: true, //是否根据选中终端变换开加载数据
      PhaseLine: '', //绝对编码
      LineNumCode: '' //元件序号

    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'respondData',
      'treeSelectedArr'
    ])
  },
  watch: {
    // 监听树列表当前选中事件
    respondData (nodes) {
      if (nodes.length > 0) {
        nodes.map((node, index) => {
          this.allCodeName[node.objData.terminalCode] = node.title
        })
      }
    },
    treeSelectedArr (Nodes) {
      if (this.isShowSelected && Nodes !== null && Nodes !== undefined && Nodes.length > 0) {
        this.curCode = Nodes[0].objData.terminalCode
        this.curCodeName = Nodes[0].title
        this.getInitData(Nodes[0].objData.terminalCode)
      }
    }
  },
  methods: {
    ...mapMutations('treeModule', {
      setRespondData: 'SET_RESPOND_DATA'
    }),
    Onchange(evt) {
      //console.log(evt)
      var i = evt.target.options.selectedIndex
      if (i >= 0) {
        this.selectOnchange(i)
      }
    },
    selectOnchange (index) {
      if (index >= 0 && this.LineList.length > 0 && this.LineList.length > index) {
        this.PhaseLine = this.LineList[index].value//绝对编码
        this.LineNumCode = this.NumberList[index].value//元件序号 LineList: [],
        this.onclickAnalysis()
      }
    },
    // 实时运行状态图功能调用方法
    InitDatatoShow(terminalCode, Line, Phase) {
      if (terminalCode.length > 0) {
        this.isShowSelected = false
        this.curCode = terminalCode
        this.curCodeName = this.allCodeName[terminalCode]
        var divChart = document.getElementById('divChart')
        divChart.style.setProperty('left', '150px')
        var myPhaseLine = Phase + '/' + Line
        this.getInitData(terminalCode, myPhaseLine)
      }
    },
    getInitData(terminalCode, myPhaseLine) {
      console.log('test')
      var obj = this.$data
      var my = this
      if (obj.LineList.length > 1) {
        obj.LineList = []
      }
      if (obj.NumberList.length > 1) {
        obj.NumberList = []
      }
      var data = []
      my.$refs.myChart.initChart(typeData, picTitle, data)
      obj.picTitle = picTitle + '详情曲线图'
      obj.TerminalMes = this.$data.curCodeName + '(' + obj.curCode + ')'
      $.ajax({
        url: window.dataURL,
        type: 'POST',
        data: {
          active: 'AnalysisOfHistoricalElectricParameter.GetLinePhaseNumber',
          code: terminalCode
        },
        dataType: 'json',
        timeout: 0,
        error: function (r) { console.log('error!') },
        success: function (re) {
          // console.log()
          if (re.PhaseLines !== undefined && re.PhaseLines != null) {
            obj.LineList = re.PhaseLines
            if (obj.isShowSelected) {
              obj.PhaseLine = re.PhaseLines[0].value
            }
            var Phase = obj.PhaseLine.slice(0, 1)
            var LineNumber = obj.PhaseLine.slice(2)
            obj.TerminalMes = obj.curCodeName + '(' + obj.curCode + ')' + '线路' + LineNumber + Phase + '相'
            // console.log(re.CompomentNumbers)
          }
          if (re.CompomentNumbers !== undefined && re.CompomentNumbers != null) {
            obj.NumberList = re.CompomentNumbers
            if (obj.isShowSelected) {
              obj.LineNumCode = re.CompomentNumbers[0].value
            } else {
              var n = 0
              while (re.PhaseLines.length > n) {
                var item = re.PhaseLines[n]
                if (item.value === myPhaseLine) {
                  my.selectOnchange(n)
                  n = re.PhaseLines.length
                }
                n++
              }
            }
            my.onclickAnalysis()
          }
        }
      })
    },
    recordX () {
      let _this = this
      let disX = event.clientX - this.$refs.nav.offsetWidth
      document.onmousemove = function () {
        let ev = event
        let mouseMoveX = ev.clientX
        let width = mouseMoveX - disX
        _this.$refs.nav.style.width = width + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      if (event.preventDefault) {
        event.preventDefault()
      }
    },
    _getTreeData () {
      /*getTreeData().then((res) => {
          this.setRespondData(getUniqueData(res))
        })*/
    },
    toggleShow () {
      this.isShow = !this.isShow
    },
    SelectSDateClick (val, foremat) {
      this.$data.sDate = val
    },
    SelectEDateClick (val, foremat) {
      this.$data.eDate = val
    },
    // 分析按钮点击事件
    onclickAnalysis () {
      if (this.$data.PhaseLine.length > 0 && this.$data.sDate.length > 0 && this.$data.eDate.length > 0 && this.$data.curCode.length > 0) {
        var Codes = this.$data.curCode
        var Phase = this.$data.PhaseLine.slice(0, 1)
        var LineNumber = this.$data.PhaseLine.slice(2)
        var BeginTime = this.$data.sDate
        var EndTime = this.$data.eDate
        var mychart = this.$refs.myChart
        var ob = this
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'AnalysisOfHistoricalElectricParameter.MyMain',
            Codes: Codes,
            isCheckedLine: true,
            LineNumber: LineNumber,
            Phase: Phase,
            BeginTime: BeginTime,
            EndTime: EndTime,
            isTableFormat: 'false'
          },
          dataType: 'json',
          timeout: 0,
          error: function (e) {
            ob.$Message.info('error')
          },
          success: function (re) {
            chartData = re
            ob.TerminalMes = ob.curCodeName + '(' + ob.curCode + ')' + '线路' + LineNumber + Phase + '相'
            if (re['CollectedTime'] !== undefined && re['CollectedTime'].length > 0) {
              // console.log(re.InputU)
              // console.log(re.OutputU)
              mychart.initChart(typeData, picTitle, re)
            }
          }
        })
      } else {
        this.$Message.info('请将查询条件选择完整后，再重试！')
      }
    },
    // 元件选中事件
    // 左边显示负载电流 、输入电压、输出电压。。。。。。
    selectedClick: function () {
      this.$data.picTitle = picTitle + '详情曲线图'
      this.$data.TerminalMes = chartData.TerminalCode + '(' + chartData.TerminalName + ')' + '线路' + chartData.LineNumber + chartData.Phase + '相'
      this.$refs.myChart.initChart(typeData, picTitle, chartData)
    },
    // 左边方法折叠
    collapseClick: function (e) {
      var el = document.getElementById('myUl')
      var obj = document.getElementById('content_Left')
      var divChart = document.getElementById('divChart')
      var ew = document.getElementById('chartBox').style.getPropertyValue('width')
      var left = '374px'
      if (s === 2) {
        e.currentTarget.innerHTML = '&gt'
        el.style.setProperty('display', 'none')
        obj.style.setProperty('width', '26px')
        obj.style.setProperty('background-color', '#08366C')
        left = '38px'
        divChart.style.setProperty('left', left)
        document.getElementById('chartBox').style.setProperty('width', (Number(ew.slice(0, ew.length - 2)) + 120) + 'px')
        s = 1
      } else {
        e.currentTarget.innerHTML = '&lt'
        el.style.setProperty('display', 'block')
        obj.style.setProperty('width', '150px')
        obj.style.setProperty('background-color', '#F5F5F5')
        left = '150px'
        divChart.style.setProperty('left', left)
        document.getElementById('chartBox').style.setProperty('width', (ew.slice(0, ew.length - 2) - 120) + 'px')
        s = 2
      }
      // alert(document.getElementById('chartBox').style.getPropertyValue('width'))
    },
    // 树节点点击事件
    NodeSelected: function () {
    },
    initTime (days) {
      var curTime = new Date()
      var lastdays = days
      var thisDay = curTime.getDate()
      var t = new Date(curTime.getFullYear(), curTime.getMonth(), 0).getDate()
      if (thisDay > lastdays) {
        return curTime.getFullYear() + '-' + (curTime.getMonth() + 1) + '-' + (thisDay - lastdays)
      } else if (curTime.getMonth() !== 1) {
        return curTime.getFullYear() + '-' + (curTime.getMonth()) + '-' + ((t + thisDay - lastdays))
      } else {
        return (curTime.getFullYear() - 1) + '-12' + '-' + ((t + thisDay - lastdays))
      }
    }
  },
  created () {
    // this._getTreeData()
  },
  mounted () {
    var t = this.initTime(7)
    this.$data.sDate = t
    this.$data.value1 = t
    var t1 = this.initTime(0)
    this.$data.eDate = t1
    this.$data.value2 = t1
  }
}
$(function () {
  var elements = $('#myUl').children('li:first-child')
  if (elements.length > 0) {
    selectedLi = elements[0]
    elements[0].style.setProperty('background-color', '#2986F2')
    elements[0].style.setProperty('color', '#fff')
  }
})
</script>

<style>
  .rightDiv{
    height:100%;
    margin-left:0px;float: left;
    width:84%;
    background:#fff;
  }
  #mydt>tr>td>div> .ivu-select-selection>div>.ivu-select-selected-value{
    font-size: 18px !important;
  }
  #content_Left>ul>li{
    background-color:#C4D6EA !important
  }
  #mydt>tr>td>div>.ivu-date-picker-rel>div>input{
    font-size: 18px !important;
  }
  #content_Left>h2>span:hover{
    background-color:#C4D6EA
  }
  #mydt> tr>td> span
  {
    font-size: 18px;
  }
</style>
