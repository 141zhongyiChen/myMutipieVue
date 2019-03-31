<template>
  <div id="render-table" @contextmenu="showContext()">
    <!-- table -->
    <Table width="auto" :height="height" border
           :no-data-text="noDataText"
           :columns="columnsInfo" :data="currentPageData">
    </Table>
    <!-- pagination -->
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalData" show-sizer :current="currentPage"
                :page-size="pageSize"
                show-total
                @on-change="changePage"
                @on-page-size-change="changePageSize">
            <span style="font-size: 14px" slot>共 <span style="color: deepskyblue">{{totalData}}</span> 条</span>
          </Page>
        </div>
      </div>
    <!-- Context Events -->
    <vue-context-menu
      :contextMenuData="contextMenuData"
      @clearSuccess="clearSuccess"
      @clearAll="clearAll">
    </vue-context-menu>
  </div>
</template>
<script type='text/ecmascript-6'>
import _ from 'lodash'
import { setUserSetting } from 'api/setUserSetting'
import VueContextMenu from 'base/contextmenu/VueContextMenu'
import { mapGetters } from 'vuex'
const M_TO_MS = 1000
const MIN_TO_S = 60
export default {
  props: {
    height: {
      type: Number,
      default () {
        return 400
      }
    },
    // terminalCode-uniCode
    uniCodes: {
      type: Array,
      // required: true
      default () {
        return []
      }
    },
    // timeSpan of sending request (s)
    timeSpan: {
      type: Number,
      default () {
        return 1
      }
    },
    // max execute time (min)
    maxTime: {
      type: Number,
      default () {
        return 60
      }
    }
  },
  data () {
    return {
      noDataText: '',
      // to record the highLightRow
      activeIndex: -1,
      // { status: 'Y'/ 'N' / 'C' / 'S' }
      settingData: [],
      columnsInfo: [
        {
          title: '指令状态',
          key: 'status ',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let IconMes = this.handleIcon(params.index, this.counter)
            return h('div', {
              /*class: {
                'demo-table-info-row': this.highLightRow(params.row)
              },*/
              on: {
                click: () => {
                  this.activeIndex = params.row.uniCode
                }
              }
            }, [
              h('Tooltip', {
                props: {
                  placement: 'right-end',
                  content: IconMes.tips,
                  delay: 600,
                  transfer: true
                }
              }, [
                h('Icon', {
                  style: {
                    width: '30px',
                    height: '30px',
                    paddingTop: '2px',
                    fontSize: '28px',
                    color: IconMes.color
                  },
                  props: {
                    type: IconMes.type
                  }
                })
              ])
            ])
          }
        },
        {
          title: '控制箱名称',
          key: 'terminalName',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.highLightRow(params.row)
              },
              on: {
                click: () => {
                  this.activeIndex = params.row.uniCode
                }
              }
            }, this.showTableText(params.index, 'terminalName', this.counter) || '----')
          }
        },
        {
          title: '控制箱编号',
          key: 'terminalCode',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.highLightRow(params.row)
              },
              on: {
                click: () => {
                  this.activeIndex = params.row.uniCode
                }
              }
            }, this.showTableText(params.index, 'terminalCode', this.counter) || '----')
          }
        },
        {
          title: '指令名称',
          key: 'commandName',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.highLightRow(params.row)
              },
              on: {
                click: () => {
                  this.activeIndex = params.row.uniCode
                }
              }
            }, this.showTableText(params.index, 'commandName', this.counter) || '----')
          }
        },
        {
          title: '发送时间',
          key: 'sendReceiveTime',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.highLightRow(params.row)
              },
              on: {
                click: () => {
                  this.activeIndex = params.row.uniCode
                }
              }
            }, this.showTableText(params.index, 'sendReceiveTime', this.counter) || '----')
          }
        },
        {
          title: '成功执行时间',
          key: 'executeTime',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.highLightRow(params.row)
              },
              on: {
                click: () => {
                  this.activeIndex = params.row.uniCode
                }
              }
            }, this.showTableText(params.index, 'executeTime', this.counter) || '----')
          }
        }
      ],
      // pagination
      currentPage: 1,
      pageSize: 10,
      // systemInterval
      timer: null,
      isTimer: false, // start timer flag
      counter: 0, // timer counter
      // record the command queue
      commandList: [],
      // about contextMenu
      contextMenuData: {
        menuName: 'CommandContext',
        // 菜单位置
        axios: {
          x: null,
          y: null
        },
        menulists: [
          {
            fnHandler: 'clearAll',
            icoName: 'el-icon-more',
            btnName: '移除界面上所有指令',
            flag: true
          },
          {
            fnHandler: 'clearSuccess',
            icoName: 'el-icon-more',
            btnName: '移除所有发送成功的指令',
            flag: true
          }
        ]
      },
      clearStatus: null // clear type
    }
  },
  components: {
    VueContextMenu
  },
  computed: {
    // About pagination
    totalData () {
      return this.settingData.length
    },
    // The data in cur_page
    currentPageData () {
      let data = JSON.parse(JSON.stringify(this.settingData))
      if (data.length) {
        let chunkArr = _.chunk(data, this.pageSize)
        return chunkArr[this.currentPage - 1]
      } else {
        return []
      }
    },
    //
    ...mapGetters('treeModule', [
      'respondData'
    ])
  },
  watch: {
    // Execute commands timer
    isTimer (newVal) {
      if (newVal) {
        this.timer = setInterval(() => {
          // Request duration >= max limit time ?
          if (this.counter + this.timeSpan <= this.maxTime * MIN_TO_S) {
            // Send request
            this.getCommandRecords()
            // Cumulative counter
            this.counter += this.timeSpan
          } else {
            // Stop timer
            clearInterval(this.timer)
            this.isTimer = false
            // Change status which command is still fail to execute
            if (this.commandList.length) {
              this.commandList.map(item => {
                let dataIndex = _.findIndex(this.settingData, o => o.uniCode === item.uniCode)
                if (dataIndex > -1) {
                  this.settingData[dataIndex].status = 'C'
                }
              })
              // Clear timer && trigger this handleIcon method to render one more
              this.counter = 0
              // Clear commandList
              this.commandList = []
            }
          }
        }, this.timeSpan * M_TO_MS)
      } else {
        console.log('请求结束定时关闭')
        this.counter = 0
        clearInterval(this.timer)
      }
      return newVal
    },
    // Try to start or stop timer
    uniCodes (newVal) {
      if (newVal.length) {
        // 累计 指令码
        this.commandList = _.concat(this.commandList, this.margeCodes(newVal))
        this.settingData = _.concat(this.settingData, this.initData(newVal))
        // 开启定时器
        this.isTimer = true
        // 重新计时
        this.counter = 0
      }
      return newVal
    }
  },
  methods: {
    // Pagination begin
    changePage (pageIndex) {
      this.currentPage = pageIndex
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    // Pagination end
    //
    highLightRow(rowData) {
      return rowData.uniCode === this.activeIndex
    },
    //
    //
    // Init settingData
    initData (codesArr) {
      let ret = []
      if (codesArr.length) {
        codesArr.forEach(o => {
          let obj = {}
          obj.status = 'S'
          obj.uniCode = o.uniCode
          obj.terminalCode = o.terminalCode
          obj.terminalName = this.findTerminalName(o.terminalCode)
          ret.push(obj)
        })
      }
      return ret
    },
    //
    // Init command queue && record the status flag
    margeCodes (codesArr) {
      let ret = []
      if (codesArr.length) {
        codesArr.forEach(o => {
          let obj = {}
          obj.status = 'S'
          obj.uniCode = o.uniCode
          ret.push(obj)
        })
      }
      return ret
    },
    //
    findTerminalName (terminalCode) {
      let terminalName = ''
      if (this.respondData.length) {
        let pos = _.findIndex(this.respondData, o => o.objData.terminalCode === terminalCode)
        if (pos > -1) {
          terminalName = this.respondData[pos].title
        }
      }
      return terminalName
    },
    //
    // Pick up the uniCods which has not sent successful
    hasNoSuccess (dataArr) {
      let ret = []
      dataArr.map(item => {
        if (item.status !== 'Y') {
          ret.push(item.uniCode)
        }
      })
      // 将commandList 更新为 只包含 未成功的指令 指令码集合
      this.commandList = this.commandList.filter(o => o.status !== 'Y')
      return ret
    },
    //
    // Icontype handler && return
    handleIcon (rowIndex) {
      let status = this.settingData[rowIndex].status
      switch (status) {
        case 'Y':
          return {
            color: '#19be6b',
            type: 'checkmark-circled',
            tips: '指令执行成功'
          }
        case 'N':
          return {
            color: '#ed4014',
            type: 'close-circled',
            tips: '指令执行失败'
          }
        case 'C':
          return {
            color: '#ff9900',
            type: 'refresh',
            tips: '指令执行超时'
          }
        default:
          return {
            color: '#2db7f5',
            type: 'information-circled',
            tips: '指令正在执行'
          }
      }
    },
    //
    // This method is mainly about handle the showing text
    showTableText (rowIndex, field) {
      return this.settingData[rowIndex][field]
    },
    //
    // Get command records
    getCommandRecords () {
      // 未请求成功的指令码集合
      let codes = this.hasNoSuccess(this.commandList)
      if (codes.length > 0) {
        // 发送请求
        let data = {
          active: 'getRecords.GetCommandRecord',
          uniCodes: JSON.stringify(codes)
        }
        setUserSetting(data)
          .then(res => {
            let resArr = JSON.parse(res)
            if (resArr.length) {
              this.constructData(resArr)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.isTimer = false
      }
    },
    //
    // Construct data
    constructData (resArr) {
      // Update commandList
      resArr.map((rItem) => {
        // 搜索 rItem.uniCode 在 settingData 中 的 位置
        let dataIndex = _.findIndex(this.settingData, o => o.uniCode === rItem.uniCode)
        if (dataIndex > -1) {
          // 名称赋值
          rItem.terminalName = this.settingData[dataIndex].terminalName
          if (rItem.sendReceiveTime) {
            rItem.sendReceiveTime = rItem.sendReceiveTime.replace(/T/gi, ' ')
          }
          if (rItem.executeTime) {
            rItem.executeTime = rItem.executeTime.replace(/T/gi, ' ')
          }
          this.settingData[dataIndex] = rItem
        }
        // 搜索 rItem.uniCode 在 commandList 中 的 位置, 更新指令队列
        if (rItem.status === 'Y') {
          let commandIndex = _.findIndex(this.commandList, o => o.uniCode === rItem.uniCode)
          if (commandIndex > -1) {
            this.commandList[commandIndex].status = 'Y'
          }
        }
      })
      // this.settingData = this.filterCommand(temp, this.clearStatus)
    },
    //
    //
    // ContextMenu Events
    showContext () {
      event.preventDefault()
      event.cancelBubble = true // 阻止冒泡
      let x = event.clientX + 6
      let y = event.clientY
      // Get the current location
      this.contextMenuData.axios = {
        x, y
      }
    },
    showAll () {
      if (this.settingData.length) {
        this.clearStatus = 'All'
        let temp = this.filterCommand(this.settingData, this.clearStatus)
        // 数据构造
        temp.map((Item, index) => {
          Item.num = index
          if (Item.executeTime) {
            Item.executeTime = Item.executeTime.replace(/T/gi, ' ')
          }
          Item.sendReceiveTime = Item.sendReceiveTime.replace(/T/gi, ' ')
        })
        this.settingData = temp
      }
    },
    clearAll () {
      // 终止请求
      this.isTimer = false
      // 清空数据
      this.commandList = []
      this.settingData = []
    },
    clearSuccess () {
      this.settingData = this.filterCommand(this.settingData, 'Success')
      // console.log(this.settingData)
      // console.log(this.commandList)
    },
    filterCommand (dataArr, type) {
      switch (type) {
        case 'Success':
          return dataArr.filter(o => o.status !== 'Y')
        default:
          return dataArr
      }
    }
  },
  created () {
  },
  mounted () {},
  beforeDestroy () {
    // Remove timer
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  destroy () {}
}
</script>
<style>
  #render-table {
    position: relative;
    border: 1px solid grey;
    overflow: auto;
    padding: 2px;
  }

  /* 表格样式设置 */
  #render-table thead .ivu-table-column-center .ivu-table-cell span {
    font-size: 16px;
    color: black;
    font-weight: 500;
  }

  #render-table tbody tr td.ivu-table-column-center {
    height: 30px;
  }

  #render-table tbody .ivu-table-column-center .ivu-table-cell span {
    font-size: 14px;
    color: black;
    font-weight: 500;
  }

  /* reset table header &&  table fixed-header*/
  #render-table .ivu-table .ivu-table-header .ivu-table-cell,
  #render-table .ivu-table .ivu-table-fixed .ivu-table-fixed-header .ivu-table-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: justify;
  }

  /* reset table body */

  #render-table .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell {
    width: 100%;
    height: 100%;
    padding: 0;
    display:table
  }

  /* reset default span && setting render div */
  /*#my-table-wrapper .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell > span,*/
  #render-table .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell > div {
    width: 100%;
    height: 100%;
    padding: 0;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    position: relative;
  }

  /* reset table-row-hover */
  #render-table .ivu-table tr.ivu-table-row-hover .ivu-table-cell {
    background: #87CEEB;
    color: #fff;
  }

  #render-table .ivu-table tr.ivu-table-row-hover .ivu-table-cell > div:hover {
    background: #ffcd32;
    color: #fff;
  }
  /* 自定义 */

  /* curSelected style */
  #render-table .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell .demo-table-info-row {
    background-color: #2db7f5;
    color: #fff;
  }

  /* cur-select-hover */
  #render-table .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell .demo-table-info-row:hover {
    font-size: 16px;
    background: #ffcd32;
    color: #fff;
  }
/* --------------------------------------------------- */
  /* 表格高亮 */
  #terminalTimer-wrapper .table-wrapper {
    position: relative;
    border: 1px solid grey;
  }
</style>
