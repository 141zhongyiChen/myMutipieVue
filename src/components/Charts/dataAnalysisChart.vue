<template>
  <div id="left_Content"   style="position: relative; border: 1px solid #007ACC;border-top: 2px solid #007ACC;padding-top: 5px;overflow-y: auto;" >
    <div >
      <div  id="divChart" style="position:absolute;left:150px;top:6px;background-color: #fff;">
        <div style="margin-top: 250px;" id="chartBox">
          <Chart1 ref="myChart" :width="chartW" :height="chartH"></Chart1>
        </div>
      </div>
    </div>
    <div id="divcontent" style="min-width: 1050px;">
      <div  id="mydt" style="height: 126px;display: inline-block;margin-left: 5px;float: left;">
        <p style="height: 42px;line-height: 42px;">
          <span style="color:blue;width: 30px;">元件序号:</span>
          <select  id="mySelect"  @change="Onchange"  v-model="LineNumCode" style="width:80px;border: solid 1px silver;
                 -moz-border-radius: 5px;height: 30px; -webkit-border-radius: 5px;  border-radius:5px;font-size: 16px;"  placeholder="请选择元件序号">
            <option style="font-size: 18px;" v-for="(planInfo,index) in NumberList" :key="index" :value="planInfo" >{{planInfo}}</option>
          </select>
          <span style="padding-left: 10px;color:blue;">显示开始：</span>
          <DatePicker format="yyyy-MM-dd" @on-change="SelectSDateClick" type="date" :value="sDate"   show-week-numbers
                      style="width:170px;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px"></DatePicker>
          <button style="font-size: 16px;cursor:default;margin-left:15px;width:80px;border-radius:5px;height:34px;
              line-height:34px; background-color:lightgray;color:#151515;
              border:solid 1px silver;top:24px;position: relative;background: #EEEEF2;" v-on:click="onclickAnalysis">曲线分析</button>
        </p>
        <p style="height: 36px;line-height: 36px;">
          <span style="color:blue;width: 30px;">相对编号:</span>
          <select  id="lineCombox"  @change="Onchange"  v-model="PhaseLine"  style="width:80px;border: solid 1px silver;
                font-size: 16px; -moz-border-radius: 5px;height: 30px; -webkit-border-radius: 5px;  border-radius:5px"  >
            <option style="font-size: 18px;" v-for="(line, index) in LineList" :value="line" :key="index">{{ line }}</option>
          </select>
          <span style="padding-left:10px;color:blue;">显示结束：</span>
          <DatePicker format="yyyy-MM-dd" type="date" :value="eDate" @on-change="SelectEDateClick" placeholder="请选择结束日期"  show-week-numbers
                      style="width:170px;-moz-border-radius:5px;-webkit-border-radius: 5px; border-radius:5px"></DatePicker>
        </p>
        <ul style="width: 260px;font-size:12pt;margin-top:3px; " v-show="Showlimitul">
          <li style="display: inline-block;" v-if="showUPvalue">
            <input @change="checkLimitLine(!check1, 1)" checked="checked" type="checkbox" style="margin-left: 1px;"/>
            <span style="padding-right: 21px;color: red;">上限是否启用</span>
          </li>
          <li style="display: inline-block;" v-if="showDownvalue">
            <input @change="checkLimitLine(!check2, 2)" checked="checked" type="checkbox" style="margin-left: 1px;"/>
            <span style="color: green;">下限是否启用</span>
          </li>
        </ul>
        <p style="float:top; width: 280px;margin-top: 3px;left: 73px;" v-show="picTitle.indexOf('电流') >= 0 || picTitle.indexOf('有功功率') >= 0">
          <button style="height:23px;line-height: 18px;" @click="ShowLineType(0)">{{picTitle.replace(/曲线图/g,'')}}</button>
          <button style="height:23px;line-height: 18px;" @click="ShowLineType(1)">偏差值曲线</button>
          <button style="height:23px;line-height: 18px;" @click="ShowLineType(2)">百分比曲线</button>
        </p>
      </div>
      <div style="height: 126px;display: inline-block;margin-left: 15px;float: left; border: 1px solid silver;top:-126px;border-bottom: none;">
        <ul class="ul_H">
          <li style="width: 70px;padding-left: 2px;">窗口序号</li>
          <li  style="width: 40px;padding-left: 2px;">颜色</li>
          <li  style="width: 123px;padding-left: 22px;">参考日期</li>
          <li  style="width: 123px;padding-left: 22px;">电流值(A)</li>
          <li style="width: 123px;padding-left: 5px;border-right: none;">有功功率值(W)</li>
        </ul>
        <ul class="ul_H" v-for="(obj,key) in listWinData" :key="'win' + key" >
          <li style="width: 70px;padding-left: 2px;"><p style="text-align: center;">{{key + 1}}</p></li>
          <li  style="width: 40px;padding-left: 2px;"><p style="text-align: center;"><span :style="'padding: 1px 10px;background:' + obj.color +';'"></span></p></li>
          <li  style="width: 123px;padding-left: 22px;">{{obj.date}}</li>
          <li  style="width: 123px;padding-left: 22px;">{{obj.I}}</li>
          <li style="width: 123px;padding-left: 5px;border-right: none;">{{obj.P}}</li>
        </ul>
      </div>
    </div>
    <div v-show="showTypeLine" id="content_Left"  style=" width:144px;float: left;top: 0px;background: #F5F5F5;position: absolute;">
      <p style="background-color: #0A59B5;color:#fff;padding:5px;font-size: 17px;font-weight: bold;">
        基本数据分析
        <span style="cursor: default;padding: 0px 5px;color:#fff;"  v-on:click="collapseClick($event)">&lt;</span>
      </p>
      <ul id="myUl" style="list-style: none;margin:16px;" >
        <li style="padding:3px 13px; font-size: 20px;font-weight: bold;height: 36px;color:#000;cursor: default"
            v-for="(item, index) in sites"  :key="item.text"  :id="'li'+index" v-on:click="selectedClick('li'+index, item.text, item.id)">{{ item.text }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import MainFrame from 'components/masterFrame/masterFrame'
import Chart1 from 'components/Charts/chartMoreLine'
import { mapGetters, mapMutations } from 'vuex'
import { getTreeData } from 'api/getTreeData'
import { getUniqueData } from 'common/js/getUniqueData'
import 'jquery'
// 定义我的报表数据显示内容
var typeData = 'Current'
var picTitle = '负荷电流'
// 定义我的报表数据源
var chartData = null
var s = 2
export default {
  name: 'dataAnalysisChart',
  props: {
    //界面值是否根据选中终端切换
    isSelectNodeUpdateData: {
      type: Boolean,
      default: true
    }
  },
  components: {
    MainFrame,
    Chart1
  },
  data () {
    return {
      FunctionName: '历史电参数曲线分析',
      lineSelectplaceholder: '请选择相对编码',
      isShow: true,
      chartW: (function () {
        // console.log($(''))
        var num1w = (document.body.clientWidth - 475)
        if (num1w > 1000) {
          return (num1w + 'px')
        } else {
          return '1000px'
        }
      }()),
      chartH: (function () {
        var num1h = (document.body.clientHeight - 330)
        if (num1h > 350) {
          return (num1h + 'px')
        } else { return '350px' }
      }()),
      curliId: 'li0',
      sites: [
        {text: '负荷电流', id: 'Current'},
        {text: '输入电压', id: 'InputU'},
        {text: '输出电压', id: 'OutputU'},
        {text: '有功功率', id: 'AveragePower'},
        {text: '无功功率', id: 'ReactivePower'},
        {text: '视在功率', id: 'ApparentPower'},
        {text: '功率因数', id: 'PowerFactory'}
      ],
      listWinData: [
        {
          color: 'lime',
          st: '--',
          et: '--',
          date: '--',
          I: '--',
          P: '--'
        },
        {
          color: '#00999B',
          st: '--',
          et: '--',
          date: '--',
          I: '--',
          P: '--'
        },
        {
          color: 'orangered',
          st: '--',
          et: '--',
          date: '--',
          I: '--',
          P: '--'
        }
      ], //时间窗口数据
      LineList: [],
      showTypeLine: true,
      NumberList: [],
      LineNumCode: '',
      picTitle: '负荷电流曲线图',
      TerminalMes: '',
      curCode: '',
      PhaseLine: '',
      sDate: null,
      eDate: null,
      curCodeName: '',
      limitValues: {},
      check1: true,
      check2: true,
      showUPvalue: true,
      showDownvalue: true,
      Showlimitul: true //是否显示上下限值是否启用选择框
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
    },
    treeSelectedArr (Nodes) {
      if (this.isSelectNodeUpdateData === true) {
        if (this.LineList.length > 1) {
          this.LineList = []
        }
        if (this.NumberList.length > 1) {
          this.NumberList = []
        }
        this.curCode = Nodes[0].objData.terminalCode
        this.curCodeName = Nodes[0].title
        this.picTitle = picTitle + '详情曲线图'
        this.TerminalMes = this.$data.curCodeName + '(' + this.curCode + ')'
        this.getLimitValues(this.curCode)
      }
    }
  },
  methods: {
    ...mapMutations('treeModule', {
      setRespondData: 'SET_RESPOND_DATA'
    }),
    Onchange(evt) {
      var i = evt.target.options.selectedIndex
      if (i >= 0) {
        this.selectOnchange(i)
      }
    },
    checkLimitLine(val, type) {
      if (type === 1) {
        this.check1 = val
      } else { this.check2 = val }
      this.ShowLineType(0)
    },
    ShowLineType(val) {
      var isup = this.check1
      var isdown = this.check2
      if (val !== 1 && val !== 2) {
        this.Showlimitul = true
      } else {
        this.Showlimitul = false
        isup = false
        isdown = false
      }
      this.$refs.myChart.ShowLineType(val, isup, isdown)
    },
    // 实时运行状态图功能调用方法
    InitDatatoShow(terminalCode, Line, Phase, terminalName, height) {
      this.isSelectNodeUpdateData = false
      if (this.LineList.length > 1) {
        this.LineList = []
      }
      if (this.NumberList.length > 1) {
        this.NumberList = []
      }
      if (!isNaN(height) && Number(height) > 0) {
        $('#left_Content').height(height + 'px')
      }
      this.curCode = terminalCode
      this.PhaseLine = Phase + '/' + Line
      this.curCodeName = terminalName
      this.picTitle = picTitle + '详情曲线图'
      this.TerminalMes = this.$data.curCodeName + '(' + this.curCode + ')'
      this.getLimitValues(this.curCode)
    },
    selectOnchange (index) {
      if (index >= 0 && this.LineList.length > 0) {
        this.PhaseLine = this.LineList[index]//绝对编码
        this.LineNumCode = this.NumberList[index]//元件序号 LineList: [],
        this.$data.TerminalMes = this.curCode + '(' + this.curCodeName + ')' + '第' + this.PhaseLine.substring(2, 3) + '路' + this.PhaseLine.substring(0, 1) + '相'
        this.$refs.myChart.TerminalMes = this.TerminalMes
        this.onclickAnalysis()
        this.HandleDataToShow(index)
      } else {
        var re = {}
        re[typeData] = []
        re.CollectedTime = []
        this.$refs.myChart.initChart(typeData, picTitle, re, -1, -1)
      }
    },
    getselectLimit() {
      var limitUp = -1
      var limitDwon = -1
      if (this.curliId === 'li0') { //负载电流曲线
        if (this.limitValues[this.PhaseLine] !== undefined) {
          limitUp = this.limitValues[this.PhaseLine].max
          limitDwon = this.limitValues[this.PhaseLine].min
        }
      } else if (this.curliId === 'li1' || this.curliId === 'li2') { //输入电压曲线
        var key = this.curliId === 'li1' ? 'Input' : 'Output'
        key = key + 'U_'
        if (this.PhaseLine.indexOf('A') > -1) { key = key + 'A' } else if (this.PhaseLine.indexOf('B') > -1) { key = key + 'B' } else if (this.PhaseLine.indexOf('C') > -1) { key = key + 'C' }
        if (this.limitValues[key] !== undefined) {
          limitUp = this.limitValues[key].max
          limitDwon = this.limitValues[key].min
        }
      }
      this.showDownvalue = limitDwon > -1
      this.showUPvalue = limitUp > -1
      return [limitDwon, limitUp]
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
      getTreeData().then((res) => {
        this.setRespondData(getUniqueData(res))
      })
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
        this.$data.limitDwon = -1
        this.$data.limitUp = -1
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
            if (re['CollectedTime'] !== undefined && re['CollectedTime'].length > 0) {
              var minmax = ob.getselectLimit()
              var limitDwon = minmax[0]
              var limitUp = minmax[1]
              mychart.initChart(typeData, picTitle, re, limitUp, limitDwon)
            } else {
              re[typeData] = []
              re.CollectedTime = []
              mychart.initChart(typeData, picTitle, re, -1, -1)
            }
          }
        })
      } else {
        this.$Message.info('请将查询条件选择完整后，再重试！')
      }
    },
    // 元件选中事件
    // 左边显示负载电流 、输入电压、输出电压。。。。。。
    selectedClick: function (id, text, key) {
      var el = null
      this.Showlimitul = true
      if (this.curliId !== undefined && this.curliId.length > 0) {
        el = $('#' + this.curliId)
        el.css('background-color', '#F5F5F5')
        $('#' + this.curliId).css('color', '#000')
      }
      this.curliId = id
      el = $('#' + this.curliId)
      $('#' + this.curliId).css('background-color', '#2986F2')
      $('#' + this.curliId).css('color', '#fff')
      typeData = key
      picTitle = text
      if (this.curCode !== undefined && this.curCode.length > 0) {
        this.$data.picTitle = picTitle + '详情曲线图'
        var minmax = this.getselectLimit()
        var limitDwon = minmax[0]
        var limitUp = minmax[1]
        this.$data.TerminalMes = chartData.TerminalCode + '(' + chartData.TerminalName + ')' + '线路' + chartData.LineNumber + chartData.Phase + '相'
        this.$refs.myChart.TerminalMes = this.TerminalMes
        this.$refs.myChart.initChart(typeData, picTitle, chartData, limitUp, limitDwon)
      }
    },
    // 左边方法折叠
    collapseClick: function (e) {
      var el = document.getElementById('myUl')
      var obj = document.getElementById('content_Left')
      var divChart = document.getElementById('divChart')
      if (s === 2) {
        e.currentTarget.innerHTML = '&gt'
        el.style.setProperty('display', 'none')
        obj.style.setProperty('width', '26px')
        obj.style.setProperty('background-color', '#08366C')
        divChart.style.setProperty('left', '34px')
        s = 1
      } else {
        e.currentTarget.innerHTML = '&lt'
        el.style.setProperty('display', 'block')
        obj.style.setProperty('width', '144px')
        obj.style.setProperty('background-color', '#F5F5F5')
        divChart.style.setProperty('left', '150px')
        s = 2
      }
    },
    // 树节点点击事件
    NodeSelected: function () {
    },
    getLimitValues (TerminalCode) {
      var my = this
      my.limitValues = {}
      $.ajax({
        url: window.dataURL,
        type: 'POST',
        data: {
          active: 'AlarmLimit2.Main',
          method: 'getLimitUIData',
          codes: TerminalCode
        },
        error: function (e) { console.log(e) },
        success: function (re) {
          if (re.toString() !== '0') {
            var arr = JSON.parse(re)
            var arrU = arr.Udata
            var arrI = arr.Idata
            if (arrU !== undefined && arrU.length > 0) {
              // 输入下/上限值
              my.limitValues['InputU_A'] = {min: my.HandleStrVal(arrU[0].AUnderInputV), max: my.HandleStrVal(arrU[0].AOverInputV)}
              my.limitValues['InputU_B'] = {min: my.HandleStrVal(arrU[0].BUnderInputV), max: my.HandleStrVal(arrU[0].BOverInputV)}
              my.limitValues['InputU_C'] = {min: my.HandleStrVal(arrU[0].CUnderInputV), max: my.HandleStrVal(arrU[0].COverInputV)}
              // 输出下/上限值
              my.limitValues['OutputU_A'] = {min: my.HandleStrVal(arrU[0].AUnderOutputV), max: my.HandleStrVal(arrU[0].AOverOutputV)}
              my.limitValues['OutputU_B'] = {min: my.HandleStrVal(arrU[0].BUnderOutputV), max: my.HandleStrVal(arrU[0].BOverOutputV)}
              my.limitValues['OutputU_C'] = {min: my.HandleStrVal(arrU[0].CUnderOutputV), max: my.HandleStrVal(arrU[0].COverOutputV)}
            }
            if (arrI !== undefined && arrI.length > 0) {
              arrI.map((data) => {
                // 电流值
                my.limitValues['A/' + data.Line] = {min: my.HandleStrVal(data.AUnderCurrent), max: my.HandleStrVal(data.AOverCurrent)}
                my.limitValues['B/' + data.Line] = {min: my.HandleStrVal(data.BUnderCurrent), max: my.HandleStrVal(data.BOverCurrent)}
                my.limitValues['C/' + data.Line] = {min: my.HandleStrVal(data.CUnderCurrent), max: my.HandleStrVal(data.COverCurrent)}
              })
            }
          }
          my.getData(TerminalCode, 0)
        }
      })
    },
    getData(code, index) {
      this.NumberList = []
      this.LineList = []
      this.listParams = []
      var PhaseLine = this.PhaseLine
      this.LineNumber = ''
      this.PhaseLine = ''
      this.HandleDataToShow(-1)
      if (index === undefined || isNaN(index) || Number(index < 0)) {
        index = 0
      }
      if (code !== undefined && code !== null && code.length > 4) {
        var my = this
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'ComparisonOfLoadCurrentSetting.Main',
            method: 'getData',
            codes: code
          },
          error: function (e) {
            console.log(e)
            alert('后台数据请求有误，请重试！')
          },
          success: function (re) {
            var k = 0
            if (re === '0') {
              alert('后台数据请求有误，请重试！')
            } else {
              var data = JSON.parse(re)
              if (data.length > 0) {
                data.map((ob) => {
                  var pl = ob.LinePhase + '/' + ob.LineIndex
                  if (PhaseLine === pl) {
                    k = my.LineList.length
                  }
                  my.LineList.push(pl)
                  if (!isNaN(ob.CompomentNumber)) {
                    var n = Number(ob.CompomentNumber)
                    var num = ''
                    if (n < 10) { num = ('00' + n) } else if (n < 100) { num = ('0' + n) } else { num = '' + n }
                    my.NumberList.push(num)
                  }
                  var uidata = {}
                  //uidata['errorLimit'] = ob.AbnormalValue
                  //uidata['nomalLimit'] = ob.NormalValue
                  uidata['AbParamArea1'] = ob.AbParamArea1
                  uidata['AbParamArea2'] = ob.AbParamArea2
                  uidata['AbParamArea3'] = ob.AbParamArea3
                  my.listParams.push(uidata)
                })
              }
            }
            my.selectOnchange(k)
          }
        })
      }
    },
    HandleDataToShow(index) {
      var ob = null
      var i = 0
      if (index >= 0) {
        ob = this.listParams[index]
      }
      if (ob !== undefined && ob !== null) {
        this.selectIndex = index
        while (i < this.listWinData.length) {
          var key = 'AbParamArea' + (i + 1)
          if (ob[key] !== undefined && ob[key].length > 2) {
            var arr = ob[key].split('/')
            this.listWinData[i] =
                {
                  checked: true,
                  st: arr.length > 0 ? arr[0] : '--',
                  et: arr.length > 1 ? arr[1] : '--',
                  date: arr.length > 4 ? arr[4] : '--',
                  I: arr.length > 2 ? arr[2] : '--',
                  P: arr.length > 3 ? arr[3] : '--'
                }
          } else {
            this.listWinData[i] = {checked: false, st: '--', et: '--', date: '--', I: '--', P: '--'}
          }
          i++
        }
      } else {
        i = 0
        while (i < this.listWinData.length) {
          this.listWinData[i] = {checked: false, st: '--', et: '--', date: '--', I: '--', P: '--'}
          i++
        }
      }
      if (index > -1) {
        this.listWinData.map((data, n) => {
          this.$refs.myChart.listWinData[n].date = data.date
          this.$refs.myChart.listWinData[n].I = data.I
          this.$refs.myChart.listWinData[n].P = data.P
          this.$refs.myChart.listWinData[n].st = data.st
          this.$refs.myChart.listWinData[n].et = data.et
        })
      }
    },
    HandleStrVal(str) {
      var val = -1
      if (str !== undefined && str.indexOf('|') >= 0) {
        var arr = str.split('|')
        if (arr.length > 1) {
          if (!isNaN(arr[1])) {
            val = Number(arr[1])
          }
        }
      }
      return val
    }
  },
  created () {
    // this._getTreeData()
  },
  mounted () {
    var t = new Date()
    var t1 = new Date(t.setDate(t.getDate() + 1))
    this.eDate = t1.getFullYear() + '-' + (t1.getMonth() + 1) + '-' + t1.getDate()
    var t2 = new Date(t.setDate(t.getDate() - 7))
    this.sDate = t2.getFullYear() + '-' + (t2.getMonth() + 1) + '-' + t2.getDate()
    var obj = document.getElementById('p_Fname')
    var hieght = 0
    if (obj !== undefined && obj !== null) {
      hieght = document.body.clientHeight - obj.style.getPropertyValue('height').replace('px', '') - 50
      console.log(this.chartH)
      $('#content_Left').height(hieght + 'px')
    } else {
      hieght = document.body.clientHeight - 50
      console.log(hieght)
      $('#content_Left').height(hieght + 'px')
    }
    var el = $('#' + this.curliId)
    if (el !== undefined) {
      el.css('background-color', '#2986F2')
      el.css('color', '#fff')
    }
  }
}
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

  #mydt>tr>td>div>.ivu-date-picker-rel>div>input{
    font-size: 18px !important;
  }
  #mydt> tr>td> span
  {
    font-size: 18px;
  }
  #left_Content  .ivu-input{
    font-size: 16px !important;
  }
  #left_Content{
    color:#000;
    font-size: 16px;
    font-family: 微软雅黑;
  }
  #left_Content .div_spanBlue p {
    height: 40px;
    line-height: 40px;
  }
  #left_Content .div_spanBlue input[type=text] {
    height: 30px;
    line-height: 30px;
  }
  #left_Content .div_spanBlue span{
    color:blue;
  }
  #divcontent{
    position: absolute;
    margin-left: 147px;
  }
  #divcontent .ul_H{
    border-bottom: solid 1px silver;
  }
  #divcontent .ul_H>li {
    display: inline-block;
    font-size: 16px;
    border-right: 1px solid silver;
    height: 30px;
    line-height: 30px;
  }
</style>
