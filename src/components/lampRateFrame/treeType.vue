<template>
  <div id="type-wrapper" @contextmenu="showMenu">
    <!-- 区域树 -->
    <div ref="area">
      <Tree :data="dataList" show-checkbox
            @on-check-change="currentChecked"
            empty-text=""
            v-if="isShowCheckedBox">
      </Tree>
      <Tree :data="dataList"
            @on-check-change="currentChecked"
            empty-text=""
            v-else>
      </Tree>
    </div>
    <vue-context-menu
      :contextMenuData="contextMenuData"
      @checkedCurrentHover="selectCurrentHover"
      @checkedAll="checkedAll"
      @quitAll="quitAll"
      @checkedCurrentDir="checkedCurrentDir"
      @quitCurrentDir="quitCurrentDir"
    >
    </vue-context-menu>
  </div>
</template>
<script type='text/ecmascript-6'>
import VueContextMenu from 'base/contextmenu/VueContextMenu'
import { InitCheckedArr, findDifferent } from 'common/js/checkedOptions'
import { mapGetters, mapMutations } from 'vuex'
import { getDataOfLampRate, getCheckBoxFlag } from 'api/getDataOfLampRate'
import { getDWJInfo } from 'api/getDWJInfo'
import { IsUsed } from 'common/js/tableStyle'
import { unique } from 'common/js/getUniqueData'
import { getUrlParams } from 'common/js/getUrlParams'
import { TIME_INTERVAL } from 'common/js/config'
export default {
  components: {
    VueContextMenu
  },
  data () {
    return {
      dataList: [],
      // render 函数
      ParentRender: {
        render: (h, params) => {
          let data = params.data
          let text = data.title
          if (data.children.length > 0) {
            text += ' [ ' + data.children.length + ' ] '
          }
          return h('span', {
            style: {
              color: 'black',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          }, text)
        }
      },
      ChildRender: {
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
          // 构造选中背景，响应条件
          let bgFilter = this.treeRunningCode
          let filter = this.filterCode
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              color: color,
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              background: (bgFilter === data.objData[filter] ? '#ffcd32' : '')
            },
            on: {
              click: () => {
                let arr = []
                arr[0] = params.data
                this.click_layer(arr)
              },
              mouseover: () => {
                $(event.currentTarget).attr('id', 'area-hover')
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
                padding: '1px 2px',
                border: '1px solid green',
                color: (DWJStyle.isOpenLamp ? 'red' : 'green'),
                fontWeight: 'bold'
              }
            }, '灯'),
            h('span', {
              style: {
                display: (status.charAt(1) === '1' ? 'inline-block' : 'none'),
                padding: '1px 2px',
                border: '1px solid green',
                color: (DWJStyle.isOnLine ? 'green' : 'red'),
                fontWeight: 'bold'
              }
            }, '网'),
            h('span', {
              style: {
                display: (status.charAt(2) === '1' ? 'inline-block' : 'none'),
                padding: '1px 2px',
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
      oldCheckedArr: [],
      // 右键菜单
      contextMenuData: {
        // 菜单名称，全局唯一
        menuName: 'treeList',
        // 菜单位置
        axios: {
          x: null,
          y: null
        },
        // 菜单选项
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
      //
      filterCode: 'runningCode'
    }
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
    // todo 选中树节点时触发，默认以数组对象形式返回已选中节点数组
    click_layer (data) {
      this.setTreeSelected(data)
      if (data.length > 0) {
        this.setTreeTerminal(data[0].objData.terminalCode)
        this.setRunningCode(data[0].objData.runningCode)
      }
    },
    // todo 选中复选框时触发，默认以数组对象形式返回已勾选节点数组
    currentChecked (checkedArr) {
      // 清除父节点
      let clearDirArr = []
      checkedArr.map((item) => {
        if (item.objData[this.filterCode]) {
          clearDirArr.push(item)
        }
      })
      let ret = findDifferent(this.treeCheckedArr, this.oldCheckedArr, this.filterCode)
      this.setCheckedArr(ret.concat(clearDirArr))
      this.oldCheckedArr = checkedArr
    },
    // 右键菜单事件定义开始
    showMenu () {
      if (this.isShowCheckedBox) {
        event.preventDefault()
        event.cancelBubble = true // 阻止冒泡
        var x = event.clientX + 6
        var y = event.clientY
        // Get the current location
        this.contextMenuData.axios = {
          x, y
        }
        // Init the contextmenu style
        if (this.treeCheckedArr.length === this.respondData.length) {
          this.contextMenuData.menulists[1].flag = false // 全选
          this.contextMenuData.menulists[2].flag = true // 反选
        } else {
          this.contextMenuData.menulists[1].flag = true
          this.contextMenuData.menulists[2].flag = false
        }
        let ret = this._findDir()
        if (this._computedChecked(ret) === ret.length) {
          this.contextMenuData.menulists[3].flag = false // 勾选当前层级
        } else {
          this.contextMenuData.menulists[3].flag = true
        }
        if (this._computedChecked(ret) === 0) {
          this.contextMenuData.menulists[4].flag = false // 取消当前层级
        } else {
          this.contextMenuData.menulists[4].flag = true
        }
      }
    },
    selectCurrentHover () { // 勾选当前鼠标移入的终端
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      // this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      this.setCheckedArr(arr)
      this._getTreeData()
      // this._upDateDataList()
    },
    checkedAll (index) { // 勾选所有
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      // this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      this.setCheckedArr(this.respondData)
      this._getTreeData()
      // this._upDateDataList()
    },
    quitAll (index) { // 取消所有
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
    checkedCurrentDir (index) { // 勾选当前层级
      // 数据更新
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      // this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      // 层级设置
      let ret = this._findDir()
      ret = unique(ret.concat(this.treeCheckedArr))
      this.setCheckedArr(ret)
      this._getTreeData()
      // this._upDateDataList()
    },
    quitCurrentDir (index) { // 取消勾选当前层级
      let arr = []
      arr[0] = this.currentHoverData
      this.setRunningCode(arr[0].objData.runningCode)
      this.setTreeTerminal(arr[0].objData.terminalCode)
      // this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      // 层级设置
      let ret = this._findDir()
      ret = findDifferent(this.treeCheckedArr, ret, this.filterCode)
      this.setCheckedArr(ret)
      this._getTreeData()
      // this._upDateDataList()
    },
    // 查找当前层级，并返回层级中所有数据
    _findDir () {
      let dirCount = 0
      this.currentPageData.map((pItem, index) => {
        if (pItem.children.length > 0) {
          pItem.children.map((cItem) => {
            if (cItem.objData[this.filterCode] === this.currentHoverData.objData[this.filterCode]) {
              dirCount = index
            }
          })
        }
      })
      let ret = this.currentPageData[dirCount].children
      return ret // 返回层级数据
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
    _upDateDataList () {
      let ret = this.dataList
      let arr = this.treeCheckedArr
      if (arr.length === 0) {
        ret.map((rItem) => {
          if (rItem.children.length > 0) {
            rItem.children.map((cItem) => {
              cItem.checked = false
            })
          } else {
            rItem.checked = false
          }
        })
      } else {
        ret.map((rItem) => {
          if (rItem.children.length > 0) {
            rItem.children.map((cItem) => {
              let flag = false
              arr.map((aItem) => {
                if (cItem.objData.terminalCode === aItem.objData.terminalCode) {
                  flag = true
                }
              })
              if (flag === true) {
                cItem.checked = true
              } else {
                cItem.checked = false
              }
            })
          } else {
            let flag = false
            arr.map((aItem) => {
              if (rItem.objData.terminalCode === aItem.objData.terminalCode) {
                flag = true
              }
            })
            if (flag === true) {
              rItem.checked = true
            } else {
              rItem.checked = false
            }
          }
        })
      }
      this.dataList = ret
    },
    // 右键事件结束结束
    _getTreeData () {
      if (process.env.NODE_ENV === 'development') {
        getDataOfLampRate().then((res) => {
          let { lightingTypeTreeData } = JSON.parse(res)
          // 为当前对象每一项数据，添加render函数
          lightingTypeTreeData.map((rItem) => {
            // 为父节点添加 render 函数
            rItem.render = this.ParentRender.render
            rItem.expand = true
            // 为子节点添加 render 函数
            if (rItem.children.length > 0) {
              rItem.children.map((cItem) => {
                cItem.render = this.ChildRender.render
              })
            }
          })
          this.currentPageData = lightingTypeTreeData
          // checkedArr监测,需要在创建时更新数据
          let checkedArr = this.treeCheckedArr
          if (checkedArr.length > 0) {
            this.dataList = InitCheckedArr(lightingTypeTreeData, checkedArr, this.filterCode)
            this.dataList.map((dItem) => {
              dItem.children.map((cItem) => {
                if (cItem.checked === true) {
                  // 缓存初始化勾选记录
                  this.oldCheckedArr.push(cItem)
                }
              })
            })
          } else {
            this.dataList = lightingTypeTreeData
          }
        })
      } else {
        let { DepCode, userCode, UFCode } = getUrlParams(window.location.href)
        if (DepCode !== undefined && userCode !== undefined && UFCode !== undefined) {
          let data = {
            depCode: DepCode
          }
          getDataOfLampRate(data).then((res) => {
            let { lightingTypeTreeData } = JSON.parse(res)
            // 为当前对象每一项数据，添加render函数
            lightingTypeTreeData.map((rItem) => {
              // 为父节点添加 render 函数
              rItem.render = this.ParentRender.render
              rItem.expand = true
              // 为子节点添加 render 函数
              if (rItem.children.length > 0) {
                rItem.children.map((cItem) => {
                  cItem.render = this.ChildRender.render
                })
              }
            })
            this.currentPageData = lightingTypeTreeData
            // checkedArr监测,需要在创建时更新数据
            let checkedArr = this.treeCheckedArr
            if (checkedArr.length > 0) {
              this.dataList = InitCheckedArr(lightingTypeTreeData, checkedArr, this.filterCode)
              this.dataList.map((dItem) => {
                dItem.children.map((cItem) => {
                  if (cItem.checked === true) {
                    // 缓存初始化勾选记录
                    this.oldCheckedArr.push(cItem)
                  }
                })
              })
            } else {
              this.dataList = lightingTypeTreeData
            }
          })
        } else {
          this.dataList = []
        }
      }
    },
    // todo : DWJ event begin
    _initDWJ () {
      let { qts, status } = getUrlParams(window.location.href)
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
      // 构造访问参数
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
          // filterCode: UFCode ( 057200000000000000000005 && 057200000000000000000003 )
        }
        getCheckBoxFlag(data).then(res => {
          // console.log(res)
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
    // 获取树列表基础数据
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
  beforeDestory () {
    window.clearInterval(this.timer)
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  #type-wrapper {
    height 100%
    width 100%
    overflow scroll
    text-overflow ellipsis
    whitewhite-space nowrap
  }

  #area-hover {
    background #ffcd32
  }
</style>
