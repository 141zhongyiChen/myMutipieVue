<template>
  <div id="realTable" :style="{width: '100%', height: `${tableHeight}px`}">
    <el-table :height="tableHeight - 50"  border ref="realTable" fit
              width="100%" highlight-current-row :data="dataList"
              @row-click="onRowClick" @cell-dblclick="CellDbClick">
      <!-- 终端名称 TerminalName -->
      <el-table-column label="控制箱名称" width="260" resizable>
        <template slot-scope="scope" >
          <div>{{ scope.row.TerminalName }}</div>
        </template>
      </el-table-column>
      <!-- 通讯 IsOnline -->
      <el-table-column label="通讯" width="250" resizable>
        <template slot-scope="scope">
          <div v-if="scope.row.IsOnline" style="color: green">在线</div>
          <div v-else style="color: red">
            <span>离线</span><br>
            <span v-if="scope.row.NetworkOffTime">{{scope.row.NetworkOffTime.replace('T', ' ')}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 平日模式状态 OpenModeStatus1 -->
      <el-table-column label="平日模式状态" width="120" resizable>
        <template slot-scope="scope">
          <div :style="{color: handleStatus(scope.row.OpenModeStatus1).statusColor}">
            {{handleStatus(scope.row.OpenModeStatus1).statusText}}
            <span v-if="handleStatus(scope.row.OpenModeStatus1).isShowIcon">
               <i :class="`${handleStatus(scope.row.OpenModeStatus1).iconType}`" style="font-size: 14px"></i>
            </span>
          </div>
        </template>
      </el-table-column>
      <!-- 一般节日状态 OpenModeStatus2 -->
      <el-table-column label="一般节日状态" width="120" resizable>
        <template slot-scope="scope">
          <div :style="{color: handleStatus(scope.row.OpenModeStatus2).statusColor}">
            {{ handleStatus(scope.row.OpenModeStatus2).statusText }}
            <span v-if="handleStatus(scope.row.OpenModeStatus2).isShowIcon">
               <i :class="`${handleStatus(scope.row.OpenModeStatus2).iconType}`" style="font-size: 14px"></i>
            </span>
          </div>
        </template>
      </el-table-column>
      <!-- 重大节日状态 OpenModeStatus3 -->
      <el-table-column label="重大节日状态" width="120" resizable>
        <template slot-scope="scope">
          <div :style="{color: handleStatus(scope.row.OpenModeStatus3).statusColor}">
            {{ handleStatus(scope.row.OpenModeStatus3).statusText }}
            <span v-if="handleStatus(scope.row.OpenModeStatus3).isShowIcon">
              <i :class="`${handleStatus(scope.row.OpenModeStatus3).iconType}`" style="font-size: 14px"></i>
            </span>
          </div>
        </template>
      </el-table-column>
      <!-- 异常开关灯 IsOpenLamp -->
      <!--<el-table-column label="异常开关灯" width="120" resizable>
        <template slot-scope="scope">
          <div v-if="scope.row.IsOpenLamp" style="color: red">有</div>
          <div v-else style="color: green">无</div>
        </template>
      </el-table-column>-->
      <!-- 灯负载 IsNormalOfLoadState -->
      <el-table-column label="灯负载" width="80" resizable>
        <template slot-scope="scope">
          <div :style="{color: handleLoadState(scope.row.IsNormalOfLoadState).LoadStateColor}">
            {{handleLoadState(scope.row.IsNormalOfLoadState).LoadStateText}}
          </div>
        </template>
      </el-table-column>
      <!-- 电压报警 IsVoltageAlarm -->
      <!--<el-table-column label="电压报警" width="100" resizable>
        <template slot-scope="scope">
          <div v-if="scope.row.IsVoltageAlarm" style="color: red">有</div>
          <div v-else style="color: green">无</div>
        </template>
      </el-table-column>-->
      <!-- 电流报警 IsCurrentAlarm -->
      <el-table-column label="电流报警" width="100" resizable>
        <template slot-scope="scope">
          <div v-if="scope.row.IsCurrentAlarm" style="color: red">有</div>
          <div v-else style="color: green">无</div>
        </template>
      </el-table-column>
      <!-- 供电 PowerStateCode -->
      <!--<el-table-column label="供电" width="80" resizable>
        <template slot-scope="scope">
          <div v-if="scope.row.PowerStateCode.toString() === '0'" style="color: red">中断</div>
          <div v-else style="color: green">正常</div>
        </template>
      </el-table-column>-->
      <!-- 柜门 IsOpenDoor -->
      <!--<el-table-column label="柜门" width="80" resizable>
        <template slot-scope="scope">
          <div v-if="scope.row.IsOpenDoor" style="color: red">打开</div>
          <div v-else style="color: green">关闭</div>
        </template>
      </el-table-column>-->
      <!-- 电气图 -->
      <el-table-column label="电气图" width="70" resizable>
        <template slot-scope="scope">
          <div :title="cellTitle">查看</div>
        </template>
      </el-table-column>
      <!-- 开关量状态 KStatusDic -->
      <el-table-column label="电压状态" resizable>
        <el-table-column label="电压1" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 1).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 1).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压2" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 2).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 2).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压3" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 3).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 3).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压4" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 4).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 4).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压5" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 5).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 5).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压6" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 6).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 6).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压7" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 7).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 7).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压8" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 8).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 8).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电压9" width="80" resizable>
          <template slot-scope="scope">
            <div :style="{color: `${kRoadHandler(scope.row.KStatusDic, 9).color}`}">
              {{ kRoadHandler(scope.row.KStatusDic, 9).text }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 状态总结 IsAllNormal -->
      <el-table-column label="状态总结" width="120" resizable>
        <template slot-scope="scope">
          <div v-if="scope.row.IsAllNormal" style="color: green">正常</div>
          <div v-else style="color: red">存在异常</div>
        </template>
      </el-table-column>
      <!-- 状态变化时间 StatusUpdateTime -->
      <el-table-column label="状态变化时间" width="180" resizable>
        <template slot-scope="scope">
          <div style="color: #222222">
            <span v-if="scope.row.StatusUpdateTime">{{ scope.row.StatusUpdateTime.replace('T', ' ') }}</span>
            <span v-else> --- </span>
          </div>
        </template>
      </el-table-column>
      <!-- 终端编码 TerminalCode -->
      <el-table-column label="终端编码" width="180" resizable>
        <template slot-scope="scope">
          <div style="color: #222222">{{ scope.row.TerminalCode }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 40px;" class="pagination">
      <Page show-elevator :total="total" :current="curPage" :page-size="pageSize"
            @on-change="pageChange"/>
    </div>
    <div class="downLoad-wrapper">
      <Button type="primary" size="large" :disabled="!allowExport" @click="handleDownLoad">
        <Icon type="ios-download-outline"></Icon> 导出表格
      </Button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { export2Excel } from 'common/js/exportExcell'
export default {
  components: {},
  props: {
    dataList: {
      type: Array,
      default () {
        return []
      }
    },
    tableHeight: {
      type: Number,
      default () {
        return 500
      }
    },
    total: {
      type: Number,
      default () {
        return 1
      }
    },
    curPage: {
      type: Number,
      default () {
        return 1
      }
    },
    pageSize: {
      type: Number,
      default () {
        return 25
      }
    },
    allowExport: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      // 配置
      isTableChange: false,
      cellTitle: '双击查看详情',
      // Columns
      columnsInfo: [
        {
          title: '控制箱名称',
          key: 'TerminalName'
        },
        {
          title: '通讯',
          key: 'IsOnline'
        },
        {
          title: '平日模式状态',
          key: 'OpenModeStatus1'
        },
        {
          title: '一般节日状态',
          key: 'OpenModeStatus2'
        },
        {
          title: '重大节日状态',
          key: 'OpenModeStatus3'
        },
        {
          title: '灯负载',
          key: 'IsNormalOfLoadState'
        },
        /*{
          title: '异常开关灯',
          key: 'IsOpenLamp'
        },*/
        /*{
          title: '电压报警',
          key: 'IsVoltageAlarm'
        },*/
        {
          title: '电流报警',
          key: 'IsCurrentAlarm'
        },
        /*{
          title: '供电',
          key: 'PowerStateCode'
        },
        {
          title: '柜门',
          key: 'IsOpenDoor'
        },*/
        {
          title: '状态总结',
          key: 'IsAllNormal'
        },
        {
          title: '状态变化时间',
          key: 'StatusUpdateTime'
        },
        {
          title: '终端编码',
          key: 'TerminalCode'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'treeTerminal',
      'treeSelectedArr',
      'respondData'
    ])
  },
  watch: {
    treeTerminal (newVal) {
      if (this.dataList.length && !this.isTableChange) {
        let tempMap = new Map()
        this.dataList.forEach((item) => {
          tempMap.set(item.TerminalCode, item)
        })
        tempMap.has(newVal) ? this.$refs.realTable.setCurrentRow(tempMap.get(newVal))
          : this.$refs.realTable.setCurrentRow()
      }
      this.isTableChange = false
    },
    dataList (newVal) {
      for (let i = 0; i < newVal.length; i++) {
        const target = newVal[i]
        if (target.TerminalCode === this.treeTerminal) {
          this.$nextTick(() => {
            this.$refs.realTable.setCurrentRow(target)
          })
          break
        }
      }
    }
  },
  methods: {
    //
    // Todo: By Handle Mutations
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL'
    }),
    //
    // 报警 显示 计算
    handleLoadState (status) {
      switch (status) {
        case true:
          return {
            LoadStateText: '正常',
            LoadStateColor: 'green'
          }
        case false:
          return {
            LoadStateText: '异常',
            LoadStateColor: 'red'
          }
        default:
          return {
            LoadStateText: '---',
            LoadStateColor: '#222222'
          }
      }
    },
    // K 路 显示 计算
    kRoadHandler (kRoadMap, road) {
      let obj = {}
      if (kRoadMap.hasOwnProperty(road)) {
        let target = kRoadMap[road]
        if (target.StatusCode.toString() === '0') {
          obj.color = '#00ae00'
          obj.text = '关灯'
        } else {
          obj.color = '#fe0000'
          obj.text = '开灯'
        }
        switch (target.SymbolCode.toString()) {
          case '0':
            obj.record = '正常'
            break
          case '1':
            obj.record = '关灯有线路有负载'
            break
          case '2':
            obj.record = '关灯时接触器故障不能断开'
            break
          case '3':
            obj.record = '关灯时接触器触点损坏或相关参数设置错误'
            break
          case '4':
            obj.record = '开灯时接触器故障不能吸合'
            break
          case '5':
            obj.record = '开灯时接触器触点损坏或相关参数设置错误'
            break
          case '6':
            obj.record = '开灯时线路无负载'
            break
          default:
            obj.record = '未知'
        }
      } else {
        obj.text = '---'
        obj.color = '#000000'
        obj.record = '无相关信息'
      }
      return obj
    },
    // 节日状态 显示 计算
    handleStatus (status) {
      switch (parseInt(status)) {
        case 0:
          return {
            statusText: '全部关灯',
            statusColor: '#00ae00',
            isShowIcon: false
          }
        case 1:
          return {
            statusText: '全部开灯',
            statusColor: '#fe0000',
            isShowIcon: false
          }
        case 2:
          return {
            statusText: '部分开关',
            statusColor: '#ff9900',
            iconType: 'el-icon-warning',
            isShowIcon: true
          }
        default:
          return {
            statusText: '未知',
            statusColor: '#F56C6C',
            iconType: 'el-icon-question',
            isShowIcon: true
          }
      }
    },
    //
    CellDbClick (row, column, cell, event) {
      const strTest = column.label
      if (strTest === '电气图') {
        this.$emit('diagram-call', row.TerminalCode)
      }
    },
    //
    onRowClick (row, event, column) {
      if (this.treeTerminal !== row.TerminalCode) {
        this.isTableChange = true
        this.setTreeTerminal(row.TerminalCode)
      }
    },
    //
    handleDownLoad () {
      let tHeader = []
      let filterVal = []
      this.columnsInfo.map(cItem => {
        tHeader.push(cItem.title)
        filterVal.push(cItem.key)
      })
      let tempArr = JSON.parse(JSON.stringify([...window.$this.$data.tableMap.values()]))
      tempArr.map(tItem => {
        tItem.IsOnline = tItem.IsOnline ? '在线' : `离线 ${tItem.NetworkOffTime.replace('T', ' ')}`
        tItem.IsNormalOfLoadState = this.handleLoadState(tItem.IsNormalOfLoadState).LoadStateText
        // tItem.IsOpenLamp = tItem.IsOpenLamp ? '有' : '无'
        // tItem.IsVoltageAlarm = tItem.IsVoltageAlarm ? '有' : '无'
        tItem.IsCurrentAlarm = tItem.IsCurrentAlarm ? '有' : '无'
        // tItem.PowerStateCode = tItem.PowerStateCode.toString() === '1' ? '正常' : '中断'
        // tItem.IsOpenDoor = tItem.IsOpenDoor ? '打开' : '关闭'
        tItem.IsAllNormal = tItem.IsAllNormal ? '正常' : '存在异常'
        tItem.StatusUpdateTime = tItem.StatusUpdateTime.replace('T', ' ')
        tItem.OpenModeStatus1 = this.handleStatus(tItem.OpenModeStatus1).statusText
        tItem.OpenModeStatus2 = this.handleStatus(tItem.OpenModeStatus2).statusText
        tItem.OpenModeStatus3 = this.handleStatus(tItem.OpenModeStatus3).statusText
      })
      const excelName = '实时监控汇总(华灯)'
      export2Excel(tHeader, filterVal, tempArr, excelName)
    },
    //
    pageChange (pageIndex) {
      this.$emit('change-page', pageIndex)
    }
  },
  created () {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  #realTable {
    position relative
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    border 1px solid silver
    //min-width 1145px
  }

  /* 表头文字居中 */
  #realTable .el-table .el-table__header-wrapper th > .cell {
    text-align center
    font-size 16px
    font-weight bold
    color #222222
  }

  /* 表格文字居中 */
  #realTable .el-table .el-table__body .el-table__row .cell {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    height 100%
    padding 0
    margin 0
  }

  #realTable .el-table .el-table__body-wrapper .el-table__body tbody .el-table__row > td {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    padding 0px
    margin 0
    height 40px
  }

  #realTable .el-table .el-table__body .el-table__row .cell {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    width: 100%;
    height: 100%;
    padding 0
    margin 0
    display table
  }

  #realTable .el-table .el-table__body .el-table__row .cell > div {
    width: 100%;
    height: 100%;
    padding: 0;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    font-size 14px
    font-weight bold
    font-family '微软雅黑'
  }

  /* 高亮选中行 */
  #realTable .el-table .el-table__body-wrapper .el-table__body tbody .el-table__row {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    padding 0px
    margin 0
    height 30px
  }

  #realTable .el-table .el-table__body-wrapper .el-table__body tbody .el-table__row:hover > td {
    background:  #2db7f5;
  }

  #realTable .el-table .el-table__body-wrapper .el-table__body tbody .current-row .cell {
    background: #2db7f5;
  }

  #realTable .el-table .el-table__body-wrapper .el-table__body tbody .current-row td:hover .cell > div {
    background: #ffcd32;
  }

  /**/
  #realTable .downLoad-wrapper {
    position absolute
    right 10px
    top -50px
    height 36px
    padding 3px 4px
    margin-right 4px
    box-sizing border-box
    -webkit-box-sizing border-box
    -moz-box-sizing border-box
  }

  #realTable .downLoad-wrapper .ivu-btn span {
    font-family '微软雅黑',
    font-size 14px
    font-weight 500
  }
  /**/
  #realTable .pagination {
    padding 2px 4px
    box-sizing border-box
    -webkit-box-sizing border-box
    -moz-box-sizing border-box
  }
  #realTable .pagination .ivu-page li {
    font-family '微软雅黑',
    font-size 14px
    font-weight 500
  }
</style>
