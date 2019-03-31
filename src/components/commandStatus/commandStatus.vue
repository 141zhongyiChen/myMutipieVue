<template>
  <div id="command-wrapper">
    <!-- query By System -->
    <div class="tabs-wrapper">
      <span>
        <i-switch :value="switchFlagBySystem" @on-change="toggleSystemFlag">
          <Icon style="color: cyan" type="android-done" slot="open"></Icon>
          <Icon style="color: red" type="android-close" slot="close"></Icon>
        </i-switch>
      </span>
      <span class="tabs-title" style="color: #1f86c2">后台主动发起</span>
      <div class="checkbox-wrapper">
        <Checkbox v-model="usersChecked" size="large" :disabled="!switchFlagBySystem">
          <span class="checkbox-title" :class="usersChecked === true ? 'active' : 'negative'">人工</span>
        </Checkbox>
        <Checkbox v-model="systemChecked" size="large" :disabled="!switchFlagBySystem">
          <span class="checkbox-title" :class="systemChecked === true ? 'active' : 'negative'">系统</span>
        </Checkbox>
      </div>
    </div>
    <!-- query By Users -->
    <div class="tabs-wrapper">
      <span>
        <i-switch :value="switchFlagByUsers" @on-change="toggleUsersFlag">
          <Icon style="color: cyan" type="android-done" slot="open"></Icon>
          <Icon style="color: red" type="android-close" slot="close"></Icon>
        </i-switch>
      </span>
      <span class="tabs-title" style="color: mediumseagreen">终端主动发起</span>
      <div class="checkbox-wrapper">
        <Checkbox v-model="upLoadChecked" size="large" :disabled="!switchFlagByUsers">
          <span class="checkbox-title" :class="upLoadChecked === true ? 'active' : 'negative'">上传</span>
        </Checkbox>
        <Checkbox v-model="submitChecked" size="large" :disabled="!switchFlagByUsers">
          <span class="checkbox-title" :class="submitChecked === true ? 'active' : 'negative'">确认</span>
        </Checkbox>
      </div>
    </div>
    <div class="time-wrapper">
      <span>{{ currentTime }}</span>
    </div>
    <div class="command-grid-wrapper" @contextmenu="showMenu" ref="commandGrid">
      <!-- height="630" -->
      <Table class="table" :height="fullHeight" border :columns="columnsInfo"
             no-data-text="" :data="dataList" @on-row-click="onRowClick">
      </Table>
      <confirm :text="confirmText" v-show="isConfirm" @cancel="cancel" @confirm="confirm"></confirm>
    </div>
    <vue-context-menu
      :contextMenuData="contextMenuData"
      @removeAllCommands="removeAllCommands"
      @removeSelectedCommand="removeSelectedCommand"
      @removeSuccessCommands="removeSuccessCommands"
      @removeFailCommands="removeFailCommands"
      @resendAllFialCommands="resendAllFialCommands">
    </vue-context-menu>
  </div>
</template>
<script type='text/ecmascript-6'>
import { getCommandStatus } from 'api/getCommandStatus'
import { formatDateTime, standardDateTime } from 'common/js/formatDateTime'
import { mapGetters } from 'vuex'
import VueContextMenu from 'base/contextmenu/VueContextMenu'
import confirm from 'base/confirm/confirm'
export default {
  components: {
    VueContextMenu,
    confirm
  },
  data () {
    return {
      // grid inti height
      fullHeight: 500,
      // switch flag, default true
      switchFlagBySystem: true, // 系统发起
      switchFlagByUsers: false, // 终端发起
      // checked-box flag
      usersChecked: true, // 人工
      systemChecked: true, // 系统
      upLoadChecked: false, // 上传
      submitChecked: false, // 确认
      // timer
      currentTime: null, // 当前时间
      queryTime: null, // 访问时间
      // grid
      dataList: [],
      columnsInfo: [
        {
          title: '指令状态',
          key: 'status',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h('img', {
              attrs: {
                width: '36px',
                height: '36px',
                src: this.imgMap[row.status]
              }
            })
          }
        },
        {
          title: '控制箱名称',
          align: 'center',
          key: 'terminalName',
          width: 200
        },
        {
          title: '指令名称',
          key: 'commandName',
          width: 400,
          align: 'center'
        },
        {
          title: '发送或接收时间',
          key: 'sendReceiveTime',
          width: 200,
          align: 'center'
        },
        {
          title: '执行时间',
          key: 'executionTime',
          width: 200,
          align: 'center'
        },
        {
          title: '方向',
          key: 'direction',
          align: 'center',
          width: 100
        },
        {
          title: '机构',
          key: 'department',
          align: 'center',
          width: 100
        },
        {
          title: '人员',
          key: 'operator',
          align: 'center',
          width: 100
        },
        {
          title: '控制箱编号',
          key: 'mainCode',
          align: 'center',
          width: 200
        }
      ],
      imgMap: {
        'Y': require('./images/Y.png'),
        'N': require('./images/N.png'),
        'C': require('./images/C.png'),
        'S': require('./images/S.png')
      },
      removeSequence: null,
      // contextMenu
      contextMenuData: {
        // context's name, global
        menuName: 'commandStatus',
        // context position
        axios: {
          x: null,
          y: null
        },
        // context menu options
        menulists: [
          {
            fnHandler: 'removeAllCommands',
            icoName: 'el-icon-more',
            btnName: '移除界面上所有指令',
            flag: true
          },
          {
            fnHandler: 'removeSelectedCommand',
            icoName: 'el-icon-more',
            btnName: '移除选中的指令',
            flag: true
          },
          {
            fnHandler: 'removeSuccessCommands',
            icoName: 'el-icon-more',
            btnName: '移除所有发送成功的指令',
            flag: true
          },
          {
            fnHandler: 'removeFailCommands',
            icoName: 'el-icon-more',
            btnName: '移除所有发送失败的指令',
            flag: true
          },
          {
            fnHandler: 'resendAllFialCommands',
            icoName: 'el-icon-more',
            btnName: '重发所有发送失败的人工指令',
            flag: true
          }
        ]
      },
      // confirm
      isConfirm: false,
      confirmText: '确认要执行此操作吗'
    }
  },
  watch: {
    // switch flag
    switchFlagBySystem (newVal) {
      this.dataList = []
    },
    switchFlagByUsers (newVal) {
      this.dataList = []
    },
    // Launch by system , watch system flag
    usersChecked (newVal) {
      if (newVal === false && this.systemChecked === false) {
        this.switchFlagBySystem = false
      }
      this.dataList = []
    },
    systemChecked (newVal) {
      if (newVal === false && this.usersChecked === false) {
        this.switchFlagBySystem = false
      }
      this.dataList = []
    },
    // Launch by users , watch users flag
    upLoadChecked (newVal) {
      if (newVal === false && this.submitChecked === false) {
        this.switchFlagByUsers = false
      }
      this.dataList = []
    },
    submitChecked (newVal) {
      if (newVal === false && this.upLoadChecked === false) {
        this.switchFlagByUsers = false
      }
      this.dataList = []
    },
    respondData () {
      this.autoRequest()
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'respondData'
    ])
  },
  methods: {
    // todo 监听浏览器窗口变化 begin
    onResize () {
      let _this = this
      window.addEventListener('resize', _this.handleResize)
    },
    handleResize (event) {
      this.fullHeight = document.documentElement.clientHeight * 80 / 100
    },
    // todo 监听浏览器变化 end
    toggleSystemFlag (flag) {
      this.switchFlagBySystem = flag
      // console.log(flag)
      if (this.usersChecked === false && this.systemChecked === false) {
        this.usersChecked = true
        this.systemChecked = true
      }
    },
    toggleUsersFlag (flag) {
      this.switchFlagByUsers = flag
      if (this.upLoadChecked === false && this.submitChecked === false) {
        this.upLoadChecked = true
        this.submitChecked = true
      }
    },
    // 构造所需数据
    constructData (dataMap, resData) {
      let filters = []
      dataMap.map((mItem) => {
        resData.map((rItem) => {
          if (rItem.mainCode === mItem.objData.terminalCode) {
            rItem.terminalName = mItem.title
            filters.push(rItem)
          }
        })
      })
      if (filters.length > 0) { // 筛选数据指令不为空
        if (this.dataList.length > 0) {
          let result = filters
          this.dataList.map(dItem => { // 整合 当前数据 与 上一次数据
            let flag = true
            filters.map(fItem => {
              if (dItem.sequenceNumber === fItem.sequenceNumber) {
                flag = false
              }
            })
            if (flag) {
              result.push(dItem)
            }
          })
          this.dataList = result
        } else {
          this.dataList = filters
        }
      }
    },
    // 筛选最大时间, 以 yy-mm-dd HH:mm:ss 形式返回
    filterLatestTime (dateArr) {
      let timeArr = []
      dateArr.map(dItem => {
        let t = dItem.sendReceiveTime.replace(/T/gi, ' ')
        timeArr.push(standardDateTime(t))
      })
      let max = timeArr[0]
      for (let i = 0; i < timeArr.length; i++) {
        if (timeArr[i].getTime() > max.getTime()) {
          max = timeArr[i]
        }
      }
      let result = formatDateTime(new Date(max.getTime()))
      return result
    },
    // 当树列表有数据，开始定时访问
    autoRequest () {
      let _this = this
      let data = {
        active: 'CommandStatus.GetRealTimeCommandRecord',
        time: this.queryTime,
        treeTypeCode: 0,
        isBackground: this.switchFlagBySystem,
        isBackground_Person: (this.switchFlagBySystem && this.usersChecked),
        isBackground_System: (this.switchFlagBySystem && this.systemChecked),
        isTerminal: this.switchFlagByUsers,
        isTerminal_Upload: (this.switchFlagByUsers && this.upLoadChecked),
        isTerminal_Comfirm: (this.switchFlagByUsers && this.submitChecked)
      }
      this.timer2 = window.setInterval(() => {
        getCommandStatus(data).then(res => {
          let resArr = JSON.parse(res)
          // 返回数据不为空， 更新下一次请求事件
          if (resArr.length > 0) {
            _this.queryTime = _this.filterLatestTime(resArr)
            if (_this.switchFlagByUsers === true || _this.switchFlagBySystem === true) {
              _this.constructData(_this.respondData, resArr)
            } else {
              _this.dataList = []
            }
          }
        }).catch(err => {
          console.log(`${err} in function getCommandStatus of commandStatus.vue`)
        })
      }, 5000)
    },
    // 选中
    onRowClick (rowClickData) {
      this.removeSequence = rowClickData.sequenceNumber
    },
    // todo contextMenu begin
    showMenu () {
      event.preventDefault()
      // event.cancelBubble = true // prevent bubble
      let eX = event.clientX
      let eY = event.clientY
      let cX = this.$refs.commandGrid.getBoundingClientRect().x
      let cY = this.$refs.commandGrid.getBoundingClientRect().y
      var x = eX - cX + 6
      var y = eY - cY + 100
      // Set the position of context-menu
      this.contextMenuData.axios = {
        x, y
      }
    },
    removeAllCommands () {
      if (this.dataList.length > 0) {
        // do somethings
        this.dataList = []
      } else {
        this.$Modal.warning({
          title: '空操作',
          content: '当前指令数据为空，无法为您执行该操作'
        })
        setTimeout(() => {
          this.$Modal.remove()
        }, 2000)
      }
    },
    removeSelectedCommand () {
      if (this.removeSequence !== null) {
        if (this.dataList.length > 0) {
          let result = []
          this.dataList.map(dItem => {
            if (dItem.sequenceNumber !== this.removeSequence) {
              result.push(dItem)
            }
          })
          this.dataList = result
        }
      } else {
        this.$Modal.error({
          title: '当前操作不被允许',
          content: '操作的对象为空，请确认已选中要删除的指令'
        })
        setTimeout(() => {
          this.$Modal.remove()
        }, 2000)
      }
    },
    removeSuccessCommands () {
      if (this.dataList.length > 0) {
        let result = []
        this.dataList.map(dItem => {
          let flag = true
          if (dItem.status === 'Y') {
            flag = false
          }
          if (flag) {
            result.push(dItem)
          }
        })
        this.dataList = result
      } else {
        this.$Modal.error({
          title: '当前操作不被允许',
          content: '当前暂无发送成功的指令'
        })
        setTimeout(() => {
          this.$Modal.remove()
        }, 2000)
      }
    },
    removeFailCommands () {
      if (this.dataList.length > 0) {
        let result = []
        this.dataList.map(dItem => {
          let flag = true
          if (dItem.status === 'N') {
            flag = false
          }
          if (flag) {
            result.push(dItem)
          }
        })
        this.dataList = result
      } else {
        this.$Modal.error({
          title: '当前操作不被允许',
          content: '当前暂无发送失败的指令'
        })
        setTimeout(() => {
          this.$Modal.remove()
        }, 2000)
      }
    },
    resendAllFialCommands () {
      this.$Modal.info({
        title: '温馨提示',
        content: '该功能暂未开放，敬请期待'
      })
      setTimeout(() => {
        this.$Modal.remove()
      }, 2000)
    },
    // todo contextMenu end
    // todo confirm begin
    cancel () {},
    confirm () {}
    // todo confirm end
  },
  beforeCreate () {
  },
  created () {
    // 时钟
    this.currentTime = formatDateTime(new Date())
    let _this = this
    this.timer = setInterval(() => {
      let date = new Date()
      _this.currentTime = formatDateTime(date)
    }, 1000)
    // 初次访问时间设定
    let queryTime = new Date().getTime() - 600000
    this.queryTime = formatDateTime(new Date(queryTime))
  },
  mounted () {
    // console.log(this.$refs.commandGrid.getBoundingClientRect())
    // 添加监听事件
    this.fullHeight = document.documentElement.clientHeight * 80 / 100
    this.onResize()
  },
  beforeDestroy () {
    //
    window.removeEventListener('resize', this.handleResize)
  },
  destroyed () {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  }
}
</script>
<style>

  #command-wrapper .tabs-wrapper {
    display: table ;
    float: left;
    font-size: 16px;
    margin-left: 20px;
    position: relative;
  }
  #command-wrapper .tabs-title {
    display: inline-block;
    line-height: 1;
    margin: 0 20px 0 20px;
    user-select: none;
    font-weight: 500;
  }

  #command-wrapper .checkbox-wrapper {
    margin-left: 60px;
    margin-top: 20px;
    font-size: 16px;
  }

  #command-wrapper .checkbox-title {
    font-size: 16px;
    display: inline-block;
    padding-left: 6px;
    user-select: none;
  }

  #command-wrapper .time-wrapper {
    clear: both;
    overflow: hidden;
    padding: 4px 10px;
    font-size: 16px;
    font-weight: 700;
    color: green;
    user-select: none;
  }

  #command-wrapper .active {
    color: #409eff
  }

  #command-wrapper .negative {
    opacity: .9;
    filter: alpha(opacity: 90);
    color: #bbbec4;
    text-decoration: line-through;
    text-decoration-color: grey;
  }
/* ---------------------------------------------- */
  #command-wrapper .command-grid-wrapper {
    border: 1px solid grey;
  }

  #command-wrapper .command-grid-wrapper .table {
    width: auto;
    margin: 0 auto;
  }
  #command-wrapper tr.ivu-table-row-hover td {
    background: #87CEEB;
    cursor: pointer;
  }
</style>
