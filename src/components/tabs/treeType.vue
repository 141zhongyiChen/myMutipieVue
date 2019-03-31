<template>
  <div id="type-wrapper" @contextmenu="showMenu">
    <!-- 类型树 @on-select-change="click_layer" -->
    <Tree :data="dataList" show-checkbox
          @on-check-change="currentChecked"
          empty-text=""
          id="type"
          ref="type"
    >
    </Tree>
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
import { getTreeData } from 'api/getTreeData'
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
          let color = IsUsed(data.objData.isUsed)
          let text = data.title
          let status = this._toBinary(this.DWJStatus, 3) // 灯网警显示标志[返回字符串数组]
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
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              color: color,
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              background: (this.treeTerminal === data.objData.terminalCode ? '#ffcd32' : '')
            },
            on: {
              click: () => {
                let arr = []
                arr[0] = params.data
                this.click_layer(arr)
              },
              mouseover: () => {
                // $(event.currentTarget).parent().attr('id', 'type-hover')
                $(event.currentTarget).attr('id', 'type-hover')
              },
              mouseleave: () => {
                // $(event.currentTarget).parent().removeAttr('id')
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
      currentPageData: []
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'treeTerminal',
      'treeCheckedArr',
      'treeSelectedArr',
      'respondData'
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
    tableTerminal (newVal) {
      this.setTreeTerminal(newVal)
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
      setCheckedArr: 'SET_CHECKED_ARR'
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
      }
      // console.log(this.treeTerminal)
    },
    // todo 选中复选框时触发，默认以数组对象形式返回已勾选节点数组
    currentChecked (checkedArr) {
      // 清除父节点
      let clearDirArr = []
      checkedArr.map((item) => {
        if (item.objData.terminalCode) {
          clearDirArr.push(item)
        }
      })
      let ret = findDifferent(this.treeCheckedArr, this.oldCheckedArr)
      this.setCheckedArr(ret.concat(clearDirArr))
      this.oldCheckedArr = checkedArr
      // console.log(this.treeCheckedArr)
    },
    // 右键菜单事件定义开始
    showMenu () {
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
    },
    selectCurrentHover () { // 勾选当前鼠标移入的终端
      let arr = []
      arr[0] = this.currentHoverData
      this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      this.setCheckedArr(arr)
      this._getTreeData()
    },
    checkedAll (index) { // 勾选所有
      // 数据更新
      let arr = []
      arr[0] = this.currentHoverData
      this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      this.setCheckedArr(this.respondData)
      this._getTreeData()
    },
    quitAll (index) { // 取消所有
      let arr = []
      this.setCheckedArr(arr)
      let ret = []
      ret[0] = this.currentHoverData
      this.setTreeTerminal(ret[0].objData.terminalCode)
      this.setTreeSelected(ret)
      this._getTreeData()
    },
    checkedCurrentDir (index) { // 勾选当前层级
      // 数据更新
      let arr = []
      arr[0] = this.currentHoverData
      this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      // 层级设置
      let ret = this._findDir()
      ret = unique(ret.concat(this.treeCheckedArr))
      this.setCheckedArr(ret)
      this._getTreeData()
    },
    quitCurrentDir (index) { // 取消勾选当前层级
      let arr = []
      arr[0] = this.currentHoverData
      this.setTreeTerminal(arr[0].objData.terminalCode)
      this.setTreeSelected(arr)
      // 层级设置
      let ret = this._findDir()
      ret = findDifferent(this.treeCheckedArr, ret)
      this.setCheckedArr(ret)
      this._getTreeData()
    },
    // 右键事件结束结束
    _getTreeData () {
      // 开发环境下，depCode 默认为：003000000000000000000007
      if (process.env.NODE_ENV === 'development') {
        getTreeData().then((res) => {
          let { lightingTypeTreeData } = JSON.parse(res)
          // 为当前对象每一项数据，添加render函数
          lightingTypeTreeData.map((lItem) => {
            // 为父节点添加 render 函数
            lItem.render = this.ParentRender.render
            lItem.expand = true
            // 为子节点添加 render 函数
            if (lItem.children.length > 0) {
              lItem.children.map((cItem) => {
                cItem.render = this.ChildRender.render
              })
            }
          })
          this.currentPageData = lightingTypeTreeData
          // checkedArr监测,需要在创建时更新数据
          let checkedArr = this.treeCheckedArr
          if (checkedArr.length > 0) {
            this.dataList = InitCheckedArr(lightingTypeTreeData, checkedArr)
            // 初始化勾选数组
            this.dataList.map((dItem) => {
              dItem.children.map((cItem) => {
                if (cItem.checked === true) {
                  // 缓存初始化勾选记录
                  this.oldCheckedArr.push(cItem)
                }
              })
            })
            // console.log(this.oldCheckedArr)
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
          getTreeData(data).then((res) => {
            let { lightingTypeTreeData } = JSON.parse(res)
            // 为当前对象每一项数据，添加render函数
            lightingTypeTreeData.map((lItem) => {
              // 为父节点添加 render 函数
              lItem.render = this.ParentRender.render
              lItem.expand = true
              // 为子节点添加 render 函数
              if (lItem.children.length > 0) {
                lItem.children.map((cItem) => {
                  cItem.render = this.ChildRender.render
                })
              }
            })
            this.currentPageData = lightingTypeTreeData
            // checkedArr监测,需要在创建时更新数据
            let checkedArr = this.treeCheckedArr
            if (checkedArr.length > 0) {
              this.dataList = InitCheckedArr(lightingTypeTreeData, checkedArr)
              // 初始化勾选数组
              this.dataList.map((dItem) => {
                dItem.children.map((cItem) => {
                  if (cItem.checked === true) {
                    // 缓存初始化勾选记录
                    this.oldCheckedArr.push(cItem)
                  }
                })
              })
              // console.log(this.oldCheckedArr)
            } else {
              this.dataList = lightingTypeTreeData
            }
          })
        } else {
          this.dataList = []
        }
      }
    },
    _findDir () {
      let dirCount = 0
      this.currentPageData.map((pItem, index) => {
        if (pItem.children.length > 0) {
          pItem.children.map((cItem) => {
            if (cItem.objData.terminalCode === this.currentHoverData.objData.terminalCode) {
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
        // console.log(JSON.parse(res))
        this.setDWJRespond(JSON.parse(res))
      })
    }
    // todo : DWJ event end
  },
  created () {
    this._getTreeData()
    // 获取当前链接地址的 status、qts 参数
    this._initDWJ()
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
  #type-hover {
    background #ffcd32
  }
  #type-wrapper {
    width: 100%;
    height: 100%;
    overflow: scroll;
    text-overflow:ellipsis;
    whitewhite-space: nowrap;
  }
  #type-wrapper .ivu-tree ul {
    list-style: none
    margin: 0
    padding: 0
    font-size: 18px
  }

  #type-wrapper .ivu-tree ul li {
    list-style: none
    margin: 4px 0
    padding: 0
    white-space: nowrap
    outline: 0
  }

  #type-wrapper .ivu-tree li ul {
    margin: 0
    padding: 0 0 0 18px
  }

  #type-wrapper .ivu-tree-title {
    display: inline-block
    margin: 0;
    border-radius: 3px;
    color: $color-text-g
    cursor: pointer;
    vertical-align: top;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out
  }

  #type-wrapper .ivu-tree .ivu-tree-children .ivu-tree-title:hover {
    background-color: #ffcd32
  }

  #type-wrapper .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
  // background-color: inherit
    background-color: #ffcd32
  }
</style>
