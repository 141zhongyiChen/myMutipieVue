<template>
  <div id="LightingModeSetting" ref="mainPage">
    <masterFrame>
      <div class="wrapper" ref="wrapper">
        <div class="title">景观亮化模式切换</div>
        <!-- btn -->
        <div class="setting" :style="{height: `${fullHeight}px`}">
          <div style="text-align: center; font-size: 16px;padding: 4px 4px;height: 32px">
            <span style="color: #2d8cf0;" v-if="treeSelectedArr.length">当前终端： {{ treeSelectedArr[0].title }}</span>
          </div>
          <div style="padding: 5px 4px;height: 44px">
            <Button @click="showAllRecord" style="float: left">查看所有终端记录</Button>
            <Button @click="confirmDialog('ReadSel')" style="float: right">读取到勾选终端</Button>
          </div>
          <div style="padding: 5px 4px;height: 44px">
            <span style="font-size: 14px;color: #000000">终端K路已设模式信息: </span>
          </div>
          <div style="border: 1px solid silver;text-align: center">
            <div style="height: 44px;padding: 6px 60px;line-height: 32px" v-for="(Info, prop) in kRoadInfo" :key="`${prop}${Info.value}`">
              <span style="font-size: 14px">{{ prop }} : </span>
              <Select v-model="Info.value" style="width:400px;margin-left: 6px" :disabled="Info.disabled"
                      :placeholder="Info.disabled ? `${prop}没有使用`: '当前K路未设置亮化模式'">
                <Option v-for="item in 20" :value="item" :key="item">模式{{ item }}</Option>
              </Select>
            </div>
            <Button @click="confirmDialog('WriSel')" style="margin: 6px">发送</Button>
          </div>
        </div>
      </div>
    </masterFrame>
    <div v-if="showDesignModal">
      <Modal v-model="showDesignModal" width="64%" :scrollable="true" :mask-closable="false" style="user-select: none"
             :closable="false">
        <div slot="header" class="btn-wrapper">
          <Button size="large" @click="handleExpand(false)">折叠所有分组</Button>
          <Button size="large" @click="handleExpand(true)">展开所有分组</Button>
          <Button size="large" style="float: right;" @click="handleDownload">保存表格</Button>
        </div>
        <div id="grid">
          <!-- 必须参数 -->
          <kendo-datasource ref="dataSource"
                            :data="dataList"
                            :type="'odata'"
                            :group="group"
                            :sort="datasourceSort"
                            :page-size="50"
                            :batch='true'>
          </kendo-datasource>
          <!-- 必须参数 -->
          <kendo-grid id="gridTable" :data-source-ref="'dataSource'" ref="grid"
                      :height="500" :resizable="true"
                      :pageable="pageable" selectable="row"
                      :columns="columns" :groupable="groupable" sortable="true"
                      @change="getOrSetRow('set', true)">
          </kendo-grid>
        </div>
        <div slot="footer" style="text-align: right;">
          <Button @click="modalCancel">返回</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import masterFrame from 'components/masterFrame/masterFrame'
import { setUserSetting } from 'api/setUserSetting'
import m from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
import '@progress/kendo-ui'
import '@progress/kendo-theme-default/dist/all.css'
import { saveExcel } from '@progress/kendo-vue-excel-export'
import { Grid, GridInstaller } from '@progress/kendo-grid-vue-wrapper'
import { DataSource, DataSourceInstaller } from '@progress/kendo-datasource-vue-wrapper'
Vue.use(DataSourceInstaller)
Vue.use(GridInstaller)
export default {
  data () {
    return {
      isFinish: false,
      menuTitle: '批量写时间到终端',
      isTableSelect: true,
      /************* Grid 配置参数 **************** */
      fullHeight: 800,
      dataList: [],
      columns: [
        {
          title: '终端基础信息',
          columns: [
            {
              title: '终端名称',
              field: 'terminalName',
              width: 260,
              attributes: {
                class: 'grid-cell'
              },
              groupHeaderTemplate: function (data) {
                return `<span>${data.value}</span>`
              }
            },
            {
              title: 'K路序号',
              field: 'kRoad',
              width: 120,
              // locked: true,
              attributes: {
                class: 'grid-cell'
              },
              template: function (data) {
                return `<span class="${data.terminalCode}">${data.kRoad}</span>`
              }
            }
          ]
        },
        {
          title: '模式信息',
          columns: [
            {
              title: '模式序号',
              field: 'modeOrder',
              width: 120,
              attributes: {
                class: 'grid-cell'
              },
              template: function (data) {
                if (parseInt(data.modeOrder) > -1) {
                  return `<span>${data.modeOrder}</span>`
                }
                return ''
              }
            },
            {
              title: '模式详情',
              field: 'modeDesignValue',
              width: 650,
              attributes: {
                class: 'grid-cell'
              },
              template: function (data) {
                // 组件内部增加部分属性值, 使用 data.modeDesignValue 循环， 需 过滤 只 获取 含 'dper' 的 后台 返回字段
                const designValue = data.modeDesignValue
                let strTemplate = ''
                if (JSON.stringify(designValue) !== '{}') {
                  for (let prop in designValue) {
                    if (!/dper/.test(prop) && designValue[prop]) {
                      continue
                    }
                    const strValue = designValue[prop]
                    const text = strValue.toString().replace(/\*/g, '&nbsp;')
                    strTemplate += `<span>${text}</span></br>`
                  }
                }
                return strTemplate
              }
            }
          ]
        }
      ],
      downLoadColumns: [
        {
          title: '终端名称',
          field: 'terminalName',
          width: 260
        },
        {
          title: 'K路序号',
          field: 'kRoad',
          width: 120
        },
        {
          title: '模式序号',
          field: 'modeOrder',
          width: 120
        },
        {
          title: '模式详情',
          field: 'modeDesignValue',
          width: 650
        }
      ],
      datasourceSort: [
        {
          field: 'kRoad',
          dir: 'asc'
        }
      ],
      groupable: {
        enabled: false, // true
        sort: {
          dir: 'asc'
        },
        messages: {
          empty: '拖拽表头到此处进行分组'
        }
      },
      group: {
        field: 'terminalName', // GroupField
        dir: 'asc',
        aggregates: [
          {
            field: 'terminalName', // Count by 'terminalCode' in the same group
            aggregate: 'count'
          }
        ]
      },
      pageable: {
        input: true,
        numeric: false,
        pageSizes: [20, 50, 100, 200, 500],
        buttonCount: 5,
        messages: {
          display: '当前显示 {0} - {1} 条， 共 {2} 条',
          empty: '没有数据',
          page: '',
          of: '/ 共 {0} 页',
          itemsPerPage: '条每页',
          first: '第一页',
          last: '最后一页',
          previous: '上一页',
          next: '下一页'
        }
      },
      /* ********************************* */
      CodesNameMap: new Map(),
      dataListMap: new Map(), // => String, Array
      // Setting details
      modalTimer: null,
      showDesignModal: false,
      selectOrder: 1,
      kRoadInfo: {
        K1: { value: 1, disabled: true },
        K2: { value: 1, disabled: true },
        K3: { value: 1, disabled: true },
        K4: { value: 1, disabled: true },
        K5: { value: 1, disabled: true },
        K6: { value: 1, disabled: true },
        K7: { value: 1, disabled: true },
        K8: { value: 1, disabled: true }
      }
    }
  },
  components: {
    masterFrame,
    Grid,
    DataSource
  },
  computed: {
    ...mapGetters('treeModule', [
      'respondData',
      'treeCheckedArr',
      'treeSelectedArr',
      'treeTerminal'
    ]),
    ...mapGetters('userModule', [
      'depCode',
      'userCode'
    ])
  },
  watch: {
    respondData (newVal) {
      this.CodesNameMap.clear()
      if (newVal.length) {
        newVal.map(item => {
          this.CodesNameMap.set(item.objData.terminalCode, item)
        })
      }
    },
    treeTerminal (newVal) {
      const target = this.CodesNameMap.get(newVal)
      if (target) {
        let ret = []
        ret.push({
          terminalCode: target.objData.terminalCode,
          terminalName: `${target.title} (${target.objData.terminalCode})`
        })
        this._getData(ret)
      }
    },
    dataList (newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          this.handleExpand(false)
          this.getOrSetRow('set', false, this.treeTerminal)
        })
      }
    }
  },
  methods: {
    // Store
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL'
    }),
    // Todo: Btn_Options
    showAllRecord () {
      this.showDesignModal = true
      this._queryAllRecord()
    },
    _constructKroadInfo (dataList = new Array()) {
      let kRoadInfo = JSON.parse(JSON.stringify(this.kRoadInfo))
      for (let prop in kRoadInfo) {
        let obj = kRoadInfo[prop]
        let hasChange = false
        if (dataList.length > 0) {
          dataList.map(item => {
            // 实际返回值
            if ('K' + item.kRoad === prop) {
              hasChange = true
              obj.value = parseInt(item.modeOrder)
              obj.disabled = false
              kRoadInfo[prop] = obj
            }
          })
        }
        // 默认构造值
        if (!hasChange) {
          obj.value = -1
          obj.disabled = true
          kRoadInfo[prop] = obj
        }
      }
      this.kRoadInfo = kRoadInfo
    },
    confirmDialog (handleType = 'WriSel') {
      if (!this.treeCheckedArr.length) {
        this.modalDialog('warning', '操作有误!', '检测到没有勾选终端记录，请勾选发送指令的终端')
        return
      }
      switch (handleType) {
        case 'WriSel':
          this.WriSel()
          break
        case 'ReadSel':
          this.ReadSel()
          break
      }
      // this[handleType]()
    },
    modalDialog (modalType, title, content) {
      this.$Modal[modalType]({
        title: title,
        content: content
      })
      clearInterval(this.modalTimer)
      this.modalTimer = setTimeout(() => {
        this.$Modal.remove()
      }, 2300)
    },
    WriSel () {
      if (!this.dataListMap.size) {
        this.modalDialog('warning', '操作提示!', '当前选中终端没有任何K路使用信息,请尝试选中其他终端')
        return
      }
      const obj = JSON.parse(JSON.stringify(this.kRoadInfo))
      //
      let KroadArr = new Array()
      for (let prop in obj) {
        if (!obj[prop].disabled) {
          KroadArr.push({
            field: prop,
            value: obj[prop].value
          })
          if (obj[prop].value === -1) {
            this.modalDialog('warning', '错误提示!', `${prop} 路 没有设置任何亮化模式，请完善写入信息`)
            return
          }
        }
      }
      let require = new Array()
      this.treeCheckedArr.forEach(item => {
        const terminalCode = item.objData.terminalCode
        require.push({
          terminalCode: terminalCode
        })
      })
      const data = {
        codesInfo: JSON.stringify(require),
        KroadInfo: JSON.stringify(KroadArr),
        active: 'LightingMode.WriteModeTabs',
        depCode: this.depCode,
        userCode: this.userCode
      }
      setUserSetting(data)
        .then(res => {
          this.modalDialog('success', '操作成功', '写指令已发送')
        })
        .catch(err => {
          console.log(err)
        })
    },
    ReadSel () {
      let require = new Array()
      this.treeCheckedArr.forEach(item => {
        const terminalCode = item.objData.terminalCode
        require.push({
          terminalCode: terminalCode
        })
      })
      const data = {
        codesInfo: JSON.stringify(require),
        active: 'LightingMode.ReadModeTabs',
        depCode: this.depCode,
        userCode: this.userCode
      }
      setUserSetting(data)
        .then(res => {
          this.modalDialog('success', '操作成功', '读指令已发送')
        })
        .catch(err => {
          console.log(err)
        })
    },
    //
    // Todo: Table_Request
    _getData (requestCodes) {
      /*this.dataListMap.clear()
      const data = {
        codesAndName: JSON.stringify(requestCodes),
        active: 'LightingMode.GetModeTabsData'
      }
      setUserSetting(data)
        .then(res => {
          const retList = JSON.parse(res)
          if (retList.length) {
            retList.forEach(item => {
              const terminalCode = item.terminalCode
              if (!this.dataListMap.has(terminalCode)) {
                let arr = new Array()
                arr.push(item)
                this.dataListMap.set(terminalCode, arr)
              } else {
                let arr = this.dataListMap.get(terminalCode)
                arr.push(item)
                this.dataListMap.set(terminalCode, arr)
              }
            })
          }
          this._constructKroadInfo(retList)
        })
        .catch(err => {
          console.log(err)
        })*/
      let retArr = new Array()
      const num = Math.ceil(Math.random() * 8)
      for (let i = 1; i <= num; i++) {
        retArr.push({
          kRoad: i,
          modeDesignValue: {},
          modeName: null,
          modeOrder: 20 - Math.ceil(Math.random() * 21),
          terminalCode: this.treeTerminal,
          terminalName: ''
        })
      }
      console.log(retArr)
      retArr.forEach(item => {
        const terminalCode = item.terminalCode
        if (!this.dataListMap.has(terminalCode)) {
          let arr = new Array()
          arr.push(item)
          this.dataListMap.set(terminalCode, arr)
        } else {
          let arr = this.dataListMap.get(terminalCode)
          arr.push(item)
          this.dataListMap.set(terminalCode, arr)
        }
      })
      this._constructKroadInfo(retArr)
    },
    _queryAllRecord () {
      const arr = [...this.CodesNameMap.values()] || new Array()
      console.log(arr)
      let query = new Array()
      arr.map(target => {
        query.push({
          terminalCode: target.objData.terminalCode,
          terminalName: `${target.title} (${target.objData.terminalCode})`
        })
      })
      const data = {
        codesAndName: JSON.stringify(query),
        active: 'LightingMode.GetModeTabsData'
      }
      setUserSetting(data)
        .then(res => {
          this.dataList = JSON.parse(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    //
    // Todo: Table Options
    handleExpand (isExpand) {
      const dom = $('#grid #gridTable').data('kendoGrid')
      isExpand ? dom.expandRow('.k-grouping-row') : dom.collapseRow('.k-grouping-row')
    },
    // handleType: 处理方式 isTableTrigger：是否由Grid触发 rowInfo: 终端编码
    getOrSetRow (handleType = 'get', isTableTrigger = true, rowTerminalCode = '') {
      const dom = $('#grid #gridTable')
      const grid = dom.data('kendoGrid')
      switch (handleType) {
        case 'get':
          const row = grid.select()
          const selectedRow = grid.dataItem(row)
          return selectedRow || {}
        case 'set':
          if (isTableTrigger) {
            const row = grid.select()
            const selectedRow = grid.dataItem(row)
            this.setTreeTerminal(selectedRow.terminalCode)
            return
          }
          const arr = dom.find(`.${rowTerminalCode}`)
          if (arr.length) {
            const tr = $(arr[0].parentNode).closest('tr')
            grid.select(tr)
          }
      }
    },
    // 表格下载
    handleDownload () {
      let data = JSON.parse(JSON.stringify(this.dataList))
      if (!data.length) {
        this.$Modal.warning({
          title: '操作有误!',
          content: '当前表格没有数据可供导出'
        })
        clearInterval(this.modalTimer)
        this.modalTimer = setTimeout(() => {
          this.$Modal.remove()
        }, 2300)
        return
      }
      data.map(item => {
        let designValue = ''
        if (JSON.stringify(item.modeDesignValue) !== '{}') {
          const obj = item.modeDesignValue
          for (let prop in obj) {
            designValue += obj[prop].replace(/\*\*/g, ' ') + '\n'
          }
        }
        item.modeDesignValue = designValue
      })
      saveExcel({
        data: data,
        fileName: `景观亮化模式切换${m().format('YYYY-MM-DD HH:mm:ss')}`,
        columns: this.downLoadColumns
      })
    },
    // Todo: el-table Options
    onRowClick (row, event, column) {
      this.selectedRowIndex = row.per
    },
    modalCancel () {
      this.showDesignModal = false
      this.dataList = new Array()
    }
  },
  created () {
    this.fullHeight = document.documentElement.clientHeight - 22 - 34 - 2
    window.$this = this
  },
  mounted () {},
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  #LightingModeSetting {
    user-select none;
  }

  #LightingModeSetting .wrapper {
    height 100%
    min-width 1080px
  }

  #LightingModeSetting .wrapper  > div {
    box-sizing border-box;
    -moz-box-sizing box-sizing ;
    -webkit-box-sizing border-box;
  }

  #LightingModeSetting .wrapper .title {
    height 32px;
    display inline-block !important
    background #e1ebfb
    color #18b566
    font-size 16px
    padding 2px 6px
    line-height 28px
    font-weight bold
  }

  #LightingModeSetting .wrapper .setting {
    border 1px solid darkgray
    boxShadow: 4px 2px 3px 2px rgba(176,196,222,.1)
    padding 0px 10px
    box-sizing border-box
    -moz-box-sizing box-sizing
    -webkit-box-sizing border-box
  }
  /* ********** */
  /* ********** */
  /* Btn */
  .btn-wrapper .ivu-btn {
    margin-right 10px
    background seashell
  }

  .btn-wrapper .ivu-btn:hover {
    background #47cb89
    color #f7f7f7
  }
  /* ********** */
  /*************/
  /* 表头文字居中 单元格文字居中*/
  #grid .k-link, #grid .k-header, #grid .grid-cell {
    text-align center;
  }
  /* 行 移入 样式 */
  #grid  tbody tr:not([class='k-grouping-row']):hover > td:not([class='k-group-cell']) {
    background #00ccff
    cursor pointer
  }
  /* 选中行 样式 aria-selected="false" class='k-state-selected' */
  #grid  tbody tr[aria-selected='true'] > td:not([class='k-group-cell']) {
    background #00ccff
  }
  /*********************/
  /* 单元格 command 命令 */
  #grid .grid-text-green {
    color: #19be6b
  }

  /* 单元格 btn */
  #grid  .grid-cell .k-button {
    border 1px solid gray
  }

  #grid  .grid-cell .k-button:hover {
    border 1px solid lightskyblue
    color deepskyblue
  }

  /* LightingMode_modalInput */
  .LightingMode_modalInput .el-input__inner {
    height 34px !important
    line-height 34px !important
  }

  .LightingMode_modalInput  .el-input__icon {
    line-height 34px !important
  }

  /* 表头文字居中 */
  .el-table .el-table__header-wrapper th > .cell {
    text-align center !important
    font-size 16px !important
    font-weight bold !important
    color #222222 !important
  }

  /* 表格文字居中 */
  .el-table .el-table__body .el-table__row .cell {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    height 100%
    padding 0
    margin 0
  }

  .el-table .el-table__body-wrapper .el-table__body tbody .el-table__row > td {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    padding 0px !important
    margin 0 !important
    height 40px !important
  }

  .el-table .el-table__body .el-table__row .cell {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    width: 100%;
    height: 100%;
    padding 0 !important
    margin 0 !important
    display table !important
  }

  .el-table .el-table__body .el-table__row .cell > div {
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
  .el-table .el-table__body-wrapper .el-table__body tbody .el-table__row {
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
    padding 0px
    margin 0
    height 30px
  }
  .el-table .el-table__body-wrapper .el-table__body tbody .el-table__row:hover > td {
    background:  #2db7f5 !important
  }
  .el-table .el-table__body-wrapper .el-table__body tbody .current-row .cell {
    background: #2db7f5 !important
  }
  .el-table .el-table__body-wrapper .el-table__body tbody .current-row td:hover .cell > div {
    background: #ffcd32 !important
  }
</style>
