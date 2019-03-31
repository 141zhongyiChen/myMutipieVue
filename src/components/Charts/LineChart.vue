<template>
  <div >
    <div  :class="className" id="div_echart" :style="{height:height,width:width}" ref="myEchart" >
    </div>
  </div>

</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'

import 'jquery'
// import axios from 'axios'
export default {
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
      chart: null,
      LineList: [],
      unitText: '',
      dataX: [],
      dataY: [],
      picTitle: '负载电流详情曲线图',
      fillType: false
    }
  },
  mounted () {
    //  this.mytestfn()
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
    // console.log(objEle)
    // console.log(document.body.clientHeight + '-----------' + minh + 'px')
    EChart.style.setProperty('width', minw + 'px')
    this.inttData()
    this.$data.chart.on('click', function () {
    })
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
      console.log(val)
    },
    initChart (typeData, picTitle, re) {
      if (picTitle.length > 0) {
        if (picTitle.slice(-2) === '电流') { this.$data.unitText = '电流(单位：安培)' } else if (picTitle.slice(-2) === '电压') {
          this.$data.unitText = '电压(单位：伏特)'
        } else if (picTitle.slice(-2) === '功率') {
          this.$data.unitText = '功率(单位：瓦特)'
        } else { this.$data.unitText = '功率因数' }
      }
      this.$data.dataY = re[typeData]
      this.$data.dataX = re.CollectedTime
      this.inttData()
    },
    inttData () {
      var obj = this
      var chart = this.chart = echarts.init(this.$refs.myEchart)
      chart.setOption({
        title: {
        },
        // 鼠标移到某一点上提示的信息格式
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var str = '时间：' + params[0].name + '<br/>' + params[0].seriesName + '：' + params[0].value + '<br/>'
            return str
          }
        },
        // 线颜色
        color: 'blue',
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['jmkj流量', '降jkj雨量'],
          x: 'left'
        },
        // 工具箱列表显示语法
        toolbox: {
          show: true,
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
                show: true,
                type: ['bar']
              },
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        // 横坐标拉伸
        dataZoom: {
          show: true,
          realtime: true,
          start: 0,
          end: 100
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {onZero: false},
          data: obj.$data.dataX, // ['2009/6/12 2:00', '2009/6/12 3:00'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [
          {
            name: obj.$data.unitText,
            type: 'line',
            itemStyle: {
              normal: {
                color: 'rgb(255, 70, 131)'
              }
            },
            areaStyle: {
              /* normal: {
                color: '#fff'
                渐变

              }*/
              normal: (function () {
                if (obj.$data.fillType) {
                  return {color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                  }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                  }])}
                } else { return {color: '#F0F8FF'} }
              }())
            },
            barWidth: '60%',
            data: (function () {
              var list = obj.$data.dataY // re.Current //  [0.5, 0.96]
              return list
            }())
          }
        ]
      })
    },
    changeColor(val) {
      this.$data.fillType = val
      if (this.$data.dataY === undefined || this.$data.dataY.length < 1) { return }
      this.inttData()
    }
  }
}
/*   如果是异步获取的数据，比如用axios,那只需要把配置项放到then方法后面：
   initChart() {
        this.chart = echarts.init(this.$refs.myEchart);
        // 把配置和数据放这里
        this.axios.get('/url').then((data) => {
          this.chart.setOption({

          })
        })
      }
       mytestfn () {
      var url = 'http://localhost:11190/LInterface/DataHandler.ashx'
      $.ajax(url, {
        data: {
          active: 'AnalysisOfHistoricalElectricParameter.mytest2018'
        },
        dataType: 'json',
        crossDomain: true,
        success: function (data) {
          if (data && data.resultcode === '200') {
            console.log(data.result.today)
          }
        }
      })
    }
      */
</script>

<style >
</style>
