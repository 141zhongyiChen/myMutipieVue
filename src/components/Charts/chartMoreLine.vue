<template>
  <!--<div style="background:#F0F8FF;margin-left: -100px;padding-left: 35px;">-->
  <div  :class="className" id="div_echart" :style="{height:height,width:width}" ref="myEchart" >
    <!-- </div>-->
  </div>

</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
import 'jquery'
var wintimes = {}
// import axios from 'axios'
export default {
  name: 'chartMoreLine',
  props: {
    className: {
      type: String,
      default: 'yourclassName'
    },
    width: {
      type: String,
      default: '1100px'
    },
    height: {
      type: String,
      default: '420px'
    }
  },
  data () {
    return {
      chart: null,
      LineList: [],
      unitText: '',
      Lineunit: '',
      dataX: [],
      dataY: [],
      TerminalMes: '',
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
      ],
      limitUp: -1,
      limitDwon: -1,
      picTitle: '负载电流详情曲线图',
      fillType: false,
      limitArr: {0: [], 1: []}, //上下限值
      arrt: {0: [], 1: [], 2: []}, //窗口绝对值区域
      arrData1: {0: [], 1: [], 2: []}, // 偏差值曲线
      arrData2: {0: [], 1: [], 2: []}// 百分比曲线
    }
  },
  mounted () {
    this.chart = echarts.init(this.$refs.myEchart)
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    testClick (val) {
    },
    initStyle() {
      var w = document.body.clientWidth
      var EChart = document.getElementById('chartBox')
      var minw = w - 450 - 90
      minw = minw > 850 ? minw : 850
      var minh = document.body.clientHeight - 270 > 450 ? document.body.clientHeight - 270 : 450
      // 自动调节报表显示的长度高度
      var objEle = document.getElementById('div_echart')
      objEle.style.setProperty('width', minw + 'px')
      objEle.style.setProperty('height', minh + 'px')
      EChart.style.setProperty('width', minw + 'px')
    },
    initChart (typeData, picTitle, re, limitUp, limitDwon) {
      this.picTitle = picTitle + '曲线详情'
      if (picTitle.length > 0) {
        if (picTitle.indexOf('电流') > -1) {
          this.$data.unitText = '电流(单位：安培)'
          this.Lineunit = '(单位：安培)'
        } else if (picTitle.indexOf('电压') > -1) {
          this.$data.unitText = '电压(单位：伏特)'
          this.Lineunit = '(单位：伏特)'
        } else if (picTitle.indexOf('无功功率') > -1) {
          this.$data.unitText = '无功功率(单位：乏)'
          this.Lineunit = '(单位：乏)'
        } else if (picTitle.indexOf('视在功率') > -1) {
          this.$data.unitText = '视在功率(单位：伏安)'
          this.Lineunit = '(单位：伏安)'
        } else if (picTitle.indexOf('因数') < 0 && picTitle.indexOf('功率') > -1) {
          this.$data.unitText = '功率(单位：瓦特)'
          this.Lineunit = '(单位：瓦特)'
        } else {
          this.$data.unitText = '功率因数'
          this.Lineunit = ''
        }
      }
      this.$data.dataY = re[typeData]
      this.$data.dataX = re.CollectedTime
      this.$data.limitUp = limitUp
      this.$data.limitDwon = limitDwon
      this.DrawLines()
    },
    setLineDate (series) {
      var obj = this
      this.chart.clear()
      this.chart.setOption({
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
            var uni = ''
            if (params.length > 0) {
              if (obj.picTitle.indexOf('无功功率') > -1) {
                uni = '(乏)'
              } else if (obj.picTitle.indexOf('视在功率') > -1) {
                uni = '(伏安)'
              } else if (obj.picTitle.indexOf('功率因数') > -1) {
                uni = ''
              } else if (params[0].seriesName.indexOf('功率') > -1) {
                uni = ' (瓦特)'
              } else if (params[0].seriesName.indexOf('电流') > -1) {
                uni = ' (安培)'
              } else if (params[0].seriesName.indexOf('电压') > -1) {
                uni = ' (伏特)'
              }
              var str = ''
              var num = ''
              var text = ''
              if ((params[0].seriesName.indexOf('偏差') >= 0 || params[0].seriesName.indexOf('百分比') >= 0) && params[0].value[1] !== null) {
                num = Number(params[0].seriesName.substring(1, 2))
                str += '第' + (num + 1) + '窗口' + '<br/>'
                str += '时间：' + params[0].name + '<br/>'
                text = params[0].seriesName.indexOf('偏差') >= 0 ? '偏差值' : '百分比'
                uni = params[0].seriesName.indexOf('百分比') >= 0 ? '%' : obj.picTitle.indexOf('电流') >= 0 ? ' (安培)' : ' (瓦特)'
                str += text + '：' + params[0].value[1] + uni + '<br/>'
              } else {
                str = '时间：' + params[0].name + '<br/>' + params[0].seriesName + '：' + params[0].value + uni + '<br/>'
                if (obj.limitDwon > -1) {
                  str += '下限值：' + obj.limitDwon.toFixed(2) + uni + '<br/>'
                }
                if (obj.limitUp > -1) {
                  str += '上限值：' + obj.limitUp.toFixed(2) + uni + '<br/>'
                }
              }
              var i = 1
              while (params.length > i) {
                if (params[i].seriesName.indexOf('窗口') >= 0 && params[i].value[1] !== null) {
                  num = Number(params[i].seriesName.substring(1, 2))
                  str += params[i].seriesName + '时间：' + wintimes[num] + params[0].name.substring(10, params[0].name.length) + '<br/>'
                  str += params[i].seriesName + '绝对值：' + params[i].value[1] + uni + '<br/>'
                } else if (params[i].seriesName.indexOf('平均值') >= 0 && params[i].value[1] !== null) {
                  str += '平均' + text + '：' + params[i].value[1] + uni + '<br/>'
                }
                i++
              }
            }
            return str
          }
        },
        backgroundColor: '#F0F8FF',
        // 线颜色
        color: ['red', 'green'],
        legend: {
          data: ['jmkj流量', '降jkj雨量'],
          x: 'left'
        },
        // 工具箱列表显示语法
        toolbox: {
          show: true,
          orient: 'horizontal', //'',
          right: 100,
          feature: {
            mark: {show: true},
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
              show: true,
              title: '切换空心折线',
              icon: 'path://M 100 800 L 300 800 L 500 500 L550 1400 L800 850 L900 1200 L1000 1230 L1390 1230  M 100 1800 L 1390 1800',
              onclick: function () {
                obj.changeColor(false)
              }
            },
            magicType:
                {
                  show: false,
                  type: ['bar'],
                  onclick: function () {
                    obj.changeColor(false)
                  }
                },
            dataView: {
              show: true,
              readOnly: true,
              lang: ['曲线数据', '关闭', ''],
              optionToContent: function (opt) {
                var axisData = opt.xAxis[0].data
                var series = opt.series
                var h = 0
                var strHreads = ''
                while (h < series.length) {
                  strHreads += '<td>' + series[h].name + '</td>'
                  h++
                }
                var table = '<table style="width:100%;text-align:center"><tbody><tr>' + '<td>时间</td>' + strHreads + '</tr>'
                for (var i = 0, l = axisData.length; i < l; i++) {
                  table += '<tr>' + '<td>' + axisData[i] + '</td>'
                  h = 0
                  while (h < series.length) {
                    var v = null
                    var n = 0
                    if (series[h].data[n] instanceof Array) {
                      while (n < series[h].data.length) {
                        if (series[h].data[n].length > 1 && series[h].data[n][0] === i) {
                          v = series[h].data[n][1]
                        }
                        n++
                      }
                    } else if (series[h].data.length > i) {
                      v = series[h].data[i]
                    }
                    v = v === null ? '--' : v
                    table += '<td>' + v + '</td>'
                    h++
                  }
                  table += '</tr>'
                }
                table += '</tbody></table>'
                return table
              }},
            restore: {show: false},
            saveAsImage: {show: true}
          }
        },
        // 横坐标拉伸
        grid: {
          left: '30',
          right: '50',
          bottom: '0%',
          containLabel: true
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
          data: obj.dataX, // ['2009/6/12 2:00', '2009/6/12 3:00'],
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
          name: obj.Lineunit,
          nameTextStyle: {color: 'green'},
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
        series: series
      })
    },
    DrawLines () {
      var series = []
      if (this.dataY === undefined) {
        this.dataY = []
      }
      var my = this
      series.push( //电流、电压、功率曲线
        {
          name: this.picTitle.replace(/曲线详情/g, ''),
          type: 'line',
          itemStyle: {
            normal: {
              color: 'yellow',
              lineStyle: {
                width: 3
              }
            }
          },
          areaStyle: {
            normal: (function () {
              if (my.fillType) {
                return {color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                }, {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }])}
              } else { return {color: 'transparent'} }
            }())
          },
          barWidth: '100%',
          data: (
            function () {
              var list = my.dataY // re.Current //  [0.5, 0.96]
              return list
            }())
        }
      )
      //窗口绝对值区域
      this.arrt = {0: [], 1: [], 2: []}
      this.arrData1 = {0: [], 1: [], 2: []}// 偏差值曲线
      this.arrData2 = {0: [], 1: [], 2: []}// 百分比曲线
      if (this.picTitle.indexOf('电流') > -1 || this.picTitle.indexOf('有功功率') > -1) {
        //绘制时间段区域
        var LineType = this.picTitle.indexOf('电流') > -1 ? 1 : 2
        this.listWinData.map((windata, wini) => {
          if (windata.date !== '--' && (windata.P !== '--' || windata.I !== '')) {
            //选判断起始时间是否属于跨天类型
            var now = new Date()
            var val = LineType === 2 ? windata.P : windata.I
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
              var realVal = Number(this.dataY[i]) >= 0 ? Number(this.dataY[i]) : 0
              if ((!yes && now >= new Date(t1) && now <= dateE) || (yes && (now >= new Date(t2) || now <= new Date(t1)))) {
                this.arrt[wini].push([i, val])
                this.arrData1[wini].push([i, (realVal - val).toFixed(2)])
                if (val === 0) {
                  if (realVal === 0) {
                    this.arrData2[wini].push([i, 0])
                  } else {
                    this.arrData2[wini].push([i, 1])
                  }
                } else {
                  this.arrData2[wini].push([i, (((realVal - val) / val) * 100).toFixed(2)])
                }
              } else if (this.arrt[wini].length > 0 && this.arrt[wini][this.arrt[wini].length - 1][1] !== null) {
                this.arrt[wini].push([i, null])
                this.arrData1[wini].push([i, null])
                this.arrData2[wini].push([i, null])
              }
            })
          }
        })
        wintimes = {}
      }
      for (var j in this.arrt) {
        var n = (Number(j) + 1)
        wintimes[n] = this.listWinData[j].date
        if (this.arrt[j].length > 0) {
          series.push({
            name: '第' + n + '窗口',
            type: 'line', //'scatter',
            itemStyle: {
              normal: {
                opacity: 0.8,
                color: this.listWinData[j].color
              }
            },
            symbolSize: 1,
            data: this.arrt[j]
          })
        }
      }
      this.limitArr = {0: [], 1: []}
      var b = 0
      var min = this.limitDwon > -1 ? this.limitDwon : null
      var max = this.limitUp > 0 ? this.limitUp : null
      while (b < this.dataX.length) {
        this.limitArr[0].push(max)
        this.limitArr[1].push(min)
        b++
      }
      if (this.limitArr[0].length > 0) {
        series.push({
          name: '上限值',
          type: 'line',
          symbol: 'none',
          //areaStyle: {},
          data: this.limitArr[0]
        })
      }
      if (this.limitArr[0].length > 0) {
        series.push({
          name: '下限值',
          type: 'line',
          symbol: 'none',
          itemStyle: {
            normal: {
              color: 'green'
            }
          },
          data: this.limitArr[1]
        })
      }
      this.setLineDate(series)
    },
    //电流、有功功率、偏差值、百分比三选一显示一种曲线
    ShowLineType(val, isup, isdown) {
      var series = []
      var my = this
      if (val !== 1 && val !== 2) {
        this.Lineunit = this.picTitle.indexOf('电流') > -1 ? '（单位：(安培))' : '（单位：(瓦特))'
        series.push( //电流、电压、功率曲线
          {
            name: this.picTitle.replace(/曲线详情/g, ''),
            type: 'line',
            itemStyle: {
              normal: {
                color: 'yellow',
                lineStyle: {
                  width: 3
                }
              }
            },
            areaStyle: {
              normal: (function () {
                if (my.fillType) {
                  return {color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                  }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                  }])}
                } else { return {color: 'transparent'} }
              }())
            },
            barWidth: '100%',
            data: (
              function () {
                var list = my.dataY // re.Current //  [0.5, 0.96]
                return list
              }())
          }
        )
        for (var j in this.arrt) {
          var n = (Number(j) + 1)
          wintimes[n] = ''
          wintimes[n] = this.listWinData[j].date
          if (this.arrt[j].length > 0) {
            series.push({
              name: '第' + n + '窗口',
              type: 'line', //'scatter',
              itemStyle: {
                normal: {
                  opacity: 0.8,
                  color: this.listWinData[j].color
                }
              },
              symbolSize: 1,
              data: this.arrt[j]
            })
          }
        }
        series.push({
          name: '上限值',
          type: 'line',
          //areaStyle: {},
          data: isup ? this.limitArr[0] : []
        })
        series.push({
          name: '下限值',
          type: 'line',
          itemStyle: {
            normal: {
              color: 'green'
            }
          },
          data: isdown ? this.limitArr[1] : []
        })
      } else {
        if (val === 1) {
          this.Lineunit = this.picTitle.indexOf('电流') > -1 ? '单位：(安培)' : '单位：(瓦特)'
          this.Lineunit = '--------------------------------------------计算公式：偏差值 = 实时值-绝对值' + this.Lineunit
          for (var k in this.arrData1) {
            wintimes[4 + Number(k)] = this.listWinData[k].date
            if (this.arrData1[k].length > 0) {
              series.push({
                name: '第' + (Number(k) + 1) + '偏差值',
                type: 'line', //'scatter',
                itemStyle: {
                  normal: {
                    opacity: 0.8,
                    color: this.listWinData[k].color,
                    lineStyle: { // 系列级个性化折线样式
                      width: 1.5
                    }
                  }
                },
                symbolSize: 1,
                data: this.arrData1[k]
              })
            }
          }
        } else {
          this.Lineunit = '------------------------------------------计算公式：百分比 =（实时值-绝对值）/绝对值  (单位：%)'
          for (var m in this.arrData2) {
            wintimes[7 + Number(m)] = this.listWinData[m].date
            if (this.arrData2[m].length > 0) {
              series.push({
                name: '第' + (Number(m) + 1) + '百分比',
                type: 'line', //'scatter',
                itemStyle: {
                  normal: {
                    opacity: 0.8,
                    color: this.listWinData[m].color
                  }
                },
                symbolSize: 1,
                data: this.arrData2[m]
              })
            }
          }
        }
        var arrAvgarr = {0: [], 1: [], 2: []}
        // 计算偏差平均值曲线
        var dataSource = val === 1 ? this.arrData1 : this.arrData2
        var redata1 = {sum: 0, count: 0}
        for (var g in dataSource) {
          var listitem = dataSource[g]
          listitem.map((item, a) => {
            if (item[1] !== null) {
              redata1.sum += Number(item[1])
              redata1.count++
            } else if (redata1.count > 0) {
              var index = item[0] - (redata1.count - redata1.count % 2) / 2
              arrAvgarr[g].push([index, (redata1.sum / redata1.count).toFixed(2)])
              redata1 = {sum: 0, count: 0}
            }
          })
        }
        var arrC = ['#054B05', '#033E3E', '#812708']
        for (var b in arrAvgarr) {
          if (arrAvgarr[b].length > 0) {
            series.push({
              name: '第' + (Number(b) + 1) + '平均值',
              type: 'line',
              symbol: 'arrow',
              symbolSize: 6,
              itemStyle: {
                normal: {
                  color: arrC[b],
                  lineStyle: { // 系列级个性化折线样式
                    width: 3,
                    color: this.listWinData[b].color
                  }
                }
              },
              data: arrAvgarr[b]
            })
          }
        }
      }
      this.setLineDate(series)
    },
    changeColor(val) {
      console.log(this.chart._model.option.series)
      if (this.chart._model.option.series.length > 0 && (this.chart._model.option.series[0].name.indexOf('负荷电流') > -1 ||
          this.chart._model.option.series[0].name.indexOf('有功功率') > -1 ||
          this.chart._model.option.series[0].name.indexOf('输出电压') > -1 ||
          this.chart._model.option.series[0].name.indexOf('输入电压') > -1 ||
          this.chart._model.option.series[0].name.indexOf('视在功率') > -1 ||
          this.chart._model.option.series[0].name.indexOf('功率因数') > -1)) {
        if (this.$data.fillType !== val) {
          var series = this.chart._model.option.series
          this.$data.fillType = val
          var my = this
          series[0] = //电流、电压、功率曲线
              {
                name: this.picTitle.replace(/曲线详情/g, ''),
                type: 'line',
                itemStyle: {
                  normal: {
                    color: 'yellow',
                    lineStyle: {
                      width: 3
                    }
                  }
                },
                areaStyle: {
                  normal: (function () {
                    if (my.fillType) {
                      return {color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                      }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                      }])}
                    } else { return {color: 'transparent'} }
                  }())
                },
                barWidth: '100%',
                data: (
                  function () {
                    var list = my.dataY // re.Current //  [0.5, 0.96]
                    return list
                  }())
              }
          this.setLineDate(series)
        }
      }
    }
  }
}
</script>

<style >
  #div_echart{
    top: -115px;
  }
  #div_echart>div:first-child{
  }
  #div_echart>div>canvas:first-child{
  }
</style>
