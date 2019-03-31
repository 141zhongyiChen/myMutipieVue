<template>
  <div style="position: relative">
    <!-- 必须要有highlight-row，on-current-change0方法才能有作用 -->
    <div class="table-wrapper">
      <!-- @on-row-click="onRowClick" -->
      <Table width="100%" height="580" border :columns="columnsInfo"
             :data="paginationFlag ? historyData : dataList"
             :loading="isLoading"
             ref="table"
             id='table'>
      </Table>
    </div>
    <div class="downLoad-wrapper">
      <Button type="primary" size="large" @click="exportData()" class="downLoad">
        <Icon type="ios-download-outline"></Icon> 导出表格
        <!--<Icon type="ios-cloud-download"></Icon>-->
      </Button>
    </div>
    <!-- 表格会话弹窗 -->
    <dialog-wrapper :isShow="showDialog" @on-close-dialog="toHidden"></dialog-wrapper>
  </div>
</template>
<script>
import { TextColor, TextSize, STYLE_CONFIG } from 'common/js/tableStyle'
import { handleDownload, TextColor, TextSize, STYLE_CONFIG } from 'common/js/tableStyle'
import { handleDownload, TextColor, TextSize, STYLE_CONFIG } from 'common/js/tableStyle'
import { TEXT_MIDDLE } from 'common/js/config'
import { getTreeData } from 'api/getTreeData'
import { getUniqueData } from 'common/js/getUniqueData'
import { ERR_OK } from 'api/config'
import { mapGetters, mapMutations } from 'vuex'
import dialogWrapper from 'base/dialog/dialog'
export default {
  components: {
    dialogWrapper
  },
  data () {
    return {
      /* table列表项 */
      columnsInfo: [
        {
          title: '序号',
          key: 'num',
          width: 60,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row
            var text = row.num
            var size = TextSize(TEXT_MIDDLE)
            return h('div', {
              style: {
                fontSize: size,
                fontWeight: (this.tableTerminal === row.terminalCode ? 'bold' : ''),
                background: (this.tableTerminal === row.terminalCode ? '#ffcd32' : ''),
                color: (this.tableTerminal === row.terminalCode ? '#00BFFF' : 'black')
              }
            }, text)
          }
        },
        {
          title: '控制箱名称',
          key: 'title',
          width: 160,
          align: 'center',
          fixed: 'left',
          // fixed: 'left',
          render: (h, params) => {
            var row = params.row
            var text = row.title
            var size = TextSize(TEXT_MIDDLE)
            return h('div', {
              style: {
                fontSize: size,
                fontWeight: (this.tableTerminal === row.terminalCode ? 'bold' : ''),
                background: this.tableTerminal === row.terminalCode ? '#ffcd32' : '',
                color: (this.tableTerminal === row.terminalCode ? '#00BFFF' : 'black')
              },
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                mouseover: () => {
                  $(event.currentTarget).attr('title', '选中当前终端')
                }
              }
            }, text)
          }
        },
        /* scrollable 1-5 */
        {
          title: '通讯',
          key: 'touch',
          width: 100,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '在线',
              value: 1
            },
            {
              label: '离线',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.touch === '在线'
            } else if (value === 2) {
              return row.touch === '离线'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.touch) {
              text = row.touch
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => {
                  this.showDetail(params.row)
                },
                mouseover: () => {
                  $(event.currentTarget).css('fontSize', '18px').attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  $(event.currentTarget).css('fontSize', '14px')
                }
              }
            }, text)
          }
        },
        {
          title: '终端开关灯',
          key: 'terminal',
          width: 130,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '开灯',
              value: 1
            },
            {
              label: '关灯',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.terminal === '开灯'
            } else if (value === 2) {
              return row.terminal === '关灯'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.terminal) {
              text = row.terminal
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css('fontSize', '18px').attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  $(event.currentTarget).css('fontSize', '14px')
                }
              }
            }, text)
          }
        },
        {
          title: '交流接触器状态',
          key: 'contactorStatus',
          width: 140,
          align: 'center',
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.contactorStatus) {
              text = row.contactorStatus
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css('fontSize', '18px').attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  $(event.currentTarget).css('fontSize', '14px')
                }
              }
            }, text)
          }
        },
        {
          title: '灯负载',
          key: 'lightLoad',
          width: 110,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '异常',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.lightLoad === '正常'
            } else if (value === 2) {
              return row.lightLoad === '异常'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.lightLoad) {
              text = row.lightLoad
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css('fontSize', '18px').attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  $(event.currentTarget).css('fontSize', '14px')
                }
              }
            }, text)
          }
        },
        {
          title: '异常开关灯',
          key: 'unusualLight',
          width: 130,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '有',
              value: 1
            },
            {
              label: '无',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.unusualLight === '有'
            } else if (value === 2) {
              return row.unusualLight === '无'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.unusualLight) {
              text = row.unusualLight
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css('fontSize', '18px').attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        /* scrollable 6-10 */
        {
          title: '电压报警',
          key: 'voltageAlarm',
          width: 120,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '有',
              value: 1
            },
            {
              label: '无',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.voltageAlarm === '有'
            } else if (value === 2) {
              return row.voltageAlarm === '无'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.voltageAlarm) {
              text = row.voltageAlarm
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '电流报警',
          key: 'currentAlarm',
          width: 120,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '有',
              value: 1
            },
            {
              label: '无',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.currentAlarm === '有'
            } else if (value === 2) {
              return row.currentAlarm === '无'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.currentAlarm) {
              text = row.currentAlarm
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '接触器报警',
          key: 'contactorAlarm',
          width: 130,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '有',
              value: 1
            },
            {
              label: '无',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.contactorAlarm === '有'
            } else if (value === 2) {
              return row.contactorAlarm === '无'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.contactorAlarm) {
              text = row.contactorAlarm
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '供电',
          key: 'powered',
          width: 100,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '异常',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.powered === '正常'
            } else if (value === 2) {
              return row.powered === '异常'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.powered) {
              text = row.powered
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '柜门',
          key: 'door',
          width: 100,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '打开',
              value: 1
            },
            {
              label: '关闭',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.door === '打开'
            } else if (value === 2) {
              return row.door === '关闭'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.door) {
              text = row.door
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        /* scrollable 11-15 */
        {
          title: '电气图',
          key: 'diagram',
          width: 100,
          align: 'center',
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.diagram) {
              text = row.diagram
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '漏电报警',
          key: 'leakageAlarm',
          width: 100,
          align: 'center',
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.leakageAlarm) {
              text = row.leakageAlarm
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '漏电跳闸保护',
          key: 'leakageProtected',
          width: 120,
          align: 'center',
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.leakageProtected) {
              text = row.leakageProtected
            }
            // var size = TextSize(TEXT_MIDDLE)
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '防盗报警',
          key: 'alarm',
          width: 100,
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.alarm) {
              text = row.alarm
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '状态总结',
          key: 'state',
          width: 120,
          align: 'center',
          'sortable': true,
          filters: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '异常',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.state === '正常'
            } else if (value === 2) {
              return row.state === '异常'
            }
          },
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.state) {
              text = row.state
            }
            var color = TextColor(text)
            STYLE_CONFIG.color = color
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        /* scrollable 16-17 */
        {
          title: '状态变化时间',
          key: 'changeTime',
          width: 120,
          align: 'center',
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.changeTime) {
              text = row.changeTime
            }
            // var size = TextSize(TEXT_MIDDLE)
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                }
              }
            }, text)
          }
        },
        {
          title: '终端编码',
          key: 'terminalCode',
          width: 160,
          align: 'center',
          render: (h, params) => {
            var row = params.row
            let text = '---'
            if (row.terminalCode) {
              text = row.terminalCode
            }
            // var size = TextSize(TEXT_MIDDLE)
            return h('div', {
              style: STYLE_CONFIG,
              on: {
                click: () => {
                  this.onRowClick(params.row)
                },
                dblclick: () => { this.showDetail(params.row) },
                mouseover: () => {
                  $(event.currentTarget).css({'fontSize': '18px', 'cursor': 'pointer'}).attr('title', '双击获取详情')
                  // $(event.currentTarget).parent().parent().attr('id', 'activeHover')
                },
                mouseleave: () => {
                  event.currentTarget.style.fontSize = '14px'
                  // $(event.currentTarget).parent().parent().removeAttr('id')
                }
              }
            }, text)
          }
        }
      ],
      /* table数据源 */
      dataList: [],
      // 双击点击显示[会话层]
      isLoading: true,
      showDialog: false,
      dialogData: null,
      // 分页
      historyData: [],
      paginationFlag: false
    }
  },
  computed: {
    ...mapGetters('tableModule', [
      'tableTerminal',
      'tableSelectedArr'
    ]),
    ...mapGetters('treeModule', [
      'treeTerminal',
      'treeSelectedArr'
    ])
  },
  watch: {
    treeTerminal (newVal) {
      this.setTableTerminal(newVal)
    },
    dialogData (newVal) {
      return newVal
    },
    dataList (newVal) {
      this.isLoading = false
    }
  },
  methods: {
    ...mapMutations('tableModule', {
      setTableTerminal: 'SET_TABLE_TERMINAL',
      setTableSelected: 'SET_TABLE_SELECTED'
    }),
    ...mapMutations('treeModule', {
      setTreeSelected: 'SET_TREE_SELECTED',
      setTreeTerminal: 'SET_TREE_TERMINAL'
    }),
    // todo export table-cell
    exportData () {
      this.$refs.table.exportCsv({
        filename: 'originalData'
      })
    },
    // update currentTerminalCode while clicking the row
    onRowClick (RowClickData) {
      let selectedArr = []
      selectedArr[0] = RowClickData
      this.setTableSelected(selectedArr)
      this.setTreeSelected(selectedArr)
      this.setTableTerminal(RowClickData.terminalCode)
      this.setTreeTerminal(RowClickData.terminalCode)
    },
    // dialog window
    showDetail (dbRowData) {
      this.toShow()
      this.dialogData = dbRowData
    },
    toShow () {
      this.showDialog = true
    },
    toHidden () {
      this.showDialog = false
    },
    // 数据请求
    _getTreeData () {
      getTreeData().then((res) => {
        if (res.status === ERR_OK) {
          // console.log(res)
          let data = getUniqueData(res.data)
          let ret = []
          data.map((dItem, index) => {
            let obj = {}
            obj.title = dItem.title
            obj.num = index + 1
            obj.terminalCode = dItem.objData.terminalCode
            ret.push(obj)
          })
          this.dataList = ret
        }
      })
    }
  },
  created () {
    // 数据请求
    this._getTreeData()
  },
  mounted () {
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">

  #table td .ivu-table-cell {
    padding 0
    width 100%
    height 100%
    display table
  }

  #table td .ivu-table-cell div {
    height 100%
    width 100%
    display table-cell
    vertical-align  middle
    text-align center
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  }

  tr.ivu-table-row-hover td{
    background #87CEEB
    cursor pointer
  }
  tr.ivu-table-row-hover td:hover{
    background #ffcd32
    cursor pointer
  }
  tr.ivu-table-row-hover  td:first-child {
    background #ffcd32
    cursor default
  }
  tr.ivu-table-row-hover td:nth-child(2) {
    background-color: #ffcd32
  }

  #activeHover{
    background #ffcd32
  }
  .float-right
    float right
    padding-right 10px
  .downLoad
    position: absolute
    top: -60px
    right: 0
</style>
