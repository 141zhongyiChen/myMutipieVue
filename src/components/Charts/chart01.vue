<template>
  <div class="divMain" style="margin-left:0px;margin-top: -20px;">
    <div  :class="className" id="div_echart" :style="{height:height,width:width}" ref="myEchart" ></div>
    <p style="    width: 25px; position: absolute;top: 200px;font-size: 16px;color: purple;font-weight: bold;">
      <span v-for="i in picTitle.length" :key="unitText.length+i" style="display: inline-block;width:30px;transform: rotate(-90deg)">{{picTitle[picTitle.length - i]}}</span>
    </p>
  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
export default {
  name: 'chart01',
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
      default: '500px'
    }
  },
  data () {
    return {
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
      fillType: false,
      pointText: {
        1: '在线',
        0: '掉线'
      }
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
    LinesBox() {
      alert('11188')
    }
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
        if (listDataY !== undefined && listDataY.length > 0) {
          this.CreateMoreLine(listDataY)
        }
      } else {
        this.dataX = []
      }
    },
    initDrawO1Line (series) { //limitUp, limitDwon
      var obj = this
      var chart = this.chart = echarts.init(this.$refs.myEchart)
      chart.setOption({
        title: {
        },
        tooltip: {// 鼠标移到某一点上提示的信息格式
          trigger: 'axis',
          formatter: function (params) {
            var str = ''
            if (params !== undefined && params.length > 0) {
              var t = params[0].value[0]
              var strtime = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
              str += '时间：' + strtime + '<br/>'
              var val = '掉线'
              if (Number(params[0].value[1]) === 1) { val = '在线' }
              str += params[0].seriesName + '：' + val + '<br/>'//params[i].value + '<br/>'
            }
            return str
          }
        },
        legend: {data: ['jmkj流量', '降jkj雨量'], x: 'left'},
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
          type: 'time',
          boundaryGap: false,
          axisLine: {onZero: false},
          min: new Date(obj.dataX[0]),
          max: new Date(obj.dataX[obj.dataX.length - 1]),
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
          min: obj.dataY[0],
          max: obj.dataY[obj.dataY.length - 1],
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
    CreateO1Line(dataX, dataY, LineColor, text) {
      //折线曲线
      this.unitText = text
      this.picTitle = text
      var name = this.unitText
      if (dataY !== undefined && dataY.length > 0 && dataX !== undefined && dataX.length > 0) {
        dataY.splice(0, 0, null)
        dataY.push(null)
        var t1 = new Date(dataX[0])
        t1.setMinutes(t1.getMinutes() - 60)
        var y = t1.getFullYear()
        var m = t1.getMonth() + 1
        var str = y + '/' + m + '/' + t1.getDate() + ' ' + ' ' + t1.getHours() + ':' + t1.getMinutes() + ':' + t1.getSeconds()
        dataX.splice(0, 0, str)
        t1 = new Date(dataX[dataX.length - 1])
        t1.setMinutes(t1.getMinutes() + 20)
        y = t1.getFullYear()
        m = t1.getMonth() + 1
        str = y + '/' + m + '/' + t1.getDate() + ' ' + ' ' + t1.getHours() + ':' + t1.getMinutes() + ':' + t1.getSeconds()
        dataX.push(str)
        var series = []
        this.dataX = dataX
        this.dataY = dataY
        var arr = []
        var i = 0
        while (i < dataY.length && i < dataX.length) {
          arr.push({value: [new Date(dataX[i]), dataY[i]]})
          i++
        }
        var dataLine = {
          name: name,
          type: 'line',
          step: 'end', //start
          itemStyle: {
            normal: {
              color: LineColor//'rgb(255, 70, 131)'
            }
          },
          areaStyle: {
            normal: { color: 'transparent' }
          },
          barWidth: '60%',
          data: (
            function () {
              var list = arr // re.Current //  [0.5, 0.96]
              return list
            }())
        }
        series.push(dataLine)
        this.initDrawO1Line(series)
      }
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
