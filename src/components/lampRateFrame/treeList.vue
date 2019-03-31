<template>
  <div id="treeWrapper" @contextmenu="showMenu">
    <!-- List tree -->
    <Tree :data="dataList" show-checkbox
          @on-check-change="currentChecked"
          ref="tree"
          empty-text=""
          v-if="isShowCheckedBox">
    </Tree>
    <Tree :data="dataList" ref="tree"
          @on-check-change="currentChecked"
          empty-text=""
          v-else>
    </Tree>
    <!-- context-menu begin -->
    <vue-context-menu
      :contextMenuData="contextMenuData"
      @checkedCurrentHover="selectCurrentHover"
      @checkedAll="checkedAll"
      @quitAll="quitAll"
      @checkedCurrentDir="checkedCurrentDir"
      @quitCurrentDir="quitCurrentDir">
    </vue-context-menu>
    <!-- context-menu end -->
  </div>
</template>
<script>
import { findDifferent } from 'common/js/checkedOptions.js'
import { mapGetters, mapMutations } from 'vuex'
import { getDataOfLampRate, getCheckBoxFlag } from 'api/getDataOfLampRate'
import { IsUsed } from 'common/js/tableStyle'
import { unique } from 'common/js/getUniqueData'
import { getUrlParams } from 'common/js/getUrlParams'
import { TIME_INTERVAL } from 'common/js/config'
import VueContextMenu from 'base/contextmenu/VueContextMenu'
import { getDWJInfo } from 'api/getDWJInfo'
export default {
  data () {
    return {
      dataList: [],
      // render function
      render: {
        render: (h, params) => {
          let data = params.data
          let color = IsUsed(true)
          let text = data.title
          let status = this._toBinary(this.DWJStatus, 3) // 灯网警显示标志
          let DWJStyle = {
            isOpenLamp: false,
            isOnLine: false,
            isAlarm: false
          }
          if (this.dwjRespond.length > 0) {
            let respondArr = this.dwjRespond
            respondArr.map((rItem) => {
              if (rItem.terminalCode === data.objData.terminalCode) {
                DWJStyle = rItem
              }
            })
          }
          // 构造响应条件
          let bgFilter = this.treeRunningCode
          let filter = this.filterCode
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              color: color,
              cursor: 'pointer',
              background: (bgFilter === data.objData[filter] ? '#ffcd32' : '')
            },
            on: {
              click: () => {
                let arr = []
                arr[0] = params.data
                this.click_layer(arr)
              },
              mouseover: () => {
                $(event.currentTarget).attr('id', 'list-hover')
              },
              mouseleave: () => {
                $(event.currentTarget).removeAttr('id')
              },
              mousedown: () => {
                this.currentHoverData = params.data
              }
            }
          }, [
            h('span', {
              style: {
                display: (status.charAt(0) === '1' ? 'inline-block' : 'none'),
                padding: '1px',
                border: '1px solid green',
                color: (DWJStyle.isOpenLamp ? 'red' : 'green'),
                fontWeight: 'bold'
              }
            }, '灯'),
            h('span', {
              style: {
                display: (status.charAt(1) === '1' ? 'inline-block' : 'none'),
                padding: '1px',
                border: '1px solid green',
                color: (DWJStyle.isOnLine ? 'green' : 'red'),
                fontWeight: 'bold'
              }
            }, '网'),
            h('span', {
              style: {
                display: (status.charAt(2) === '1' ? 'inline-block' : 'none'),
                padding: '1px',
                border: '1px solid green',
                color: (DWJStyle.isAlarm ? 'red' : 'green'),
                fontWeight: 'bold'
              }
            }, '警'),
            h('span', {
              style: {
                marginLeft: '4px'
              }
            }, text)
          ])
        }
      },
      // Record the checked array when the page has created, also upData the current checked array
      oldCheckedArr: [],
      // context-menu
      contextMenuData: {
        // context's name, global
        menuName: 'treeList',
        // context position
        axios: {
          x: null,
          y: null
        },
        // context menu options
        menulists: [
          {
            fnHandler: 'checkedCurrentHover',
            icoName: 'el-icon-more',
            btnName: '勾选当前终端',
            flag: true
          },
          {
            fnHandler: 'checkedAll',
            icoName: 'el-icon-more',
            btnName: '勾选所有终端',
            flag: true
          },
          {
            fnHandler: 'quitAll',
            icoName: 'el-icon-more',
            btnName: '取消勾选所有终端',
            flag: false
          },
          {
            fnHandler: 'checkedCurrentDir',
            icoName: 'el-icon-more',
            btnName: '勾选当前层级所有终端',
            flag: true
          },
          {
            fnHandler: 'quitCurrentDir',
            icoName: 'el-icon-more',
            btnName: '取消勾选当前层级所有终端',
            flag: true
          }
        ]
      },
      currentHoverData: {},
      currentPageData: [],
      // isShowCheckedBox
      isShowCheckedBox: true,
      filterCode: 'runningCode'
    }
  },
  components: {
    VueContextMenu
  },
  computed: {
    ...mapGetters('treeModule', [
      'treeTerminal',
      'treeCheckedArr',
      'treeSelectedArr',
      'respondData',
      'treeRunningCode'
    ]),
    ...mapGetters('tableModule', [
      'tableTerminal'
    ]),
    ...mapGetters('dwjModule', [
      'DWJStatus',
      'qts',
      'dwjRespond'
    ])
  },
  watch: {
    dataList: {
      handler (newVal) {
        return newVal
      },
      deep: true
    },
    dwjRespond: {
      handler (newVal) {
        return newVal
      },
      deep: true
    },
    tableTerminal (newVal) {
      this.setTreeTerminal(newVal)
    },
    'contextMenuData.menulists': {
      handler: function (newVal) {
        return newVal
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL',
      setTreeSelected: 'SET_TREE_SELECTED',
      setCheckedArr: 'SET_CHECKED_ARR',
      setRunningCode: 'SET_RUNNING_CODE'
    }),
    ...mapMutations('tableModule', {
      setTableTerminal: 'SET_TABLE_TERMINAL'
    }),
    ...mapMutations('dwjModule', {
      setStatus: 'SET_DWJ_STATUS',
      setQTS: 'SET_QTS',
      setDWJRespond: 'SET_DWJ_RESPOND'
    }),

    // return a selected array while text is being clicked
    click_layer (data) {
      this.setTreeSelected(data)
      if (data.length > 0) {
        this.setTreeTerminal(data[0].objData.terminalCode)
        this.setRunningCode(data[0].objData.runningCode)
      }
    },

    // return a checked array while checked-box is being clicked
    currentChecked (checkedArr) {
      // Clear last checked record
      let ret = findDifferent(this.treeCheckedArr, this.oldCheckedArr, this.filterCode)
      // Add the checked record
      this.setCheckedArr(ret.concat(checkedArr))
      this.oldCheckedArr = checkedArr
    },

    // todo : contextmenu event begin
    showMenu () {
      if (this.isShowCheckedBox) {
        event.preventDefault()
        event.cancelBubble = true // prevent bubble
        var x = event.clientX + 6
        var y = event.clientY
        // Set the position of context-menu
        this.contextMenuData.axios = {
          x, y
        }
        // Init the context-menu's style before appearing
        if (this.treeCheckedArr.length === this.respondData.length) {
          this.contextMenuData.menulists[1].flag = false // checked-all
          this.contextMenuData.menulists[2].flag = true // quit-all
        } else {
          this.contextMenuData.menulists[1].flag = true
          this.contextMenuData.menulists[2].flag = false
        }
        let ret = this.currentPageData
        if (this._computedChecked(ret) === ret.length) {
          this.contextMenuData.menulists[3].flag = false // checked current dir
        } else {
          this.contextMenuData.menulists[3].flag = true
        }
        if (this._computedChecked(ret) === 0) {
          this.contextMenuData.menulists[4].flag = false // quit current dir
        } else {
          this.contextMenuData.menulists[4].flag = true
        }
      }
    },
    selectCurrentHover () { // checked current mouseover
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      this.setCheckedArr(arr)
      this._getTreeData()
      // this._upDateDataList()
    },
    checkedAll (index) { // checked all
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      this.setCheckedArr(this.respondData)
      this._getTreeData()
      // this._upDateDataList()
    },
    quitAll (index) { // quit all
      let arr = []
      this.setCheckedArr(arr)
      let ret = []
      ret[0] = this.currentHoverData
      this.setRunningCode(ret[0].objData.runningCode)
      this.setTreeTerminal(ret[0].objData.terminalCode)
      // this.setTreeTerminal(ret[0].objData.terminalCode)
      this.setTreeSelected(ret)
      this._getTreeData()
      // this._upDateDataList()
    },
    checkedCurrentDir (index) { // checked current dir
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      let ret = unique(this.treeCheckedArr.concat(this.currentPageData))
      this.setCheckedArr(ret)
      this._getTreeData()
      // this._upDateDataList()
    },
    quitCurrentDir (index) { // quit current dir
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      // this.setTreeTerminal(arr[0].objData.terminalCode) // 设置选中终端
      this.setTreeSelected(arr)
      this.setCheckedArr(findDifferent(this.treeCheckedArr, this.currentPageData, this.filterCode))
      this._getTreeData()
      // this._upDateDataList()
    },
    _computedChecked (dirArr) {
      let count = 0
      dirArr.map((cItem) => {
        if (cItem.checked === true) {
          count++
        }
      })
      return count
    },
    // todo : contextmenu event end

    // request original data
    _getTreeData () {
      if (process.env.NODE_ENV === 'development') {
        getDataOfLampRate().then((res) => {
          let { listTreeData } = JSON.parse(res)
          // add render function for each item
          listTreeData.map((item) => {
            item.render = this.render.render
          })
          // record currentPageData
          this.currentPageData = listTreeData
          this.dataList = listTreeData

          // 勾选框初始化
          let checkedArr = this.treeCheckedArr
          if (checkedArr.length > 0) {
            this.dataList.map((item) => {
              checkedArr.map((checkedItem) => {
                if (item.objData[this.filterCode] === checkedItem.objData[this.filterCode]) {
                  item.checked = true
                  // record the original checked array
                  this.oldCheckedArr.push(item)
                }
              })
            })
          }
        })
      } else {
        let { DepCode, userCode, UFCode } = getUrlParams(window.location.href)
        if (DepCode !== undefined && userCode !== undefined && UFCode !== undefined) {
          let data = {
            depCode: DepCode
          }
          getDataOfLampRate(data).then((res) => {
            let { listTreeData } = JSON.parse(res)
            // add render function for each item
            listTreeData.map((item) => {
              item.render = this.render.render
            })
            // record currentPageData
            this.currentPageData = listTreeData
            this.dataList = listTreeData

            // 勾选框初始化
            let checkedArr = this.treeCheckedArr
            if (checkedArr.length > 0) {
              this.dataList.map((item) => {
                checkedArr.map((checkedItem) => {
                  if (item.objData[this.filterCode] === checkedItem.objData[this.filterCode]) {
                    item.checked = true
                    // record the original checked array
                    this.oldCheckedArr.push(item)
                  }
                })
              })
            }
          })
        } else {
          this.dataList = []
        }
      }
    },

    // todo : DWJ event begin
    _initDWJ () {
      let { qts, status } = getUrlParams(window.location.href) // DWJ show flag
      if (qts === 'y') {
        this.setQTS(true)
      }
      let ret = /^[1-7]$/
      if (ret.test(status)) {
        this.setStatus(parseInt(status))
      } else {
        this.setStatus(0)
      }
    },
    // converts decimal into binary
    _toBinary (num, Bits = 3) {
      let resArry = []
      let xresArry = []
      let i = 0
      for (; num > 0;) {
        resArry.push(num % 2)
        num = parseInt(num / 2)
        i++
      }
      for (let j = i - 1; j >= 0; j--) {
        xresArry.push(resArry[j])
      }
      if (Bits) {
        for (let r = xresArry.length; r < Bits; r++) {
          xresArry.unshift(0)
        }
      }
      return xresArry.join().replace(/,/g, '')
    },
    _upDateDWJ () {
      let codes = new Array()
      for (let i = 0; i < this.respondData.length; i++) {
        let { objData: { terminalCode } } = this.respondData[i]
        codes.push(terminalCode)
      }
      let data = {
        active: 'TreeStatus.GetTerminalsSimpleStatus',
        request: JSON.stringify({
          TerminalCodes: codes,
          TreeTypeCode: 0
        })
      }
      // 数据访问
      getDWJInfo(data).then(res => {
        this.setDWJRespond(JSON.parse(res))
      })
    },
    // todo : DWJ event end
    // 判断 是否显示 勾选框
    _initCheckBoxFlag () {
      let _this = this
      let { UFCode } = getUrlParams(window.location.href)
      if (UFCode !== undefined) {
        let data = {
          active: 'CheckBoxOfElectricEnergy.GetCheckBoxInfo',
          UFCode: UFCode
          // filterCode: UFCode
        }
        getCheckBoxFlag(data).then(res => {
          console.log(res)
          let showFlag = JSON.parse(res).showFlag
          switch (showFlag) {
            case 'Y':
              _this.isShowCheckedBox = false
              break
            default:
              _this.isShowCheckedBox = true
          }
        })
      }
    }
  },
  created () {
    this._getTreeData()
    // 获取当前链接地址的 status、qts 参数
    this._initDWJ()
    // 获取 勾选框 显示状态表示
    this._initCheckBoxFlag()
  },
  mounted () {
    let _this = this
    setTimeout(() => {
      if (this.DWJStatus > 0 || this.qts === true) {
        _this.timer = window.setInterval(() => {
          _this._upDateDWJ()
        }, TIME_INTERVAL)
      }
    }, 2000)
  },
  beforeDestroy () {
    window.clearInterval(this.timer)
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  /* treeWrapper style */
  #treeWrapper {
    height 100%
    width 100%
    overflow scroll
    text-overflow ellipsis
    whitewhite-space nowrap
  }
  #treeWrapper .ivu-tree ul {
    list-style: none
    margin: 0
    padding: 0
    font-size: 18px
  }

  #treeWrapper .ivu-tree ul li {
    list-style: none
    margin: 4px 0
    padding: 0
    white-space: nowrap
    outline: 0
  }

 /* #treeWrapper .ivu-tree ul li:hover {
    background-color: #ffcd32
  } */
  #treeWrapper .ivu-tree li ul {
    margin: 0
    padding: 0 0 0 18px
  }

  #treeWrapper .ivu-tree-title {
    display: inline-block
    margin: 0;
    border-radius: 3px;
    color: $color-text-g
    cursor: pointer;
    vertical-align: top;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out
  }

  #treeWrapper .ivu-tree .ivu-tree-children .ivu-tree-title:hover {
    background-color: #ffcd32
  }

  #treeWrapper .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
     // background-color: inherit
     background-color: #ffcd32
  }
  #list-hover {
    background-color: #ffcd32
  }
</style>
