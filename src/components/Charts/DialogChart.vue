<template>
  <div id="#DialogChart">
    <Modal
      v-model="dialogShow"
      :title="title"
      @on-ok="ok"
      @on-cancel="dialogShow = false" width="1300 ">
      <div style="font-size: 16px;height: 590px;width: 1000px;margin: auto;">
        <ul id="LinesBox" style="background: #fff;margin-top: -20px;margin-bottom: 10px;" >
          <li v-for="(dic,index) in this.LinesBox" :key="index" style="display: inline-block;">
            <ul style="list-style: none;width: 300px;" v-for="(list, Phase) in dic" :key="Phase">
              <li  v-for="(val, n) in list" :key="n">
                <input type="checkbox" @change="isShowLine(val.checked,index, n)" v-model="val.checked"/><span :style="'padding: 0px 60px;background:'+ val.color"></span>{{val.name}}
              </li>
            </ul>
          </li>
        </ul>
        <div class="divMain" style="margin-left: -100px;">
          <div  :class="className" id="div_echart" :style="{height:height,width:width}" ref="myEchart" ></div>
        </div>
        <p style="color:purple;width:30px;float:left;position:absolute;top: 28%;font-weight: bold;
    left: 57px;">
          <span v-for="i in 7" :key="'e'+i" style="display: inline-block;width:30px;transform: rotate(-90deg)">{{unitText[unitText.length - i]}}</span>
          <span v-for="i in picTitle.length" :key="unitText.length+i" style="display: inline-block;width:30px;transform: rotate(-90deg)">{{picTitle[picTitle.length - i]}}</span>

          <!-- {{picTitle}}({{unit}})-->
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
export default {
  name: 'DialogChart',
  props: {
    className: {
      type: String,
      default: 'yourclassName'
    },
    width: {
      type: String,
      default: '1200px'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data () {
    return {
      dialogShow: false,
      title: '曲线详情',
      chart: null,
      LineList: [],
      unitText: '',
      unit: '',
      LineColors: ['#FFFF00', '#DBF5A0', '#F5DB86', '#00FFFC', '#93C1EA', '#A5F7D6', '#F240F2', '#EDA595', '#B9A2F2'], //曲线颜色
      LinesBox: [], //曲线是否显示
      ChartLines: { //折线数据
        dataY: []
      },
      dataX: [],
      dataY: [],
      limitUp: -1,
      limitDwon: -1,
      picTitle: '曲线图',
      fillType: false
    }
  },
  mounted () {
    /* this.$data.chart.on('click', function () {
        })*/
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
  },
  methods: {
    initWidthHeight() {
      // 计算报表显示的最大宽度
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
    isShowLine(val, index, m) {
      var n = index * 3 + m
      if (this.chart._model.option.series !== undefined && this.chart._model.option.series.length > 0) {
        var series = this.chart._model.option.series
        if (val === true && n < this.LineColors.length) {
          series[n].itemStyle.color = this.LineColors[n]
        } else {
          series[n].itemStyle.color = 'transparent'
        }
        this.inttData(series)
      }
      console.log(this.chart._model.option.series[n].itemStyle.color)
    },
    ok() {
    },
    initChart (listDataY, picTitle, CollectedTime) { //, limitUp, limitDwon
      if (picTitle !== undefined && picTitle.length > 0) {
        this.title = picTitle + '曲线详情'
        this.picTitle = picTitle
        if (picTitle !== undefined && picTitle.length > 0) {
          if (picTitle.indexOf('电流') >= 0) {
            this.$data.unitText = '电流(单位：安培)'
            this.unit = 'A'
          } else if (picTitle.indexOf('电压')) {
            this.$data.unitText = '电压(单位：伏特)'
            this.unit = 'V'
          } else if (picTitle.indexOf('功率') >= 0) {
            this.$data.unitText = '功率(单位：瓦特)'
            this.unit = 'W'
          } else { this.$data.unitText = '功率因数' }
        }
      }
      if (CollectedTime !== undefined && CollectedTime.length > 0) {
        this.dataX = CollectedTime
        //console.log(CollectedTime)
        //console.log(listDataY)
      } else {
        this.dataX = []
      }
      if (listDataY !== undefined && listDataY.length > 0) {
        this.CreateMoreLine(listDataY)
      }
    },
    inttData (series) { //limitUp, limitDwon
      var obj = this
      var chart = this.chart = echarts.init(this.$refs.myEchart)
      chart.setOption({
        title: {
        },
        backgroundColor: '#F0F8FF',
        tooltip: {// 鼠标移到某一点上提示的信息格式
          trigger: 'axis',
          formatter: function (params) {
            var i = 0
            var str = ''
            if (params.length > 0) {
              str += '时间：' + params[0].name + '<br/>'
              while (i < params.length) {
                str += params[i].seriesName + '：' + params[i].value + '<br/>'
                i++
              }
            }
            return str
          }
        },
        //color: ['red', 'green', 'yellow', 'blue', 'orange', 'pink'], // 线颜色
        legend: {
          data: ['jmkj流量', '降jkj雨量'],
          x: 'left'
        },
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
          axisLine: {onZero: false},
          data: obj.dataX, // ['2009/6/12 2:00', '2009/6/12 3:00'],
          axisTick: {
            alignWithLabel: true
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
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#D1ECFB', '#7DC8F3']
            }
          }
        }],
        series: series /*(function () {
          var re = obj.CreateMoreLine(listDataY)
          return re
        }())*/
      })
    },
    // 先根据数据格式绘制多条曲线  数据格式dataLines=[{text:'需要显示的信息',dataY:[],limitUp:'',limitDwon''},.....]
    CreateMoreLine(dataLines) {
      var series = []
      var my = this
      if (dataLines !== undefined && dataLines.length > 0) {
        var LinesBox = []
        dataLines.map((data, num) => {
          //折线曲线
          var ob = {}
          var arr = []
          var name = this.unitText
          if (data.text !== undefined) {
            name = data.text + '相' + this.unitText
          }
          if (data.dataY !== undefined && data.dataY.length > 0) {
            var dataLine = {
              name: name,
              type: 'line',
              symbolSize: 2,
              itemStyle: {
                normal: {
                  color: my.LineColors[num * 3]//'rgb(255, 70, 131)'
                }
              },
              areaStyle: {
                normal: { color: 'transparent' }
                /*normal: (function () { //渐变
                      if (my.fillType) {
                        return {
                          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                          }, {
                            offset: 1,
                            color: my.LineColors[num * 3] //'rgb(255, 70, 131)'
                          }])
                        }
                      } else { return {color: '#F0F8FF'} }
                    }())*/
              },
              barWidth: '60%',
              data: (
                function () {
                  var list = data.dataY // re.Current //  [0.5, 0.96]
                  return list
                }())
            }
            series.push(dataLine)
            var str = my.picTitle.indexOf('电压') > -1 ? '电压' : '电流'
            arr.push({name: data.text + '相' + str, checked: true, color: my.LineColors[num * 3]})
          }
          if (data.limitUp !== undefined) {
            var limitUpLine = { //直线曲线
              name: '上限',
              symbol: 'none',
              type: 'line',
              itemStyle: {
                normal: {
                  color: my.LineColors[num * 3 + 1]//'green'
                }
              },
              data: (function () {
                var listc = []
                var a = 0
                if (data.limitUp >= 0 && my.dataX !== undefined) {
                  while (a < my.dataX.length) {
                    listc.push(data.limitUp)
                    a++
                  }
                }
                return listc
              }())
            }
            arr.push({name: '上限', checked: true, color: my.LineColors[num * 3 + 1]})
            series.push(limitUpLine)
          }
          if (data.limitDwon !== undefined) {
            var limitDwonLine = {
              name: '下限',
              symbol: 'none',
              type: 'line',
              itemStyle: {
                normal: {
                  color: my.LineColors[num * 3 + 2]//'green'
                }
              },
              data: (function () {
                var listdata = []
                var b = 0
                if (data.limitDwon >= 0 && my.dataX !== undefined) {
                  while (b < my.dataX.length) {
                    listdata.push(data.limitDwon)
                    b++
                  }
                }
                return listdata
              }())
            }
            arr.push({name: '下限', checked: true, color: my.LineColors[num * 3 + 2]})
            series.push(limitDwonLine)
          }
          if (arr.length > 0) {
            ob[data.text] = arr
            LinesBox.push(ob)
          }
        })
        this.LinesBox = LinesBox
        console.log(this.LinesBox)
      }
      this.inttData(series)
    },
    changeColor(val) {
      this.$data.fillType = val
      if (this.$data.dataY === undefined || this.$data.dataY.length < 1) { }
    }
  }
}
</script>

<style >
  #DialogChart *{
    font-size: 16px;
  }
  #DialogChart .ivu-modal-header p, .ivu-modal-header-inner{
    font-size: 20px !important;
    color:green;
  }
</style>
