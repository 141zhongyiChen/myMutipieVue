<template>
  <div class="rightDiv" id="divcontent">
    <div>
      <!--<span style="color:blue;font-size: 12px;position: absolute;left:68px;top: 0px; background-color: #fff;">参数</span>-->
      <div id="mydt" style="height:126px;margin-left:5px;width:600px;margin-top: -6px;">
        <p style="height: 42px;line-height: 42px;">
          <span style="color:blue;width: 30px;">元件序号:</span>
          <select  id="mySelect"  @change="Onchange"  v-model="LineNumCode" style="width:80px;border: solid 1px silver;
                 -moz-border-radius: 5px;height: 30px; -webkit-border-radius: 5px;  border-radius:5px;font-size: 16px;"  placeholder="请选择元件序号">
            <option style="font-size: 18px;" v-for="(planInfo,index) in NumberList" :key="index" :value="planInfo.value" >{{planInfo.value}}</option>
          </select>
          <span style="padding-left: 30px;color:blue;">显示开始：</span>
          <DatePicker format="yyyy-MM-dd" @on-change="SelectSDateClick" type="date" :value="sDate"   show-week-numbers
                      style="width:180px;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px"></DatePicker>
          <button style="font-size: 16px;cursor:default;margin-left:42px;width:100px;border-radius:5px;height:34px;line-height:34px;
              background-color:lightgray;color:#151515;
              border:solid 1px silver;top:24px;position: relative;background: #EEEEF2;" v-on:click="onclickAnalysis">曲线分析</button>
        </p>
        <p style="height: 36px;line-height: 36px;">
          <span style="color:blue;width: 30px;">相对编号:</span>
          <select  id="lineCombox"  @change="Onchange"  v-model="PhaseLine"  style="width:80px;border: solid 1px silver;
                font-size: 16px; -moz-border-radius: 5px;height: 30px; -webkit-border-radius: 5px;  border-radius:5px"  >
            <option style="font-size: 18px;" v-for="(line, index) in LineList" :value="line.value" :key="index">{{ line.value }}</option>
          </select>
          <span style="padding-left:30px;color:blue;">显示结束：</span>
          <DatePicker format="yyyy-MM-dd" type="date" :value="eDate" @on-change="SelectEDateClick" placeholder="请选择结束日期"  show-week-numbers
                      style="width:180px;-moz-border-radius:5px;-webkit-border-radius: 5px; border-radius:5px"></DatePicker>
        </p>
        <button  @click="btnSaveData" style="color: #e87f0e;font-size: 16px;font-weight: bold; margin-top: 25px;">保存曲线设置</button>
      </div>
      <div style="width:495px; right:-130px;height: 126px;position: relative;float:right; border: 1px solid silver;top:-126px;border-bottom: none;">
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
    <div :style="'margin-left:5px;margin-top: 5px; background-color:transparent;border: #ADD8E6 solid 1px;width:' + (width - 92) + 'px;'" id="chartBox"><!---->
      <!--<button style="position: relative; top: 41px;float: right;padding: 0px 10px;left: 484px;">预览</button>-->
      <div  :class="className" id="div_echart" :style="'height:'+height+';width:'+(width+80)+'px;top:0px;'" ref="myEchart" >
      </div>
    </div>
    <p style="float:left;position: absolute;top:167px;padding-left: 8px;">
      <input type="radio" name="rd" checked="checked" @click="LineType=1"/><span style="font-size: 16px;color:#982AE2;padding-right: 15px;">显示电流曲线</span>
      <input type="radio" name="rd" @click="LineType=2"/><span style="font-size: 16px;color:#982AE2;">显示有功功率曲线</span>
      <button @click="isCanPoints = !isCanPoints" style="margin-left: 20px; line-height: 28px;height: 28px;
      background: #4aa5b5; border: 1px solid silver; padding: 0px 5px; color: #fff;font-size: 16px;">{{btntext}}</button>
    </p>
    <!-- -->
    <div v-if="modal1" style="position:absolute;width: 100%;height: 100%;background: #6d7380;opacity: 0.9;top:0px;left:0px; ">
      <div style="background: #fff;width: 260px;margin-left: 50%;margin-top: 10%;border-radius:5px;">
        <h2 style="color:green;border-bottom: 1px solid silver;">温馨提示：</h2>
        <p style="height: 80px;line-height: 80px;font-size: 16px;color:#000;border-bottom: 1px solid silver;text-align: center;padding-left: 5px;">是否保留设置结果？</p>
        <p style="height:40px;line-height: 40px;text-align: right;">
          <button  @click="modal1 = false" style="border-radius: 5px; background: #fff;color:#2d8cf0;height:30px;line-height:30px;
          padding: 1px 10px;">取消</button>
          <button @click="modal1Ok" style="border-radius: 5px; background: #2d8cf0;color:white;height:30px;line-height: 30px;
          padding: 1px 10px;">确定</button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
import { mapGetters, mapMutations } from 'vuex'
import 'jquery'
// 定义我的报表数据显示内容
var typeData = 'Current'
var picTitle = '负荷电流'
var wintimes = {}
// 定义我的报表数据源
export default {
  name: 'analysisLine',
  props: {
    className: {
      type: String,
      default: 'yourclassName'
    },
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: String,
      default: '450px'
    }
  },
  data () {
    return {
      loadState: '正在加载',
      modal1: false,
      changeTime: 0, // 确定曲线设置次数
      isShow: true,
      LineList: [],
      NumberList: [],
      picTitle: '负荷电流曲线图',
      allCodeName: {},
      TerminalMes: '',
      curCode: '',
      sDate: null,
      eDate: null,
      curCodeName: '',
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
      isShowSelected: false, //是否根据选中终端变换开加载数据
      PhaseLine: '', //绝对编码
      LineNumCode: '', //元件序号
      arrPoints: [],
      dataY: [],
      dataP: [], //有功功率曲线值
      dataX: [], //默认电流曲线值
      fillType: false,
      unitText: '',
      LineType: 1,
      isCanPoints: false, //是否可以取点设置
      btntext: '开始取点设置',
      designwWinNum: 0, // 当前设置的窗口序号
      isFirst: true,
      designText: ''

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
    },
    LineType(val) {
      this.isFirst = true
      this.CreateLines()
    },
    isCanPoints(val) {
      var text = '开始取点设置'
      if (val === false) {
        this.modal1 = true
      }
      if (val === true) {
        text = '结束取点设置'
        this.arrPoints = []
        this.CreateLines()
      }
      this.btntext = text
    }
  },
  methods: {
    ...mapMutations('treeModule', {
      setRespondData: 'SET_RESPOND_DATA'
    }),
    btnSaveData() {
      if (this.changeTime > 0) {
        this.$emit('returnData', this.listWinData)
      } else {
        alert('未对数据进行设置，请设置后，再保存！')
      }
    },
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
        var myPhaseLine = Phase + '/' + Line
        this.getInitData(terminalCode, myPhaseLine)
      }
    },
    getInitData(terminalCode, myPhaseLine) {
      var obj = this.$data
      var my = this
      if (obj.LineList.length > 1) {
        obj.LineList = []
      }
      if (obj.NumberList.length > 1) {
        obj.NumberList = []
      }
      obj.picTitle = picTitle + '详情曲线图'
      obj.curCodeName = this.allCodeName[obj.curCode]
      obj.TerminalMes = obj.curCodeName + '(' + obj.curCode + ')'
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
    _getTreeData () {
      /*getTreeData().then((res) => {
                  this.setRespondData(getUniqueData(res))
                })*/
    },
    SelectSDateClick (val, foremat) {
      this.$data.sDate = val
    },
    SelectEDateClick (val, foremat) {
      this.$data.eDate = val
    },
    //仅针对主界面线路、相序进行曲线显示
    InitLinePhaseDataShow(terminalCode, Line, Phase, NumberCode) {
      this.changeTime = 0
      this.curCode = terminalCode
      this.curCodeName = this.allCodeName[terminalCode]
      this.TerminalMes = this.curCodeName + '(' + this.curCode + ')' + '线路' + Line + Phase + '相'
      this.PhaseLine = Phase + '/' + Line
      this.LineNumCode = NumberCode
      this.LineList = [{value: Phase + '/' + Line}]
      this.NumberList = [{value: NumberCode}]
      this.onclickAnalysis()
      this.selWincontent()
    },
    selWincontent() {
      console.log('ccccc')
      var val = this.designwWinNum
      if (val === 0) {
        this.designText = '窗口设置弹窗'
      } else if (val === 1) {
        this.designText = '第一窗口设置弹窗'
      } else if (val === 2) {
        this.designText = '第二窗口设置弹窗'
      } else if (val === 3) {
        this.designText = '第三窗口设置弹窗'
      }
    },
    // 分析按钮点击事件
    onclickAnalysis () {
      if (this.$data.PhaseLine.length > 0 && this.$data.sDate.length > 0 && this.$data.eDate.length > 0 && this.$data.curCode.length > 0) {
        var Codes = this.$data.curCode
        this.curCodeName = this.allCodeName[this.curCode]
        var chartData = {CollectedTime: []}
        chartData[typeData] = []
        chartData['AveragePower'] = []
        var Phase = this.$data.PhaseLine.slice(0, 1)
        var LineNumber = this.$data.PhaseLine.slice(2)
        var BeginTime = this.$data.sDate
        var EndTime = this.$data.eDate
        //var mychart = echarts.init(this.$refs.myEchart)
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
            ob.initChart(typeData, picTitle, chartData)
          },
          success: function (re) {
            chartData = re
            ob.TerminalMes = ob.curCodeName + '(' + ob.curCode + ')' + '线路' + LineNumber + Phase + '相'
            if (re['CollectedTime'] !== undefined && re['CollectedTime'].length > 0) {
              // console.log(re.InputU)
              // console.log(re.OutputU)
              ob.initChart(typeData, picTitle, re)
            } else {
              ob.initChart(typeData, picTitle, chartData)
            }
          }
        })
      } else {
        this.$Message.info('请将查询条件选择完整后，再重试！')
      }
    },
    initChart (typeData, picTitle, re) {
      this.isFirst = true
      if (picTitle.length > 0) {
        if (picTitle.slice(-2) === '电流') { this.$data.unitText = '电流(单位：安培)' } else if (picTitle.slice(-2) === '电压') {
          this.$data.unitText = '电压(单位：伏特)'
        } else if (picTitle.slice(-2) === '功率') {
          this.$data.unitText = '功率(单位：瓦特)'
        } else { this.$data.unitText = '功率因数' }
      }
      this.$data.dataY = re[typeData]
      this.dataP = re['AveragePower']
      this.$data.dataX = re.CollectedTime
      this.CreateLines()
    },
    SetLineData (dataX, series) {
      var chart = this.chart = echarts.init(this.$refs.myEchart)
      var obj = this
      chart.setOption({
        backgroundColor: 'transparent', //'#21202D',
        // 鼠标移到某一点上提示的信息格式
        title: {
          text: obj.picTitle,
          textStyle: {
            color: 'purple',
            fontSize: 20
          },
          subtext: obj.TerminalMes,
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var uni = ' (安培)'
            if (params.length > 0) {
              if (params[0].seriesName.indexOf('功率') > -1) {
                uni = ' (瓦特)'
              }
              var str = '时间：' + params[0].name + '<br/>' + params[0].seriesName + '：' + params[0].value + uni + '<br/>'
              var i = 1
              while (params.length > i) {
                if (params[i].seriesName.indexOf('窗口') >= 0 && params[i].value[1] !== null) {
                  var num = Number(params[i].seriesName.substring(1, 2))
                  str += params[i].seriesName + '时间：' + wintimes[num] + params[0].name.substring(10, params[0].name.length) + '<br/>'
                  str += params[i].seriesName + params[0].seriesName + '：' + params[i].value[1] + uni + '<br/>'
                }
                i++
              }
            }
            return str
          }
        },
        legend: {
          data: ['', 'test'],
          textStyle: {},
          x: '120'
        },
        // 工具箱列表显示语法
        toolbox: {
          show: false,
          feature: {
            mark: {show: false},
            myTool2: {
              show: true,
              title: '切换实心折线',
              icon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
              color: 'blue',
              onclick: function () {
                obj.changeColor(true)
              }
            },
            myTool3: {
              show: false,
              title: '切换空心折线',
              icon: 'path://M 100 800 L 300 800 L 500 500 L550 1400 L800 850 L900 1200 L1000 1230 L1390 1230  M 100 1800 L 1390 1800',
              onclick: function () {
                obj.changeColor(false)
              }
            },
            magicType:
                {
                  show: true,
                  type: ['bar']
                },
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        // 横坐标拉伸
        /* grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true },dataZoom: { show: true, realtime: true,start: 0,end: 100 },*/
        grid: {
          bottom: 40
        },
        dataZoom: [{
          textStyle: {
            color: '#8392A5'
          },
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          dataBackground: {
            areaStyle: {
              color: '#8392A5'
            },
            lineStyle: {
              opacity: 0.8,
              color: '#8392A5'
            }
          },
          handleStyle: {
            color: 'green'
          }
        }, {
          type: 'inside'
        }],
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#828282' } },
          data: dataX, // ['2009/6/12 2:00', '2009/6/12 3:00'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {// rotate: 45,//margin: 8,
            textStyle: {
              color: '#000',
              fontSize: 14
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#A0CEF0', 'transparent'],
              opacity: 0.6
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            lineStyle: {color: '#828282'}
          },
          axisLabel: {
            show: true, // rotate: 45,//margin: 8,
            textStyle: {
              color: '#333333',
              fontSize: 14,
              fontStyle: 'italic'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              /* color: '#483d8b',
                    type: 'dashed',
                    width: 1*/
            } },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#D1ECFB', '#7DC8F3']
            }
          }
        }],
        series: series,
        animation: false
      })
    },
    changeColor(val) {
      this.$data.fillType = val
      if (this.$data.dataY === undefined || this.$data.dataY.length < 1) { return }
      this.inttData()
    },
    CreateLines () {
      var series = []
      if (this.isFirst) {
        this.arrPoints = []
        this.btntext = '开始取点设置'
        this.isCanPoints = false
      }
      var my = this
      if (this.isFirst) {
        this.isFirst = false
        if (this.LineType === 1) { //LineType=1电流曲线，LineType=2有功功率
          my.unitText = '电流'
          series.push(
            {
              name: my.unitText,
              type: 'line',
              symbol: 'circle',
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 3,
                    color: '#FFFF00'//'FFFF00'
                  },
                  color: 'transparent'
                },
                emphasis: {
                  color: 'red'

                }
              },
              areaStyle: {
                /* normal: {  color: '#fff' 渐变 }*/
                normal: (function () {
                  if (my.fillType) {
                    return {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                      }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                      }])
                    }
                  } else { return {color: 'transparent'} }
                }())
              },
              barWidth: '60%',
              symbolSize: 7,
              data: (function () {
                var list = []
                if (my.dataY !== undefined && my.dataY.length > 0) { list = my.dataY } // re.Current //  [0.5, 0.96]
                return list
              }())
            }
          )
        }
        if (this.arrPoints.length > 0) {
        }
        if (this.LineType === 2) {
          my.unitText = '有功功率'
          series.push(
            {
              name: my.unitText,
              type: 'line',
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 3
                  },
                  color: '#FFFF00'
                }
              },
              areaStyle: {
                /* normal: {  color: '#fff' 渐变 }*/
                normal: (function () {
                  if (my.fillType) {
                    return {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                      }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                      }])
                    }
                  } else { return {color: 'transparent'} }
                }())
              },
              barWidth: '60%',
              symbolSize: 7,
              data: (function () {
                var list = []
                if (my.dataP !== undefined && my.dataP.length > 0) { list = my.dataP }// format [0.5, 0.96]}
                return list
              }())
            }
          )
        }
      }
      if (!this.isCanPoints) {
        var arrt = {0: [], 1: [], 2: []}
        //绘制时间段区域
        this.listWinData.map((windata, wini) => {
          if (windata.date !== '--' && (windata.P !== '--' || windata.I !== '')) {
            //选判断起始时间是否属于跨天类型
            var now = new Date()
            var val = this.LineType === 2 ? windata.P : windata.I
            var nowdate = (now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()).replace(/-/g, '/')
            var t1 = nowdate + ' ' + windata.st
            var t2 = nowdate + ' ' + windata.et
            var yes = false
            if (new Date(t1) > new Date(t2)) {
              yes = true
            }
            // 遍历所有时间轴数据
            this.dataX.map((t, i) => {
              now = new Date(t)
              nowdate = (now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()).replace(/-/g, '/')
              var dateE = new Date(t2)
              if (yes) {
                //跨天类型进行数据时间处理 t1.setDate(t1.getDate() - 1)
                t1 = nowdate + ' ' + windata.et
                t2 = nowdate + ' ' + windata.st
              } else {
                t1 = nowdate + ' ' + windata.st
                t2 = nowdate + ' ' + windata.et
              }
              if ((!yes && now >= new Date(t1) && now <= dateE) || (yes && (now >= new Date(t2) || now <= new Date(t1)))) {
                arrt[wini].push([i, val])
              } else if (arrt[wini].length > 0 && arrt[wini][arrt[wini].length - 1][1] !== null) {
                arrt[wini].push([i, null])
              }
            })
          }
        })
        wintimes = {}
        for (var j in arrt) {
          var n = (Number(j) + 1)
          wintimes[n] = ''
          wintimes[n] = this.listWinData[j].date
          series.push({
            name: '第' + n + '窗口',
            type: 'line', //'scatter',
            itemStyle: {
              normal: {
                opacity: 0.8,
                color: this.listWinData[j].color
              }
            },
            symbol: 'none',
            data: arrt[j]
          })
        }
      }
      series.push({
        name: '时间区域点集合',
        type: 'scatter',
        itemStyle: {
          normal: {
            opacity: 0.8,
            color: 'blue'
          }
        },
        symbolSize: 10,
        data: my.arrPoints
      })
      this.SetLineData(this.dataX, series)
    },
    dataPointClick(params) {
      if (this.isCanPoints === true) {
        //判断两时间值间隔相差是否超过一天
        if (this.arrPoints.length % 2 === 1) {
          var endTime = new Date(this.dataX[params.dataIndex])
          var startTime = new Date(this.dataX[this.arrPoints[this.arrPoints.length - 1][0]])
          var timeDiff = endTime - startTime
          var hour = Math.floor(timeDiff / 3600 / 1000)
          if (hour > 24) {
            alert('抱歉，该设置点与的上一个设置点时间间隔已超出1天，不能设置！')
            return
          }
        }
        var i = 0
        console.log(this.arrPoints.length)
        while (i < this.arrPoints.length) {
          if (this.arrPoints[i][0] === params.value[0]) {
            this.arrPoints.splice(i, 1)
            this.CreateLines()
            return
          }
          i++
        }
        this.arrPoints.push([params.dataIndex, params.value])
        if ((this.designwWinNum > 0 && this.arrPoints.length > 2) || (this.designwWinNum < 1 && this.arrPoints.length > 6)) {
          this.arrPoints.splice(0, 1)
        }
        this.CreateLines()
      }
    },
    //将设置点结果保存到界面
    modal1Ok() {
      //按照时间从小到大排序
      var arr = []
      var winNum = 1
      if (this.designwWinNum > 1) {
        winNum = this.designwWinNum
      }
      while (this.arrPoints.length > 0) {
        var i = 0
        var mint = -1
        var index = -1
        while (this.arrPoints.length > i) {
          if (this.arrPoints[i][0] < mint || mint < 0) {
            mint = this.arrPoints[i][0]
            index = i
          }
          i++
        }
        this.arrPoints.splice(index, 1)
        arr.push(mint)
        if (arr.length === 2) {
          var sumi = 0
          var sump = 0
          for (let x = arr[0]; x < arr[1]; x++) {
            sumi = Number(this.dataY[x]) + sumi
            sump = Number(this.dataP[x]) + sump
          }
          this.listWinData[winNum - 1].I = (sumi / (arr[1] - arr[0])).toFixed(2)
          this.listWinData[winNum - 1].P = (sump / (arr[1] - arr[0])).toFixed(2)
          var st = new Date(this.dataX[arr[0]])
          var et = new Date(this.dataX[arr[1]])
          this.listWinData[winNum - 1].date = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate()
          this.listWinData[winNum - 1].st = st.getHours() + ':' + st.getMinutes()
          this.listWinData[winNum - 1].et = et.getHours() + ':' + et.getMinutes()
          arr = []
          winNum = winNum + 1
        }
      }
      while (winNum <= 3) {
        this.listWinData[winNum - 1].date = '--'
        this.listWinData[winNum - 1].st = '--'
        this.listWinData[winNum - 1].et = '--'
        this.listWinData[winNum - 1].P = '--'
        this.listWinData[winNum - 1].I = '--'
        winNum++
      }
      this.modal1 = false
      this.isFirst = true
      this.CreateLines()
      this.changeTime++
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
    var chart = echarts.init(this.$refs.myEchart)
    var my = this
    chart.on('click', function (params) {
      my.dataPointClick(params)
    })
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
  #mydt .ivu-select-selection .ivu-select-selected-value{
    font-size: 18px !important;
  }
  #mydt .ivu-input{ font-size: 16px !important;font-weight: normal !important;color: #2F2F2F;font-family: 微软雅黑;}
  #content_Left>ul>li{
    background-color:#C4D6EA !important
  }
  #content_Left>h2>span:hover{
    background-color:#C4D6EA
  }
  #mydt p>*
  {
    font-size: 16px;
  }
  #chartBox .yourclassName {
    margin-left: -80px;
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
  #div_echart>div:first-child{
    top:-115px;
  }
</style>
