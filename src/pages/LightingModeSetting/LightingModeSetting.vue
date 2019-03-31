<template>
  <div id="LightingModeSetting" ref="mainPage">
    <masterFrame>
      <div class="wrapper" ref="wrapper">
        <div class="title">景观亮化模式设置</div>
        <!-- btn -->
        <div class="setting">
          <div style="text-align: center; font-size: 16px;padding: 4px 4px;height: 32px">
            <span style="color: #2d8cf0;" v-if="treeSelectedArr.length">当前终端： {{ treeSelectedArr[0].title }}</span>
          </div>
          <div style="padding: 5px 4px;height: 44px">
            <span style="font-size: 14px;color: #000000">查看终端已设模式: </span>
            <span style="display: inline-block;width: 100px;padding-right: 8px" class="LightingMode_modalInput"
                  :title="OrderLimit === 1 ? '当前终端没有模式设置记录' : ''">
              <el-select v-model="selectOrder" :disabled="OrderLimit === 1" :clearable="true"
                         @change="selectOrderChange(selectOrder)">
                <el-option v-for="item in (OrderLimit - 1)" :key="item"
                           :label="item" :value="item">
                </el-option>
              </el-select>
            </span>
            <span style="font-size: 14px;color: #000000">当前设置的模式序号: </span>
            <span style="display: inline-block;width: 60px;" class="LightingMode_modalInput">
              <el-input v-model="modalOrder" :disabled="true"></el-input>
            </span>
            <!-- H5 弃用模式名称 -->
            <!--<span style="display: inline-block;margin-left: 10px;font-size: 14px;color: #000000">模式名称: </span>
            <span style="display: inline-block;width: 200px;" class="LightingMode_modalInput">
              <el-input v-model="modalName" :maxlength="50" :minlength="1" placeholder="请输入模式名称"></el-input>
            </span>-->
            <div style="display: inline-block;color: #80848f; float: right">
              <span style="display: inline-block;margin-right: 6px ">提示: 当前终端允许设置的模式最大序号为:{{OrderLimit}}</span>
              <Button :style="{fontSize: '14px', color: '#000000'}" :disabled="!(modalOrder < OrderLimit)"
                      @click="addNewMode">
                添加新模式
              </Button>
            </div>
          </div>
          <div style="border: 1px solid silver">
            <el-table :height="fullHeight" id="modalGrid"  border ref="modalGrid" fit width="100%" highlight-current-row :data="modalData"
                      @row-click="onRowClick">
              <!-- 段序 per -->
              <el-table-column label="段序(1~20)" width="140" resizable>
                <template slot-scope="scope" >
                  <div>{{ scope.row.per }}</div>
                </template>
              </el-table-column>
              <!-- 是否使用 isUsed -->
              <el-table-column label="是否使用" width="100" resizable>
                <template slot-scope="scope">
                  <div>
                    <el-checkbox v-model="scope.row.isUsed"></el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <!-- 开始日期 startDate -->
              <el-table-column label="开始时间" width="260" resizable>
                <template slot-scope="scope">
                  <div>
                    <DatePicker v-model="scope.row.startDate" type="datetime" confirm style="width: 200px" transfer
                                :clearable="false" :editable="false" format="yyyy-MM-dd HH:mm:ss">
                    </DatePicker>
                  </div>
                </template>
              </el-table-column>
              <!-- 结束日期 endDate -->
              <el-table-column label="结束时间" width="260" resizable>
                <template slot-scope="scope">
                  <div>
                    <DatePicker v-model="scope.row.lastDate" type="datetime" confirm style="width: 200px" transfer
                                :clearable="false" :editable="false" format="yyyy-MM-dd HH:mm:ss">
                    </DatePicker>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right;padding: 6px 4px;height: 44px">
              <Button @click="addPerData" :disabled="this.modalData.length === 20"
                      :title="this.modalData.length === 20 ? '每个模式最大仅允许设置20个时段' : ''">
                <span>添加时段</span>
              </Button>
              <Button @click="deletePerData" :disabled="!this.modalData.length">删除时段</Button>
            </div>
          </div>
          <div style="text-align: right;padding: 6px 4px;height: 44px">
            <Button @click="showAllRecord" style="float: left">查看所有终端记录</Button>
            <Button @click="confirmDialog('WriSel')">当前设计值发送至勾选终端</Button>
            <Button @click="confirmDialog('ReadSel')">当前模式值读取至勾选终端</Button>
          </div>
        </div>
      </div>
    </masterFrame>
    <div v-if="showDesignModal">
      <Modal v-model="showDesignModal" width="64%" :scrollable="true" :mask-closable="false" style="user-select: none"
             :closable="false">
        <div slot="header" class="btn-wrapper">
          <!--<Button size="large" @click="showAllRecord">重新加载数据</Button>-->
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
          title: '终端名称',
          field: 'terminalName',
          width: 200,
          attributes: {
            class: 'grid-cell'
          },
          hidden: true,
          groupHeaderTemplate: '<span> #= value # </span>'
        },
        {
          title: '模式序号',
          field: 'modeOrder',
          width: 120,
          // locked: true,
          attributes: {
            class: 'grid-cell'
          },
          template: function (data) {
            return `<span class="${data.terminalCode}">${data.modeOrder}</span>`
          }
        },
        /*{
          title: '模式名称',
          field: 'modeName',
          width: 150,
          // locked: true,
          attributes: {
            class: 'grid-cell'
          }
        },*/
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
                if (!/dper/.test(prop)) {
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
      ],
      datasourceSort: [
        {
          field: 'modeOrder',
          dir: 'asc'
        }
      ],
      groupable: {
        // enabled: true,
        enabled: false,
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
      modalData: [
        {
          per: 1,
          isUsed: true,
          startDate: '2019-03-21 00:00:00',
          lastDate: '2019-03-21 00:00:00'
        }
      ],
      modalOrder: 1,
      modalName: '',
      OrderLimit: 1,
      selectedRowIndex: -1,
      duringTime: 0
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
        const value = this.showDesignModal ? parseInt(this.getOrSetRow('get').modeOrder) : 1
        this._getData(ret, value)
      }
    },
    dataList (newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          this.handleExpand(false)
          this.getOrSetRow('set', false, this.treeTerminal)
        })
      }
    },
    modalData (newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          const data = newVal[newVal.length - 1]
          this.$refs.modalGrid.setCurrentRow(data)
          this.selectedRowIndex = data.per
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
    selectOrderChange (value) {
      const arr = this.dataListMap.get(this.treeTerminal) || new Array()
      let modalData = new Array()
      let targetRowData = Object.create(null)
      // 有终端记录
      if (arr.length) {
        for (let i in arr) {
          if (parseInt(arr[i].modeOrder) === value) {
            targetRowData = arr[i] // 获取源数据
            break
          }
        }
        // 构造 Modal-Grid 数据
        let obj = targetRowData.modeDesignValue
        if (JSON.stringify(obj) !== '{}') {
          for (let prop in obj) {
            modalData.push(this._constructModalData(obj[prop]))
          }
        }
      }
      // 更改 Modal-Grid
      this.modalOrder = value
      this.modalName = targetRowData.modeName || ''
      this.OrderLimit = arr.length + 1
      this.modalData = modalData
      this.selectOrder = value
      this.duringTime = 0
    },
    _constructModalData (strData, perIndex = 1) {
      // strData => 段序:1**是否使用:是**开始日期:03-22**结束日期:03-23**开灯时间:05:00:00**关灯时间:17:00:00
      const year = new Date().getFullYear()
      if (strData && strData.indexOf('**') > -1) {
        let arr = strData.replace(/\*\*/g, ' ').split(' ')
        // 返回构造值
        return {
          per: parseInt(arr[0].split(':')[1]),
          isUsed: arr[1].split(':')[1] === '是',
          startDate: year + '-' + arr[2].split(':')[1] + 'T' + arr[4].substring(5),
          lastDate: year + '-' + arr[3].split(':')[1] + 'T' + arr[5].substring(5)
        }
      }
      const duringTime = JSON.parse(JSON.stringify(this.duringTime))
      this.duringTime = duringTime + 1
      // 返回默认值
      return {
        per: perIndex,
        isUsed: true,
        startDate: m().add(duringTime, 'days').format('YYYY-MM-DD HH:mm:ss'),
        lastDate: m().add(duringTime + 1, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    confirmDialog (handleType = 'WriSel') {
      if (!this.treeCheckedArr.length) {
        this.modalDialog('warning', '操作有误!', '检测到没有勾选终端记录，请勾选发送指令的终端')
        return
      }
      this.$Modal.confirm({
        title: '确认操作提示',
        content: handleType === 'WriSel'
          ? `确定将${this.treeSelectedArr[0].title} 模式 ${this.modalOrder} 信息 写到勾选终端吗` : `确定读取勾选终端 模式${this.modalOrder} 信息吗`,
        onOk: this[handleType]
      })
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
      // console.log('写操作')
      const dataList = JSON.parse(JSON.stringify(this.modalData))
      let modeDesignValue = Object.create(null)
      if (dataList.length) {
        for (let i in dataList) {
          let item = dataList[i]
          item.startDate = m(item.startDate).format('YYYY-MM-DD HH:mm:ss') // 2019-03-21 00:00:00
          item.lastDate = m(item.lastDate).format('YYYY-MM-DD HH:mm:ss')
          const str1 = item.isUsed ? 'Y' : 'N'
          const str2 = item.startDate.split(' ')
          const str3 = item.lastDate.split(' ')
          // Y/03-20/03-21/00:00:00/00:00:00
          modeDesignValue['dper' + item.per] = str1 + '/' + str2[0].substring(5) + '/' + str3[0].substring(5) + '/' + str2[1] + '/' + str3[1]
          // 检查起止时间是否正确
          if (m(item.lastDate).isBefore(m(item.startDate))) {
            this.$Modal.warning({
              title: '数据有误!',
              content: `请修正 段序${item.per} 起止时间`
            })
            clearInterval(this.modalTimer)
            this.modalTimer = setTimeout(() => {
              this.$Modal.remove()
            }, 2300)
            return
          }
        }
      }
      let require = new Array()
      this.treeCheckedArr.forEach(item => {
        const terminalCode = item.objData.terminalCode
        require.push({
          terminalCode: terminalCode,
          modeOrder: this.modalOrder,
          fieldRecords: modeDesignValue
        })
      })
      const data = {
        codesInfo: JSON.stringify(require),
        active: 'LightingMode.WriteModeSetting',
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
      this.treeCheckedArr.map(item => {
        const terminalCode = item.objData.terminalCode
        require.push({
          terminalCode: terminalCode,
          modeOrder: this.modalOrder
        })
      })
      const data = {
        codesInfo: JSON.stringify(require),
        active: 'LightingMode.ReadModeSetting',
        depCode: this.depCode,
        userCode: this.userCode
      }
      setUserSetting(data)
        .then(res => {
          this.modalDialog('success', '操作成功', '读指令已执行')
        })
        .catch(err => {
          console.log(err)
        })
    },
    //
    // Todo: Table_Request
    _getData (requestCodes, value) {
      this.dataListMap.clear()
      const data = {
        codesAndName: JSON.stringify(requestCodes),
        active: 'LightingMode.GetModeSettingData'
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
          this.selectOrderChange(value)
        })
        .catch(err => {
          console.log(err)
        })
    },
    _queryAllRecord () {
      const arr = [...this.CodesNameMap.values()] || new Array()
      let query = new Array()
      arr.map(target => {
        query.push({
          terminalCode: target.objData.terminalCode,
          terminalName: `${target.title} (${target.objData.terminalCode})`
        })
      })
      const data = {
        codesAndName: JSON.stringify(query),
        active: 'LightingMode.GetModeSettingData'
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
        let readValue = ''
        if (JSON.stringify(item.modeDesignValue) !== '{}') {
          const obj = item.modeDesignValue
          for (let prop in obj) {
            designValue += obj[prop].replace(/\*\*/g, ' ') + '\n'
          }
        }
        if (JSON.stringify(item.modeReadValue) !== '{}') {
          const obj = item.modeReadValue
          for (let prop in obj) {
            readValue += obj[prop].replace(/\*\*/g, ' ') + '\n'
          }
        }
        item.modeDesignValue = designValue
        item.modeReadValue = readValue
      })
      saveExcel({
        data: data,
        fileName: `景观亮化模式设置${m().format('YYYY-MM-DD HH:mm:ss')}`,
        columns: this.columns
      })
    },
    // Todo: el-table Options
    onRowClick (row, event, column) {
      this.selectedRowIndex = row.per
    },
    modalCancel () {
      this.showDesignModal = false
      this.dataList = new Array()
    },
    addNewMode () {
      this.modalOrder = JSON.stringify(this.OrderLimit)
      this.modalName = ''
      this.modalData = new Array()
    },
    addPerData () {
      const perIndex = this.modalData.length + 1
      this.modalData.push(this._constructModalData('', perIndex))
    },
    deletePerData () {
      const modalData = JSON.parse(JSON.stringify(this.modalData))
      const deleteIndex = JSON.parse(JSON.stringify(this.selectedRowIndex)) - 1
      let arr = new Array()
      if (deleteIndex < 0) {
        this.$Modal.warning({
          title: '错误提示!',
          content: '当前没有选中行记录'
        })
        clearInterval(this.modalTimer)
        this.modalTimer = setTimeout(() => {
          this.$Modal.remove()
        }, 2300)
        return
      }
      modalData.map((item, index) => {
        if (index < deleteIndex) {
          arr.push(item)
        } else if (index > deleteIndex) {
          item.per = index
          arr.push(item)
        }
      })
      this.modalData = arr
    },
    savePerData () {
      const dataList = JSON.parse(JSON.stringify(this.modalData))
      let modeDesignValue = Object.create(null)
      let arr = new Array()
      if (dataList.length) {
        for (let i in dataList) {
          let item = dataList[i]
          item.startDate = m(item.startDate).format('YYYY-MM-DD HH:mm:ss') // 2019-03-21 00:00:00
          item.lastDate = m(item.lastDate).format('YYYY-MM-DD HH:mm:ss')
          const str1 = item.isUsed ? 'Y' : 'N'
          const str2 = item.startDate.split(' ')
          const str3 = item.lastDate.split(' ')
          // Y/03-20/03-21/00:00:00/00:00:00
          modeDesignValue['dper' + item.per] = str1 + '/' + str2[0].substring(5) + '/' + str3[0].substring(5) + '/' + str2[1] + '/' + str3[1]
          // 检查起止时间是否正确
          if (m(item.lastDate).isBefore(m(item.startDate))) {
            this.$Modal.warning({
              title: '数据有误!',
              content: `请修正 段序${item.per} 起止时间`
            })
            clearInterval(this.modalTimer)
            this.modalTimer = setTimeout(() => {
              this.$Modal.remove()
            }, 2300)
            return
          }
        }
        arr.push(modeDesignValue)
        const data = {
          active: 'LightingMode.SaveModeSetting',
          codesInfo: JSON.stringify(arr),
          terminalCode: this.treeTerminal,
          modeName: this.modalName,
          modeOrder: this.modalOrder
        }
        setUserSetting(data)
          .then(res => {
            this.modalCancel()
            this.reloadData()
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  created () {
    this.fullHeight = document.documentElement.clientHeight - 22 - 34 - 120 - 4 - 44
    window.$this = this
    // console.log(parseInt('01'))
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
