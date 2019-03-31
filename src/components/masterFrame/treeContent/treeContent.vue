<template>
  <div id="treeContentWrapper" :style="{height: `${treeHeight}px`}">
    <el-tabs type="card" v-model="activeName" :style="{height: 40}">
      <el-tab-pane label="列表" name="listTreeData"></el-tab-pane>
      <el-tab-pane label="区域" name="regionTreeData"></el-tab-pane>
      <el-tab-pane label="类型" name="typeTreeData"></el-tab-pane>
    </el-tabs>
    <!-- 树组件 ( accordion 手风琴模式 )-->
    <div class="treeContainer Wrapper__Tree" :style="{height: `${treeHeight - 90}px`}" @mousewheel="handleScroll">
      <el-tree :props="defaultProps" :empty-text="emptyText"
               :data="ViewData" :renderContent="renderContent" node-key="title"
               :show-checkbox="showCheckBox" ref="Tree"
               accordion
               @node-expand="parentExpand" @node-collapse="parentExpand"
               @current-change="changeTreeTerminal"
               @check="treeChecked">
      </el-tree>
    </div>
    <!-- 计数控件 -->
    <div id="treeChecked" ref="treeCheck">
      <span>[</span>
      <span :style="{color: treeCheckedArr.length > 0 ? 'red' : 'gray'}">
        已勾选：{{ treeCheckedArr.length }}
      </span>
      <span style="color: #2d8cf0">/</span>
      <span>总数：{{ respondData.length }}</span>
      <span>]</span>
    </div>
    <Page id="pagination" :current="curPage" :total="totalPage * pageSize"
          v-show="activeName === 'listTreeData'"
          :pageSize="pageSize" simple @on-change="handlePagination"/>
    <Page id="pagination" :current="typeCurPage" :total="typeTotalPage * typePageSize"
          v-show="activeName === 'typeTreeData' && typeExpand !== 'None' && isTypePagination"
          :pageSize="typePageSize" simple @on-change="handlePagination"/>
    <!-- 右键 -->
    <vue-context-menu
      :contextMenuData="contextMenuData"
      @checkedCurrentHover="selectCurrentHover"
      @checkedAll="checkedAll"
      @quitAll="quitAll"
      @checkedCurrentDir="checkedCurrentDir"
      @quitCurrentDir="quitCurrentDir">
    </vue-context-menu>
  </div>
</template>
<script type='text/ecmascript-6'>
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import VueContextMenu from 'base/contextmenu/VueContextMenu'
import { freeColorStyle } from 'common/js/treeDataHandler'
import { setUserSetting } from 'api/setUserSetting'
import m from 'moment'
const MENU_LIST_HEIGHT = 30
const MAX_BATCHES_COUNT = 50
const TIME_SPAN = 1000
const ScrollDelayer = 200
export default {
  components: {
    VueContextMenu
  },
  props: {
    // 复选框显示
    showCheckBox: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 树高度
    treeHeight: {
      type: Number,
      default () {
        return 560
      }
    },
    // 自定义显示 [ 字体颜色 ]
    showArr: {
      type: Array,
      default () {
        return []
      }
    },
    // 初始请求完成标志
    initFinish: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    // ToDo: TreeModule
    ...mapGetters('treeModule', [
      // originalData
      'respondData',
      'respondMap',
      // treeData
      'listTreeData',
      'regionTreeData',
      'typeTreeData',
      // tree options
      'treeTerminal',
      'treeCheckedArr',
      'treeSelectedArr',
      // handle way
      'filterCode'
    ]),
    // ToDo: dwjModule
    ...mapGetters('dwjModule', [
      'DWJStatus',
      'qts',
      'dwjRespond'
    ]),
    ...mapGetters('userModule', [
      'depCode',
      'userCode',
      'tree',
      'UFCode'
    ]),
    // list Dic
    listTreeMap () {
      let map = new Map()
      if (this.listTreeData.length) {
        this.listTreeData.forEach(item => {
          map.set(item.objData[this.filterCode], item)
        })
      }
      return map
    },
    // list pageSize
    pageSize () {
      const scrollbar = 18 // 水平滚动条
      return parseInt((this.treeHeight - 90 - scrollbar) / MENU_LIST_HEIGHT)
    }
  },
  data () {
    return {
      // 配置项
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      emptyText: '当前项没有数据',
      DWJ_Style: {
        display: 'inline-block',
        width: '20px',
        height: '24px',
        lineHeight: '22px',
        textAlign: 'center',
        boxSizing: 'borderBox',
        fontSize: '16px',
        fontFamily: '微软雅黑',
        fontWeight: 'bold',
        color: 'green',
        border: '1px solid #80848f'
      },
      // 显示控制
      activeName: 'listTreeData',
      isTabChange: false,
      // 树列表 数据
      ViewData: new Array(),
      // 右键菜单 记录项
      markData: {}, // 当前右键点击节点对象
      markDataParent: {}, // 当前右键点击节点对象父级
      // 菜单项
      contextMenuData: {
        menuName: 'treeContext',
        // 菜单位置
        axios: {
          x: null,
          y: null
        },
        menulists: [
          {
            fnHandler: 'checkedCurrentHover',
            icoName: '',
            btnName: '勾选当前终端',
            flag: true
          },
          {
            fnHandler: 'checkedAll',
            //icoName: 'el-icon-more',
            icoName: '',
            btnName: '勾选所有终端',
            flag: true
          },
          {
            fnHandler: 'quitAll',
            icoName: '',
            btnName: '取消勾选所有终端',
            flag: false
          },
          {
            fnHandler: 'checkedCurrentDir',
            icoName: '',
            btnName: '勾选当前层级所有终端',
            flag: true
          },
          {
            fnHandler: 'quitCurrentDir',
            icoName: '',
            btnName: '取消勾选当前层级所有终端',
            flag: true
          }
        ]
      },
      // 灯网警实时请求 计时器
      requestList: new Array(),
      isDWJRequest: false,
      batchesTimer: null,
      readDWJIndex: 0,
      writerTimer: null,
      writeDWJIndex: 0,
      // 分页器 记录项
      curPage: 1,
      totalPage: 1,
      // 滚轮滚动 延时器
      scrollTimer: null,
      // 区域树 信息记录
      regionTreeObj: Object(),
      regionExpand: 'None',
      // 类型树 信息记录
      typeTreeObj: Object(),
      typeExpand: 'None',
      isTypePagination: true,
      typeTotalPage: 1,
      typeCurPage: 1,
      typePageSize: 1
    }
  },
  watch: {
    // 监测 状态库 树选中终端 状态变化，更新 树节点 选中状态
    treeTerminal (newVal) {
      // 更新 处理 标志
      this.isTabChange = false
      // 获取目标页
      // console.log(`开始计算:${m().format('YYYY-MM-DD HH:mm:ss')}`)
      this.initTargetPage(this.activeName, newVal)
    },
    // 监测 显示项 切换
    activeName (newVal, oldVal) {
      clearInterval(this.batchesTimer)
      clearInterval(this.writerTimer)
      // 更新 处理 标志
      this.isTabChange = true
      // 获取目标页
      console.log(`开始计算:${m().format('YYYY-MM-DD HH:mm:ss')}`)
      this.initTargetPage(newVal, this.treeTerminal)
      return newVal
    },
    // 类型树 当前展开项
    typeExpand (newVal) {
      return newVal
    }
  },
  methods: {
    // ToDo: Mutations
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL',
      setAddressCode: 'SET_ADDRESS_CODE',
      setRunningCode: 'SET_RUNNING_CODE',
      setSelectedArr: 'SET_TREE_SELECTED',
      setCheckedArr: 'SET_CHECKED_ARR'
    }),
    ...mapMutations('dwjModule', {
      setStatus: 'SET_DWJ_STATUS',
      setQTS: 'SET_QTS',
      setDWJRespond: 'SET_DWJ_RESPOND'
    }),
    //
    // Todo: Custom Render [ Dependent On DWJStatus ]
    renderContent (h, { node, data, store }) {
      // handle parentNodes
      if (!node.isLeaf) {
        // const firstNode = node.childNodes[0]
        const title = data.title
        // const count = data.children.length
        // 类型树 ? => 区域树 ? => 列表树
        // const text = this.activeName === 'typeTreeData' ? `${title}` : firstNode.isLeaf ? `${title} [ ${count} ]` : `${title}`
        const text = data.isShowLen ? `${title} [ ${data.curDirLen} ]` : `${title}`
        return h('span', {
          class: ['tree-parentNode', `${title}`]
        }, text)
      } else {
        const code = data.objData.terminalCode
        return h('span', {
          class: ['tree-childrenNode', `${code}`],
          attrs: {
            title: `${data.title}`
          },
          on: {
            contextmenu: () => {
              this.markData = data
              this.markDataParent = node.parent
              this.markDownData(data)
            }
          }
        }, [
          h('span', {
            class: `D_${code}`,
            style: Object.assign({}, this.DWJ_Style, {
              display: (this.DWJStatus[0] === '1' ? 'inline-block' : 'none')
            })
          }, '灯'),
          h('span', {
            class: `W_${code}`,
            style: Object.assign({}, this.DWJ_Style, {
              display: (this.DWJStatus[1] === '1' ? 'inline-block' : 'none')
            })
          }, '网'),
          h('span', {
            class: `J_${code}`,
            style: Object.assign({}, this.DWJ_Style, {
              display: (this.DWJStatus[2] === '1' ? 'inline-block' : 'none')
            })
          }, '警'),
          h('span', {
            class: [`T_${code}`, 'tree-childrenNode-title'],
            style: {
              color: freeColorStyle(data.objData, this.showArr)
            }
          }, data.title)
        ])
      }
    },
    //
    // Todo： By Handle Selected Event
    // 父节点 展开事件 [ 列表无法触发, 区域、类型触发]
    parentExpand (data, node, store) {
      // 清除定时器
      clearInterval(this.batchesTimer)
      clearInterval(this.writerTimer)
      clearInterval(this.scrollTimer)
      // 消除 内部默认选中事件 影响
      let target = this.respondMap.get(this.treeTerminal)
      this.changeCurrentNode(target)
      // 区域树 触发
      if (this.activeName === 'regionTreeData') {
        if (this.regionTreeObj[data.title] && data.title !== this.regionExpand) {
          this.regionExpand = data.title
          console.log('区域树 展开新层级')
          this.viewData = new Array()
          this._initTreeView('regionTreeData')
        }
        return
      }
      // 类型树 触发
      if (this.activeName === 'typeTreeData') {
        if (this.typeTreeObj[data.title] && data.title !== this.typeExpand) {
          this.typeExpand = data.title
          console.log('类型树 展开新层级')
          this.viewData = new Array()
          this._initTreeView('typeTreeData')
        }
      }
    },
    // 更新状态库记录 ( renderContent's event ) - 树选中终端
    changeTreeTerminal (data, node) {
      // 仅当对象为叶节点
      if (node.isLeaf) {
        this.setTreeTerminal(data.objData[this.filterCode])
      }
    },
    // 更改树列表 选中节点
    changeCurrentNode (data) {
      this.setSelectedArr([data])
      this.$refs.Tree.setCurrentNode(data)
    },
    //
    // Todo: By Handle Checked Event
    // 更新 勾选视图
    treeChecked (data) {
      // console.log(data) 传递给 data 属性的数组中该节点所对应的对象 [ 并非节点对象 ]
      // console.log(this.$refs.Tree.getNode(data))
      const clickNode = this.$refs.Tree.getNode(data)
      const isChecked = clickNode.checked
      const isLeaf = clickNode.isLeaf
      let checkedMap = new Map()
      const treeCheckedArr = JSON.parse(JSON.stringify(this.treeCheckedArr))
      if (treeCheckedArr.length) {
        treeCheckedArr.forEach(item => {
          checkedMap.set(item.objData[this.filterCode], item)
        })
      }
      if (isLeaf) {
        // 叶节点的勾选
        isChecked ? checkedMap.set(data.objData[this.filterCode], data) : checkedMap.delete(data.objData[this.filterCode])
      } else {
        // 非叶节点的勾选
        let dirTitle = new Array()
        dirTitle.push(clickNode.data.title)
        // 获取 clickNode 下 所有的 半子节点
        let clickNodeChildren = clickNode.childNodes
        clickNodeChildren.filter(function f(o, index) {
          if (o.childNodes && o.childNodes.length && o.childNodes[0].childNodes.length === 0) {
            dirTitle.push(o.data.title)
            return true
          }
          return (o.childNodes = o.childNodes.filter(f, index)).length
        })
        const handleObj = this.activeName === 'regionTreeData' ? this.regionTreeObj : this.typeTreeObj
        dirTitle.forEach(dirName => {
          if (handleObj[dirName]) {
            const dic = handleObj[dirName].dic || handleObj[dirName]
            dic.forEach((value, key) => {
              isChecked ? checkedMap.set(key, value) : checkedMap.delete(key)
            })
          }
        })
      }
      this.setCheckedArr([...checkedMap.values()])
    },
    setTreeChecked (dataArray) {
      this.setCheckedArr(dataArray)
      this.$refs.Tree.setCheckedNodes(dataArray)
    },
    //
    // Todo: By Content-text Menu
    markDownData (data) {
      this.markData = data // 记录 当前被右键点击的 节点
      // 当前节点对象  console.log(this.$refs.listTree.getNode(data))
      this.showContextMenu()
    },
    // 菜单设置
    showContextMenu () {
      if (!this.showCheckBox) {
        return
      }
      event.preventDefault()
      event.cancelBubble = true
      let x = event.clientX
      let y = event.clientY
      // 限制 菜单纵向显示位置
      let contextHeight = $('.vue-contextmenu-listWrapper')[0].children.length * MENU_LIST_HEIGHT
      if (y + contextHeight > document.documentElement.clientHeight) {
        y = document.documentElement.clientHeight - contextHeight - 20
      }
      this.contextMenuData.axios = { x, y }
      // 全选计算
      const hasAllCheck = this.treeCheckedArr.length === this.respondData.length
      this.contextMenuData.menulists[1].flag = !hasAllCheck
      // 取消所有
      const hasCheck = this.treeCheckedArr.length > 0
      this.contextMenuData.menulists[2].flag = hasCheck
      // 当前层级 计算 [ 任意一个为假值，返回 false => 该层级没有被全选 ]
      // let hasDirCheck = _.some(this.markDataParent.childNodes, { 'checked': false })
      // this.contextMenuData.menulists[3].flag = hasDirCheck
      // this.contextMenuData.menulists[4].flag = !hasDirCheck
    },
    // 勾选当前终端
    selectCurrentHover () {
      this.setTreeChecked([this.markData])
    },
    // 勾选所有
    checkedAll () {
      this.setTreeChecked(this.respondData)
    },
    // 取消所有
    quitAll () {
      let empty = new Array()
      this.setTreeChecked(empty)
    },
    // 勾选当前层级 checkedAll => true 勾选层级; false 取消层级
    checkedCurrentDir (checkedAll = true) {
      const treeType = this.activeName
      let tempMap = new Map()
      this.treeCheckedArr.forEach(item => {
        tempMap.set(item.objData[this.filterCode], item)
      })
      // 列表
      if (treeType === 'listTreeData' && this.listTreeMap.size) {
        this.listTreeMap.forEach((value, key) => {
          if (!checkedAll) {
            tempMap.delete(key) // 移除
          }
          if (checkedAll && !tempMap.has(key)) {
            tempMap.set(key, value) // 添加
          }
        })
        // 更新
        this.setTreeChecked([...tempMap.values()])
        return
      }
      // 区域
      if (treeType === 'regionTreeData') {
        const curDirList = this.markDataParent.childNodes
        if (curDirList.length) {
          curDirList.forEach(item => {
            const data = item.data
            const key = item.data.objData[this.filterCode]
            if (!checkedAll) {
              tempMap.delete(key)
            } else {
              if (!tempMap.has(key)) {
                tempMap.set(key, data)
              }
            }
          })
        }
        // 更新
        this.setTreeChecked([...tempMap.values()])
        return
      }
      // 类型
      if (treeType === 'typeTreeData') {
        const curDir = this.typeTreeObj[this.typeExpand].dic
        curDir.forEach((value, key) => {
          if (!checkedAll) {
            tempMap.delete(key)
          }
          if (checkedAll && !tempMap.has(key)) {
            tempMap.set(key, value)
          }
        })
        // 更新
        this.setTreeChecked([...tempMap.values()])
      }
    },
    // 取消勾选当前层级
    quitCurrentDir () {
      this.checkedCurrentDir(false)
    },
    /*******************************************************/
    /************************ 灯网警 ************************/
    // ToDo: By Handle DWJ Status [ Read Options && Update && Write Options ]
    // 灯网警 定时更新
    _batchesRequest (index = 0) {
      //console.log(this.requestList)
      const curDirList = this.requestList // 选中节点父级序列
      if (curDirList.length) {
        const list = _.chunk(curDirList, MAX_BATCHES_COUNT)
        let codes = new Array()
        list[index].forEach(item => {
          const tempObj = item.data || item
          const terminalCode = tempObj.objData.terminalCode
          if (terminalCode) { // 有效终端编码
            codes.push(terminalCode)
          }
        })
        console.log(codes)
        if (codes.length) {
          setUserSetting(
            Object.assign({}, {
              active: 'TreeStatus.GetTerminalsSimpleStatus',
              request: JSON.stringify({
                TerminalCodes: codes,
                TreeTypeCode: this.tree
              })
            })
          ).then((res) => {
            this.changeDWJStatus(JSON.parse(res))
            // 等待 DOM 操作完成
            this.$nextTick(() => {
              let span = index + 1 < list.length ? 5 : 20
              this.batchesTimer = setTimeout(() => {
                this.readDWJIndex = index + 1 < list.length ? index + 1 : 0
                this._batchesRequest(this.readDWJIndex)
              }, TIME_SPAN * span)
            })
          })
            .catch(err => {
              console.log(err)
              console.log('灯网警状态更新出错')
            })
        }
      }
    },
    // 更改灯网警状态
    changeDWJStatus (dataList) {
      if (!dataList.length) {
        return
      }
      let difference = new Array()
      dataList.forEach(item => {
        let terminalCode = item.terminalCode
        if (JSON.stringify(this.dwjRespond.get(terminalCode)) !== JSON.stringify(item)) {
          this.dwjRespond.set(terminalCode, item)
          difference.push(item)
        }
      })
      // 当前显示的数据源未发生改变
      if (difference.length) {
        difference.forEach(item => {
          this.changeColor(item)
        })
      }
    },
    // DOM 更新
    changeColor (objData) {
      let D_Targets = $(`.D_${objData.terminalCode}`)
      let W_Targets = $(`.W_${objData.terminalCode}`)
      let J_Targets = $(`.J_${objData.terminalCode}`)
      for (let i = 0; i < D_Targets.length; i++) {
        if (this.DWJStatus[0] === '1') {
          D_Targets[i].style.color = objData.isOpenLamp ? 'red' : 'green'
        }
        if (this.DWJStatus[1] === '1') {
          W_Targets[i].style.color = objData.isOnline ? 'green' : 'red'
        }
        if (this.DWJStatus[2] === '1') {
          J_Targets[i].style.color = objData.isAlarm ? 'red' : 'green'
        }
      }
    },
    // 写入 灯网警 状态
    _writeDWJStatus (index = 0) {
      let curArr = _.chunk(this.respondData, MAX_BATCHES_COUNT)
      let codes = new Array()
      curArr[index].forEach(item => {
        codes.push(item.objData.terminalCode)
      })
      setUserSetting({
        active: 'CheckBoxOfElectricEnergy.UpdateTerminalTimeOfMixedStatus',
        codes: JSON.stringify(codes)
      })
        .then(res => {
          const isSuccess = res === '1'
          const isLastOne = index + 1 < curArr.length
          const span = isSuccess ? isLastOne ? 5 : 60 : 5
          this.writeDWJIndex = isSuccess ? isLastOne ? index + 1 : 0 : index
          clearInterval(this.writerTimer)
          this.writerTimer = setTimeout(() => {
            this._writeDWJStatus(this.writeDWJIndex)
          }, TIME_SPAN * span)
        })
        .catch(err => {
          console.log(err)
          console.log('写入 灯网警 状态 报错')
        })
      //
    },
    /*******************************************************/
    /*********************** 数据显示 ***********************/
    // ToDo: By Handle Input_Pagination [ targetPage => 目标页码 ]
    handlePagination (targetPage) {
      if (this.activeName === 'listTreeData') {
        this.curPage = targetPage
        this._initTreeView(this.activeName, targetPage, this.pageSize)
        return
      }
      //
      if (this.activeName === 'regionTreeData') {}
      //
      if (this.activeName === 'typeTreeData') {
        this.typeTreeObj[this.typeExpand].curPage = targetPage
        this._initTreeView('typeTreeData')
        this.$nextTick(() => {
          const tarObj = this.typeTreeObj[this.typeExpand]
          // 当前页 首个节点
          const firstChild = _.chunk([...tarObj.dic.values()], tarObj.pageSize)[tarObj.curPage - 1][0]
          const firstNode = this.$refs.Tree.getNode(firstChild)
          this._expandTargetDir(firstNode, true)
        })
      }
    },
    //
    // ToDo: By Handle Scroll_Pagination [ event ]
    handleScroll (e) {
      //
      if (this.activeName === 'listTreeData') {
        if (this.scrollTimer) {
          clearInterval(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
          if (e.deltaY > 0 && this.curPage + 1 <= this.totalPage) { // 判断滚轮滑动方向
            this._initTreeView('listTreeData', this.curPage + 1, this.pageSize)
          }
          if (e.deltaY < 0 && this.curPage - 1 > 0) {
            this._initTreeView('listTreeData', this.curPage - 1, this.pageSize)
          }
        }, ScrollDelayer)
      }
      //
      if (this.activeName === 'typeTreeData' && this.typeExpand !== 'None' && this.typeTreeObj[this.typeExpand].isPagination) {
        clearInterval(this.scrollTimer)
        this.scrollTimer = setTimeout(() => {
          const targetObj = JSON.parse(JSON.stringify(this.typeTreeObj[this.typeExpand]))
          const curPage = targetObj.curPage
          const maxPage = targetObj.maxPage
          let isPageChange = false
          if (e.deltaY > 0 && curPage + 1 <= maxPage) { // 判断滚轮滑动方向
            this.typeTreeObj[this.typeExpand].curPage = curPage + 1
            isPageChange = true
          }
          if (e.deltaY < 0 && curPage - 1 > 0) {
            this.typeTreeObj[this.typeExpand].curPage = curPage - 1
            isPageChange = true
          }
          if (isPageChange) {
            this._initTreeView('typeTreeData')
          }
        }, ScrollDelayer)
      }
    },
    //
    // ToDo: By Handle Scroll_To_Target
    _scrollToTarget (posTarget) {
      if (posTarget) {
        if (this.scrollTimer) {
          clearInterval(this.scrollTimer)
        }
        const timer = ScrollDelayer
        this.scrollTimer = setTimeout(() => {
          const scrollTarget = $('#treeContentWrapper .Wrapper__Tree')[0]
          const scrollTop = scrollTarget.scrollTop
          const clientHeight = scrollTarget.clientHeight
          if (posTarget.offsetTop - MENU_LIST_HEIGHT < scrollTop || posTarget.offsetTop + MENU_LIST_HEIGHT >= scrollTop + clientHeight) {
            const delay = 250
            $(scrollTarget).animate({scrollTop: posTarget.offsetTop}, delay)
          }
        }, timer)
        return
      }
      const scrollTarget = $('#treeContentWrapper .Wrapper__Tree')[0]
      $(scrollTarget).animate({scrollTop: 0}, 250)
    },
    //
    // ToDo: By Handle SearchTargetPage [ treeType => 树类型 terminalCode => 选中终端标识码 ]
    initTargetPage (treeType, filterCode) {
      // 列表
      if (treeType === 'listTreeData') {
        // 当前页是否存在
        if (this.ViewData.length && !this.isTableChange) {
          let index = _.findIndex(this.ViewData, (o) => { return o.objData[this.filterCode] === filterCode })
          if (index > -1) {
            console.log('选中终端存在当前页，列表数据不切换')
            this.changeCurrentNode(this.respondMap.get(filterCode))
            return
          }
        }
        // 当前树是否存在
        let dataSource = [...this.listTreeMap.keys()]
        let index = _.findIndex(dataSource, (o) => { return o === filterCode })
        if (index > -1) {
          console.log('选中终端存在当前树，列表数据切换至目标页')
          let curPage = parseInt(index / this.pageSize) + 1
          curPage = curPage < 1 ? 1 : curPage
          this._initTreeView(treeType, curPage, this.pageSize)
          return
        }
        console.log('当前树不存在选中终端，列表数据不切换')
        this._initTreeView(treeType, this.curPage, this.pageSize)
        //this.changeCurrentNode(this.respondMap.get(terminalCode)) // 均不存在
      }
      // 区域
      if (treeType === 'regionTreeData') {
        if (!this.regionTreeData.length) {
          this.ViewData = new Array()
          return
        }
        const hasInit = JSON.stringify(this.regionTreeObj) !== '{}'
        if (!hasInit) {
          this._regionTreeFilter(this.regionTreeData, 'None') // 初始化 regionTreeObj
        }
        if (!this.isTabChange && this.regionExpand !== 'None') {
          const targetDic = this.regionTreeObj[this.regionExpand]
          if (targetDic.has(filterCode)) {
            console.log('记录层存在选中终端，区域树不重构')
            const nodeData = targetDic.get(filterCode)
            this.changeCurrentNode(nodeData)
            this._expandTargetDir(this.$refs.Tree.getNode(nodeData), true)
            this.$nextTick(() => {
              const posTarget = $('#treeContentWrapper .is-current')[0]
              this._scrollToTarget(posTarget)
            })
            return
          }
        }
        for (let prop in this.regionTreeObj) {
          const dic = this.regionTreeObj[prop]
          if (dic.size && dic.has(filterCode)) {
            console.log('记录层不存在选中终端，但区域树存在，区域树重构')
            this.regionExpand = prop // 记录展开层
            this._initTreeView(treeType)
            return
          }
        }
        // 当前树 不存在 选中终端
        console.log('区域树不存在选中终端，区域树重构')
        this.regionExpand = 'None'
        this._initTreeView(treeType)
      }
      // 类型
      if (treeType === 'typeTreeData') {
        if (!this.typeTreeData.length) {
          this.ViewData = new Array()
          return
        }
        if (JSON.stringify(this.typeTreeObj) === '{}') {
          this.typeTreeObj = this._initTypeTreeObj(this.typeTreeData) // 初始化 typeTreeObj 对象
        }
        if (!this.isTabChange && this.typeExpand !== 'None' && this.typeTreeObj[this.typeExpand].dic.has(filterCode)) {
          const targetObj = this.typeTreeObj[this.typeExpand]
          if (targetObj.isPagination && targetObj.dic.get(filterCode).pageIndex === this.typeCurPage) {
            this.changeCurrentNode(targetObj.dic.get(filterCode))
            console.log('当前展开层存在选中终端,类型树不重构')
            return
          }
        }
        for (let prop in this.typeTreeObj) {
          const targetObj = this.typeTreeObj[prop]
          if (targetObj.dic.size && targetObj.dic.has(filterCode)) {
            console.log('当前展开层不存在选中终端，但类型树存在，类型树重构')
            // 更新展开层
            this.typeExpand = prop
            // 重构树
            this.typeTreeObj[prop].curPage = targetObj.dic.get(filterCode).pageIndex
            this._initTreeView(treeType)
            return
          }
        }
        console.log('类型树不存在选中终端，数据切换为类型树')
        // 当前树 不存在 选中终端
        this.typeExpand = 'None'
        this.isTypePagination = false
        this._initTreeView(treeType)
      }
    },
    //
    // ToDo: By Init Or Refresh TreeView [ treeType => 树类型 curPage => 显示页 pageSize => 分页量 ]
    _initTreeView (treeType = 'listTreeData', curPage = 1, pageSize = 50) {
      // 清除延时器
      clearInterval(this.writerTimer)
      clearInterval(this.batchesTimer)
      /* 分区 数据处理 */
      // 列表
      if (treeType === 'listTreeData') {
        let dataSource = [...this.listTreeMap.values()]
        if (dataSource.length > pageSize) {
          const tempArr = _.chunk(dataSource, pageSize)
          this.curPage = curPage
          this.totalPage = tempArr.length
          this.ViewData = tempArr[curPage - 1]
        } else {
          this.curPage = curPage
          this.totalPage = 1
          this.ViewData = dataSource
        }
        // this.requestList = JSON.parse(JSON.stringify(this.ViewData))
        // 数据渲染完成
        this.$nextTick(() => {
          this._initAllInfo()
        })
        return
      }
      // 区域
      if (treeType === 'regionTreeData') {
        // this.ViewData = this._regionTreeFilter(this.regionTreeData, this.regionExpand)
        this.ViewData = this._rebuildRegionTree(this.regionTreeData, this.regionExpand, this.regionTreeObj)
        clearInterval(this.scrollTimer)
        this.$nextTick(() => {
          this._initAllInfo()
        })
        return
      }
      // 类型
      if (treeType === 'typeTreeData') {
        // 更新显示页
        const target = this.typeTreeObj[this.typeExpand]
        if (target) {
          this.typeTotalPage = target.maxPage
          this.typeCurPage = target.curPage
          this.typePageSize = target.pageSize
          this.isTypePagination = target.isPagination
        }
        // 更新视图
        this.ViewData = this._rebuildTypeTree(this.typeTreeData, this.typeExpand, this.typeTreeObj)
        clearInterval(this.scrollTimer)
        this.$nextTick(() => {
          this._initAllInfo()
        })
      }
    },
    // 初始化 灯网警状态、选中状态、勾选状态
    _initAllInfo () {
      // 初始化选中
      this.changeCurrentNode(this.respondMap.get(this.treeTerminal))
      //
      // 初始化勾选
      this.$refs.Tree.setCheckedNodes(this.treeCheckedArr)
      //
      // 展开目标层级
      if (this.activeName === 'regionTreeData' && this.regionExpand !== 'None') {
        const targetDic = this.regionTreeObj[this.regionExpand]
        const nodeData = [...targetDic.values()][0]
        this._expandTargetDir(this.$refs.Tree.getNode(nodeData), true)
      }
      if (this.activeName === 'typeTreeData' && this.typeExpand !== 'None') {
        const target = this.typeTreeObj[this.typeExpand]
        const nodeData = _.chunk([...target.dic.values()], target.pageSize)[target.curPage - 1][0]
        this._expandTargetDir(this.$refs.Tree.getNode(nodeData), true)
      }
      //
      // 更新 灯网警请求 序列
      const tab = this.activeName
      const regionDic = this.regionTreeObj[this.regionExpand]
      const target = this.typeTreeObj[this.typeExpand]
      this.requestList = tab === 'listTreeData'
        ? this.ViewData : tab === 'regionTreeData'
          ? regionDic ? [...regionDic.values()] : new Array() : target
            ? target.isPagination
              ? _.chunk([...target.dic.values()], target.pageSize)[target.curPage - 1] : [...target.dic.values()] : new Array()
      //
      // console.log(this.requestList)
      // 灯网警请求、灯网警请求序列长度不为零 => 初始化灯网警状态
      if (this.isDWJRequest && this.requestList.length) {
        this.$nextTick(() => {
          // 存在灯网警状态数据
          if (this.dwjRespond.size) {
            const curDirList = this.requestList
            curDirList.forEach(item => {
              const tempObj = item.data || item
              const terminalCode = tempObj.objData.terminalCode
              if (this.dwjRespond.has(terminalCode)) {
                this.changeColor(this.dwjRespond.get(terminalCode))
              }
            })
          }
          this._batchesRequest(0)
          this._writeDWJStatus(this.writeDWJIndex)
        })
      }
      //
      // console.log(`渲染结束:${m().format('YYYY-MM-DD HH:mm:ss')}`)
      this.$nextTick(() => {
        const posTarget = $('#treeContentWrapper .is-current')[0]
        this._scrollToTarget(posTarget)
      })
    },
    // 目标层级操作 [ target => 选中控制点 isExpand => 布尔型 true => 展开 false => 收起 ]
    _expandTargetDir (target, isExpand) {
      if (target && target.level > 0) {
        const parentTarget = target.parent
        parentTarget.expanded = isExpand
        this._expandTargetDir(parentTarget, isExpand)
      }
    },
    // ToDo 区域树 [ 特殊处理 ]
    _regionTreeFilter (dataSource, expandDirTitle) {
      let dataList = JSON.parse(JSON.stringify(dataSource))
      if (dataList.length) {
        let dicProp = 'null'
        const _this = this
        dataList.filter(function f(o, index) {
          if (o.children && o.children.length) {
            dicProp = o.title
            o.isShowLen = !o.children[0].children.length
            const hasProp = _this.regionTreeObj.hasOwnProperty(dicProp)
            o.curDirLen = hasProp ? _this.regionTreeObj[dicProp].size : 0
            if (o.title === expandDirTitle) {
              if (!hasProp) {
                o.children.filter(f, index)
              }
              o.children = hasProp ? [..._this.regionTreeObj[dicProp].values()] : new Array()
              return true
            }
            return (o.children = o.children.filter(f, index)).length
          }
          if (!_this.regionTreeObj.hasOwnProperty(dicProp)) {
            _this.regionTreeObj[dicProp] = new Map()
          }
          const uniqueCode = o.objData[_this.filterCode]
          if (!_this.regionTreeObj[dicProp].has(uniqueCode)) {
            _this.regionTreeObj[dicProp].set(uniqueCode, o)
          }
          if (index === 0) {
            return true
          }
        })
      }
      return dataList
    },
    _rebuildRegionTree (dataSource, expandDirTitle, regionTreeObj) {
      if (JSON.stringify(regionTreeObj) === '{}') {
        return new Array()
      }
      let resultList = JSON.parse(JSON.stringify(dataSource))
      if (resultList.length) {
        resultList.filter(function f(o, index) {
          if (o.children && o.children.length && o.children[0].children.length === 0) {
            o.isShowLen = !o.children[0].children.length
            o.curDirLen = regionTreeObj[o.title].size
            o.children = o.title === expandDirTitle ? [...regionTreeObj[o.title].values()] : o.children.slice(0, 1)
            return true
          }
          return (o.children = o.children.filter(f, index)).length
        })
      }
      return resultList
    },
    // ToDo 类型树
    _initTypeTreeObj (dataSource) {
      let dataList = JSON.parse(JSON.stringify(dataSource))
      let obj = {}
      const MaxLimitValue = 150 // 单个半子节点中 节点最大限制值
      if (dataList.length) {
        let dicProp = 'null'
        let len = -1
        const pageSize = this.pageSize - dataList.length
        const _this = this
        dataList.filter(function f(o, index) {
          if (o.children && o.children.length) {
            if (o.children && o.children.length && !o.children[0].children.length) {
              dicProp = o.title
              len = o.children.length - 1
              obj[o.title] = {
                curPage: 1,
                pageSize: pageSize,
                maxPage: 1,
                isPagination: false,
                dic: new Map()
              }
            }
            return (o.children = o.children.filter(f, index)).length
          }
          o.pageIndex = parseInt(obj[dicProp].dic.size / pageSize) + 1
          obj[dicProp].dic.set(o.objData[_this.filterCode], o)
          if (len === index) {
            const size = obj[dicProp].dic.size
            obj[dicProp].maxPage = size ? parseInt((size - 1) / pageSize) + 1 : 1
            obj[dicProp].isPagination = size > MaxLimitValue
          }
        })
      }
      return obj
    },
    _rebuildTypeTree (dataSource, expandDirTitle, TreeObj) {
      if (JSON.stringify(TreeObj) === '{}') {
        return new Array()
      }
      let resultList = JSON.parse(JSON.stringify(dataSource))
      if (resultList.length) {
        resultList.filter(function f(o) {
          if (o.children && o.children.length && o.children[0].children.length === 0) {
            const target = TreeObj[o.title]
            o.isShowLen = !o.children[0].children.length
            o.curDirLen = target.dic.size
            o.children = o.title === expandDirTitle
              ? target.isPagination
                ? _.chunk([...target.dic.values()], target.pageSize)[target.curPage - 1] : [...target.dic.values()] : o.children.slice(0, 1)
            return true
          }
          return (o.children = o.children.filter(f)).length
        })
      }
      return resultList
    }
  },
  created () {
    // 灯网警状态 初始化
    this.isDWJRequest = (this.qts || this.DWJStatus.join('') !== '000')
    // 初始化
    this.setTreeTerminal([...this.respondMap.keys()][0])
  },
  mounted () {
    // 初始化 regionTreeObj 对象
    this._regionTreeFilter(this.regionTreeData, 'None')
    // 初始化 typeTreeObj 对象
    this.typeTreeObj = this._initTypeTreeObj(this.typeTreeData)
  },
  beforeDestroy () {
    clearInterval(this.writerTimer)
    clearInterval(this.batchesTimer)
    clearInterval(this.scrollTimer)
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  /**/
  #treeContentWrapper {
    width 100%
    font-family '微软雅黑'
    user-select none
  }
  #treeContentWrapper .treeContainer {
    min-height 530px
    width 100%
    overflow auto
    border-bottom 1px solid skyblue
    box-shadow 1px 2px 2px greenyellow
    box-sizing border-box
    -moz-box-sizing border-box
    -webkit-box-sizing border-box
  }
  #treeContentWrapper .el-tree {
    background #eeeeee
    // width 600px
    width 100%
  }
  /* selected */
  #treeContentWrapper .el-tree .el-tree-node__content {
    box-sizing border-box
    -webkit-box-sizing border-box
    -moz-box-sizing border-box
    height 30px
    font-size 16px
    font-family '微软雅黑'
    background #eeeeee
    width 100%
  }

  #treeContentWrapper .el-tree .el-tree-node__content:hover {
    //background-color: #ffcd32
    background-color: #ffcd33
  }

  #treeContentWrapper .el-tree .is-current > .el-tree-node__content {
    background-color: #ffcd32
  }

  #treeContentWrapper .el-tree .el-tree__empty-block {
    text-align center
    position relative
  }
  #treeContentWrapper .el-tree .el-tree__empty-block .el-tree__empty-text {
    margin-left -30%
    font-size 14px !important
    color red
  }
  /* nodes */
  #treeContentWrapper .el-tree .tree-parentNode {
    color: #000000
    font-size 16px
    font-family '微软雅黑'
    font-weight: bold
    width 100%
  }

  #treeContentWrapper .el-tree .tree-childrenNode {
    display inline-block
    width 100%
    // padding-right 2px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
  }

  #treeContentWrapper .el-tree .tree-childrenNode .tree-childrenNode-title {
    display inline-block
    margin-left 4px
    font-size 16px
    font-family '微软雅黑'
    font-weight bold
  }

  #treeContentWrapper .pagination input {
    width 40px
    user-select none
  }

  #treeContentWrapper #treeChecked {
    height 50px
    line-height 30px
    padding 10px 4px
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size 14px
    font-weight bold
    color #222
    font-family '微软雅黑'
    display inline-block
  }
  #treeContentWrapper #treeChecked > span {
    font-size 14px
    font-weight bold
    color #222
    font-family '微软雅黑'
  }
  /* 分页器 */
  #treeContentWrapper #pagination {
    display inline-block
    float right
    height 50px
    padding-right 8px
    box-sizing border-box
    -webkit-box-sizing border-box
    -moz-box-sizing border-box
  }
  #treeContentWrapper #pagination .ivu-page-prev, #treeContentWrapper #pagination .ivu-page-next {
    display none
  }
  #treeContentWrapper #pagination .ivu-page-simple-pager {
    height 48px
    display inline-block
    box-sizing border-box
    -webkit-box-sizing border-box
    -moz-box-sizing border-box
    padding 14px 0
    margin 0
    color #2#00a200
    font-family '微软雅黑'
    font-size 12px
  }
  #treeContentWrapper #pagination .ivu-page-simple-pager input {
    width 44px
    height 20px
    padding 2px 0px
    margin 0
    font-family '微软雅黑'
    font-size 12px
    color #2d8cf0
    user-select none
  }
  #treeContentWrapper #pagination .ivu-page-simple-pager span {
    color #2d8cf0
    font-weight bold
    font-family '微软雅黑'
    font-size 12px
    padding 0 2px
  }
  /**/
</style>
