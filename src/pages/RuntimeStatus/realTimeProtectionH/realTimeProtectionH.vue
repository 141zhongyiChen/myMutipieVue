<template>
  <masterFrame @init-finish="hasFinish">
    <div id="rightContent" ref="rightContent">
      <!-- title -->
      <div class="content-title">{{ title }}</div>
      <!-- Lux Info -->
      <div class="content-info">
        <li class="pageDetail" style="margin-right: 0px">
          <span>北京时间 : {{ currentLocalTime }}</span>
        </li>
        <li v-for="(item, index) in pageDetail" :key="index" class="pageDetail">
          <span>{{ item.title}} : {{ pageInfo[item.value]}}</span>
        </li>
        <Button style="margin-bottom: 4px">详情</Button>
      </div>
      <!-- Btn options -->
      <div class="content-btn">
        <!-- 表格切换 -->
        <Button style="font-size: 16px;color: black;font-weight: bold" @click="changeView">
          <span v-show="isTableView">切换到 GIS </span>
          <span v-show="!isTableView">切换到表格 </span>
        </Button>
        <!-- 查看异常终端 -->
        <Button style="font-size: 16px;color: black;font-weight: bold;" disabled>
          <span style="color: red">存在异常状态的数量：</span>
          <span :style="{color: unusualMap.size > 0 ? 'red' : 'green'}"> {{ unusualMap.size }} </span>
        </Button>
        <!-- 刷新选中终端信息 -->
        <Button style="font-size: 16px;color: black;font-weight: bold" @click="refreshSelectedTerminal(true)">
          <span>从终端刷新选中控制点状态</span>
        </Button>
        <!-- 刷新所有终端信息 -->
        <Button style="font-size: 16px;color: black;font-weight: bold" @click="refreshSelectedTerminal(false)">
          <span>从终端刷新所有控制点状态</span>
        </Button>
        <!-- 集中预案控制开关灯 -->
        <!--<Button style="font-size: 16px;color: black;font-weight: bold" @click="changeDetailsShow(true)">
          <span>集中预案控制开关灯</span>
        </Button>-->
        <!-- 测试 - 更新地图文本 -->
        <!-- <Button style="font-size: 16px;color: black;font-weight: bold" @click="changeDiagramShow(true)">
          <span>更新文本</span>
        </Button>-->
      </div>
      <!-- View Content -->
      <div class="View_Box" :style="{height: `${ViewBoxHeight}px`}" ref="ViewBox">
        <MyTable :tableHeight="ViewBoxHeight" v-show="isTableView"
                 :dataList="tableViewData" :total="tableMap.size"
                 :curPage="curPage" :pageSize="pageSize" :allowExport="batchesFinish"
                 @diagram-call="tableCallDiagram"
                 @change-page="changeCurPage">
        </MyTable>
        <iframe width="100%" :height="ViewBoxHeight" scrolling="no"
                v-show="!isTableView" src="static/frame.html" frameborder="0" ref="mapFrame">
        </iframe>
      </div>
    </div>
    <!-- 集中控制开关灯 -->
    <details-page v-if="detailsShow" :isShow="detailsShow" @on-close-dialog="changeDetailsShow(false)">
      <masterSwitchLamp v-if="detailsShow" :BoxHeight="ViewBoxHeight"></masterSwitchLamp>
    </details-page>
    <!-- 电气图 -->
    <details-page v-if="diagramShow" :isShow="diagramShow" :width="'86%'" @on-close-dialog="changeDiagramShow(false)">
      <runningBaseED ref="runningDiagram"></runningBaseED>
    </details-page>
  </masterFrame>
</template>
<script>
import masterFrame from 'components/masterFrame/masterFrame'
import MyTable from './components/table.vue'
import detailsPage from './components/detailsPage.vue'
import masterSwitchLamp from './components/masterSwitchLamp.vue'
import runningBaseED from '../assetsElectricalDiagram/components/electricalDiagram/runningBaseED.vue'
import { mapGetters, mapMutations } from 'vuex'
import { setUserSetting } from 'api/setUserSetting'
import { formatDateTime } from 'common/js/formatDateTime'
import _ from 'lodash'
const TIME_SPAN = 1000
const TABLE_ITEM_HEIGHT = 40
export default {
  data () {
    return {
      //
      isFinish: false,
      // 头部信息
      title: '实时监控汇总',
      ViewBoxHeight: 700,
      pageDetail: [
        { title: '今天开灯时间', value: 'onLightTime' },
        { title: '今天关灯时间', value: 'offLightTime' }
        /*{ title: '当前照度值', value: 'luxCurrent' },
        { title: '开灯照度限值', value: 'luxOpen' },
        { title: '关灯照度限值', value: 'luxOff' }*/
      ],
      pageInfo: {
        luxName: '---',
        luxCurrent: '----',
        luxOpen: '----',
        luxOff: '----',
        onLightTime: '----',
        offLightTime: '----'
      },
      currentLocalTime: null,
      // true => 显示表格 false => 显示GIS
      isTableView: true,
      //
      preData: {
        TerminalName: '数据加载中...',
        IsOnline: false,
        NetworkOffTime: '2000-01-01T00:00:00',
        KStatusDic: {
          /*'1': {
            StatusCode: 0,
            SymbolCode: 0
          },
          '2': {
            StatusCode: 0,
            SymbolCode: 0
          },
          '3': {
            StatusCode: 0,
            SymbolCode: 0
          },
          '9': {
            StatusCode: 0,
            SymbolCode: 0
          }*/
        },
        IsNormalOfLoadState: false,
        IsOpenLamp: false,
        IsVoltageAlarm: false,
        IsCurrentAlarm: false,
        IsContactorAlarm: false,
        PowerStateCode: 1,
        IsOpenDoor: false,
        IsLeakageAlarm: false,
        IsLeakageTripProtection: '111',
        IsAntiAlarm: false,
        IsAllNormal: true,
        StatusUpdateTime: '2000-01-01T00:00:00',
        TerminalCode: '----------------',
        OpenModeStatus1: 0,
        OpenModeStatus2: 0,
        OpenModeStatus3: 0
      },
      tableMap: new Map(),
      tableViewData: new Array(),
      hasInitTableData: false,
      curPage: 2,
      targetPage: 1,
      pageSize: 30,
      curPageTimer: null,
      //
      batchesTimer: null,
      batchesIndex: 1,
      batchesFinish: false,
      codes: new Array(), // 请求终端数据
      //
      unusualMap: new Map(),
      unusualCount: 0,
      //
      mapStatus: new Map(),
      hasAddPoints: false,
      //
      // 显示 集中预案开关灯 页面 标志
      detailsShow: false,
      //
      // 显示 电气图 标志
      diagramShow: false,
      // 终端刷新标志
      // refreshFinish: true,
      modalTimer: null
    }
  },
  components: {
    masterFrame,
    MyTable,
    detailsPage,
    masterSwitchLamp,
    runningBaseED
  },
  watch: {
    respondData (newVal) {
      // 清除定时器
      clearInterval(this.batchesTimer)
      clearInterval(this.curPageTimer)
      if (newVal.length) {
        // 清空 表格字典、 GIS字典
        this.tableMap.clear()
        this.mapStatus.clear()
        newVal.forEach((item, index) => {
          const filterCode = item.objData.terminalCode
          const terminalName = item.title
          let preObj = JSON.parse(JSON.stringify(this.preData))
          preObj.IsOnline = Math.round(Math.random() * 2) > 1
          preObj.TerminalCode = filterCode
          preObj.TerminalName = terminalName
          preObj.OpenModeStatus1 = Math.round(Math.random() * 3)
          preObj.OpenModeStatus2 = Math.round(Math.random() * 3)
          preObj.OpenModeStatus3 = Math.round(Math.random() * 3)
          // 更新表格数据
          this.tableMap.set(filterCode, preObj)
          // 更新 请求终端序列
          this.codes.push({terminalCode: filterCode})
          // 更新 坐标点位置 及 状态
          this.mapStatus.set(filterCode, {
            latitude: item.objData.latitude,
            longitude: item.objData.longitude,
            title: item.title,
            terminalCode: filterCode,
            IsAllNormal: true,
            objectCode: item.objData.objectCode
          })
        })
        this.batchesFinish = true
        // this.getTableData()
      }
    },
    treeTerminal (newVal) {
      if (this.tableMap.has(newVal)) {
        const index = _.findIndex([...this.tableMap.keys()], (o) => { return o === newVal })
        this.targetPage = parseInt(index / this.pageSize) + 1
      }
      if (this.isTableView) {
        if (this.targetPage !== this.curPage) {
          const tarPage = JSON.parse(JSON.stringify(this.targetPage))
          this.changeCurPage(tarPage)
          return
        }
        this.scrollToTarget()
        return
      }
      if (!this.isTableView) {
        this.updateMapCenter()
      }
    },
    tableViewData (newVal) {
      clearInterval(this.curPageTimer)
      if (newVal.length) {
        // this.curPageRequest(newVal)
      }
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'respondData',
      'treeSelectedArr',
      'treeTerminal'
    ]),
    ...mapGetters('userModule', [
      'depCode',
      'userCode',
      'tree'
    ])
  },
  methods: {
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL'
    }),
    //
    // Todo: By Handle Window's Events
    onResize () {
      window.addEventListener('resize', this.handleResize)
    },
    handleResize () {
      const OffsetHeight = document.documentElement.clientHeight - 24
      const MinHeight = 560
      const ViewBoxHeight = OffsetHeight - 36 - 46 - 30
      if (ViewBoxHeight >= MinHeight) {
        this.ViewBoxHeight = ViewBoxHeight > MinHeight ? ViewBoxHeight : MinHeight
      }
    },
    //
    // Todo: Request After Finishing Setting Basic Data
    hasFinish () {
      // this.getHeaderData()
      // this.isFinish = true
    },
    //
    // Todo: By Handle Request Lux_Info
    getHeaderData () {
      setUserSetting({
        active: 'realTimeProtection.GetDataOfHeader',
        depCode: this.depCode
      }).then(res => {
        if (res !== '{}') {
          this.pageInfo = JSON.parse(res)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //
    // Todo: By Handle Request Table_Info
    getTableData() {
      /*const data = {
        depCode: this.depCode,
        text: '分批请求',
        active: 'realTimeProtection.GetDataOfRealTimeProtection',
        codesAndName: JSON.stringify('')
      }*/
      // this.batchRequest(this.codes, data, this.batchesIndex)
      $.ajax({
        url: 'static/kendo.json',
        type: 'GET',
        success: (res) => {
          const resArr = JSON.parse(res)
          if (res.length) {
            let upDateArr = new Array()
            resArr.forEach(item => {
              const terminalCode = item.TerminalCode
              const targetObj = this.tableMap.get(terminalCode)
              item.TerminalName = targetObj.TerminalName
              // 异常状态 字典处理： 不存在&不正常 => 添加； 存在&正常 => 移除
              if (!this.unusualMap.has(terminalCode) && !item.IsAllNormal) {
                this.unusualMap.set(terminalCode, item)
              }
              if (this.unusualMap.has(terminalCode) && item.IsAllNormal) {
                this.unusualMap.delete(terminalCode)
              }
              // 默认 更新表格字典
              this.tableMap.set(terminalCode, item)
              // 更新地图缓存
              const mapObj = this.mapStatus.get(terminalCode)
              if (mapObj.IsAllNormal !== item.IsAllNormal) {
                const upDataObj = Object.assign(mapObj, { IsAllNormal: item.IsAllNormal })
                this.mapStatus.set(terminalCode, upDataObj)
                upDateArr.push(upDataObj)
              }
            })
            this.handleResult(upDateArr)
          }
        },
        error: function (error) {
          console.log(error)
        }
      })
    },
    // 分批
    batchRequest (dataArr, requestData, times = 1, maxCount = 100) {
      if (Array.isArray(dataArr)) {
        let messageQueue = _.chunk(dataArr, maxCount)
        // 动态设置 请求参数
        requestData.codesAndName = JSON.stringify(messageQueue[times - 1])
        setUserSetting(requestData)
          .then((res) => {
            const resArr = JSON.parse(res)
            if (res.length) {
              let upDateArr = new Array()
              resArr.forEach(item => {
                const terminalCode = item.TerminalCode
                const targetObj = this.tableMap.get(terminalCode)
                item.TerminalName = targetObj.TerminalName
                // 异常状态 字典处理： 不存在&不正常 => 添加； 存在&正常 => 移除
                if (!this.unusualMap.has(terminalCode) && !item.IsAllNormal) {
                  this.unusualMap.set(terminalCode, item)
                }
                if (this.unusualMap.has(terminalCode) && item.IsAllNormal) {
                  this.unusualMap.delete(terminalCode)
                }
                // 默认 更新表格字典
                this.tableMap.set(terminalCode, item)
                // 更新地图缓存
                const mapObj = this.mapStatus.get(terminalCode)
                if (mapObj.IsAllNormal !== item.IsAllNormal) {
                  const upDataObj = Object.assign(mapObj, { IsAllNormal: item.IsAllNormal })
                  this.mapStatus.set(terminalCode, upDataObj)
                  upDateArr.push(upDataObj)
                }
              })
              this.handleResult(upDateArr)
            }
            this.$nextTick(() => {
              const hasFinish = times + 1 > messageQueue.length
              this.batchesFinish = !this.batchesFinish ? hasFinish : true // 允许表格下载
              this.batchesIndex = hasFinish ? 1 : times + 1
              const span = hasFinish ? 60 : 5 // 当前轮次所有分批请求完毕， 一分钟后发起下轮请求
              clearInterval(this.batchesTimer)
              this.batchesTimer = setTimeout(() => {
                this.batchRequest(dataArr, requestData, this.batchesIndex)
              }, TIME_SPAN * span)
            })
          })
        return
      }
      console.log('dataArr参数不合法')
    },
    // 仅更新状态变化的文本
    handleResult (upDateArr) {
      if (!this.isTableView && this.hasAddPoints) { // 地图已添加点
        this.upDateMapStatus(upDateArr)
      }
    },
    //
    changeCurPage (page) {
      clearInterval(this.curPageTimer)
      this.curPage = page
      const group = _.chunk([...this.tableMap.values()], this.pageSize)
      const curShow = group[page - 1]
      this.tableViewData = curShow
      this.$nextTick(() => {
        this.scrollToTarget()
      })
    },
    scrollToTarget () {
      const scrollTarget = $('#realTable .el-table__body-wrapper')[0] // el-table__body-wrapper
      const tree = this.tableViewData
      const scrollIndex = _.findIndex(tree, (o) => { return o.TerminalCode === this.treeTerminal })
      if (scrollIndex === -1) {
        scrollTarget.scrollTop = 0
        return
      }
      const targetTop = scrollIndex * TABLE_ITEM_HEIGHT
      const scrollTop = scrollTarget.scrollTop
      const clientHeight = scrollTarget.clientHeight
      if (targetTop < scrollTop || targetTop + TABLE_ITEM_HEIGHT >= scrollTop + clientHeight) {
        scrollTarget.scrollTop = targetTop
      }
    },
    // 表格当前页数据 定时请求
    curPageRequest (curTree) {
      let codes = new Array()
      curTree.forEach(item => { codes.push({terminalCode: item.TerminalCode}) })
      const params = {
        depCode: this.depCode,
        text: '当前页请求',
        active: 'realTimeProtection.GetDataOfRealTimeProtection',
        codesAndName: JSON.stringify(codes)
      }
      setUserSetting(params)
        .then(res => {
          const resArr = JSON.parse(res)
          let tempArr = new Array()
          if (resArr.length) {
            let hasChange = false
            for (let i = 0; i < resArr.length; i++) {
              const item = resArr[i]
              const targetObj = this.tableMap.get(item.TerminalCode)
              item.TerminalName = targetObj.TerminalName
              tempArr.push(item)
              // 更新表格字典
              this.tableMap.set(item.TerminalCode, item)
              // 更新文本字典
              const mapObj = this.mapStatus.get(item.TerminalCode)
              if (mapObj.IsAllNormal !== item.IsAllNormal) {
                this.mapStatus.set(item.TerminalCode, Object.assign({}, mapObj, { IsAllNormal: item.IsAllNormal }))
                // 状态 由 异常 变为 正常
                if (this.unusualMap.has(item.TerminalCode) && item.IsAllNormal) {
                  this.unusualMap.delete(item.TerminalCode)
                }
                hasChange = true
              }
            }
            // 表格 默认跳转 到 第一页
            if (!this.hasInitTableData) {
              this.hasInitTableData = true
              this.changeCurPage(1)
            }
            if (hasChange) {
              this.tableViewData = tempArr // 有数据变化
              return
            }
          }
          this.$nextTick(() => {
            clearInterval(this.curPageTimer)
            this.curPageTimer = setTimeout(() => {
              this.curPageRequest(tempArr)
            }, TIME_SPAN * 15)
          })
        })
    },
    //
    // Todo: Options Between Table And Map
    changeView () {
      clearInterval(this.curPageTimer)
      this.isTableView = !this.isTableView
      if (this.isTableView) {
        // 目标页发生变化
        if (this.curPage !== this.targetPage) {
          this.changeCurPage(this.targetPage)
          return
        }
        // 目标页未变化
        this.curPageRequest(this.tableViewData)
      }
      if (!this.isTableView) {
        this.$nextTick(() => {
          // 地图描点
          if (!this.hasAddPoints) {
            this.addMapPoints([...this.mapStatus.values()])
            this.hasAddPoints = true // 更改标志
          }
          this.updateMapCenter() // 更新中心点
          this.upDateMapStatus([...this.mapStatus.values()]) // 更新所有文本
        })
      }
    },
    //
    // ToDO: ChangeMapCenter && AddPoints && UpdateMapStatus [ vue => iframe ]
    updateMapCenter () {
      const target = this.mapStatus.get(this.treeTerminal)
      const jd = target.longitude
      const wd = target.latitude
      const title = target.title
      this.$refs.mapFrame.contentWindow.UpdateCenter(jd, wd, title)
    },
    addMapPoints (points) {
      if (points.length > 0) {
        this.$refs.mapFrame.contentWindow.upDateMarkers(points)
      }
    },
    upDateMapStatus (points) {
      if (points.length > 0) {
        this.$refs.mapFrame.contentWindow.upDateMapStatus(points)
      }
    },
    // [ 仅测试用, 可删 ]
    changeMapStatus () {
      let points = [
        {
          latitude: 23.134251,
          longitude: 113.256321,
          title: '1001-东风西',
          terminalCode: '1000000000000892',
          IsAllNormal: false
        }
      ]
      this.$refs.mapFrame.contentWindow.upDateMapStatus(points)
    },
    //
    // ToDo: Update TreeTerminal [ iframe => vue ]
    resetSelectArr (ev) {
      const terminalCode = ev.graphic.attributes.terminalCode
      this.setTreeTerminal(terminalCode)
    },
    // Read More From Info_Window
    respond (date) {
      //console.log('地图信息窗体点击事件')
      const diagramName = date.title
      const diagramCode = date.terminalCode
      const objectCode = date.objectCode
      if (this.diagramShow) {
        this.$refs.runningDiagram.beginPaintElectricalDiagram(diagramName, diagramCode, objectCode, diagramCode)
        return
      }
      this.diagramShow = true
      this.$nextTick(() => {
        const WrapperTarget = document.getElementById('Diagram_Wrapper')
        // console.log(WrapperTarget)
        WrapperTarget.style.height = this.ViewBoxHeight + 'px'
        this.$refs.runningDiagram.beginPaintElectricalDiagram(diagramName, diagramCode, objectCode, diagramCode)
      })
    },
    //
    // Todo: By Handle Refresh Terminal
    // 刷新终端状态
    refreshSelectedTerminal (flag) {
      let arr = new Array()
      arr.push(this.treeTerminal)
      if (!flag) {
        arr = [...this.tableMap.keys()]
      }
      let data = {
        isRefreshSelected: flag,
        depCode: this.depCode,
        userCode: this.userCode,
        active: 'realTimeProtection.refreshTerminalInfo',
        code: ''
      }
      this.refreshBatches(arr, data, 1)
    },
    // 终端更新 分批
    refreshBatches (dataArr, requestData, times = 1, maxCount = 100) {
      if (Array.isArray(dataArr)) {
        let messageQueue = _.chunk(dataArr, maxCount)
        // 动态设置 请求参数
        requestData.code = JSON.stringify(messageQueue[times - 1])
        //
        setUserSetting(requestData).then((res) => {
          const hasFinish = times + 1 > messageQueue.length
          if (!hasFinish) {
            this.refreshBatches(dataArr, requestData, times + 1)
          } else {
            const tips = requestData.isRefreshSelected ? '已成功为您发送刷新选中终端信息指令' : '已成功为您发送刷新所有终端信息指令'
            this.$Modal.success({
              title: '指令发送完成提示',
              content: tips
            })
            clearInterval(this.modalTimer)
            this.modalTimer = setTimeout(() => {
              this.$Modal.remove()
            }, 2500)
          }
        })
      } else {
        alert('dataArr参数不合法')
      }
    },
    //
    // Todo: Change ShowStatus Of 'MasterSwitchLamp'
    changeDetailsShow (bool) {
      this.detailsShow = bool
    },
    //
    // Todo: Change ShowStatus Of 'RunningDiagram'
    changeDiagramShow (bool) {
      if (!bool) {
        this.$refs.runningDiagram.stopUpdateStatus()
      }
      this.diagramShow = bool
    },
    //
    // Todo: Table Call For Diagram
    tableCallDiagram (terminalCode) {
      // console.log('表格详情请求电气图')
      const target = this.mapStatus.get(this.treeTerminal)
      this.respond(target)
    }
  },
  created () {
    window.$this = this
    this.timer = setInterval(() => {
      let date = new Date()
      this.currentLocalTime = formatDateTime(date)
    }, TIME_SPAN)
    //
    this.handleResize() // Init ViewBox's Height
    // this.onResize() // Add EventListener
  },
  mounted () {},
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    clearInterval(this.timer)
    clearInterval(this.batchesTimer)
    clearInterval(this.timer)
  },
  destroyed () {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  #rightContent {
    height 100%
    font-family '微软雅黑'
  }

  #rightContent > div {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  #rightContent .content-title {
    height 30px;
    display inline-block !important
    padding 3px 6px
    font-size 16px
    line-height 24px
    font-weight 500
    background: -webkit-linear-gradient(bottom, #409eff, #87CEEB); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(bottom, #409eff, #87CEEB); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(bottom, #409eff, #87CEEB); /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom, #409eff, #87CEEB);
  }

  /* Lux-info */
  #rightContent .content-info {
    height 46px
    min-width 1240px
  }

  #rightContent .content-info .pageDetail {
    display inline-block
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    margin 10px 4px
    font-size 16px
    border 3px solid green
    background black
    padding 2px 2px
    color red
  }

  #rightContent .content-info > .ivu-btn:hover {
    background #61C6EB
    color #EEEEEE
  }

  #rightContent .content-info .ivu-btn > span {
    font-family '微软雅黑'
  }

  /* Btn options */
  #rightContent .content-btn {
    height 36px
    padding-left 10px
    min-width 1220px
  }

  #rightContent .content-btn .ivu-btn {
    height 36px
    padding 3px 4px
    margin-right 4px
  }

  #rightContent .content-btn .ivu-btn > span {
    font-family '微软雅黑'
  }

  #rightContent .content-btn > .ivu-btn:hover {
    background #61C6EB
  }

  /* Table */
  #rightContent .View_Box {
    width 100%
    position relative
    box-sizing border-box
    -webkit-box-sizing border-box
    -moz-box-sizing border-box
    padding-top 10px
    padding-left 0
    margin 0
  }

</style>
