<template>
  <div id="mainFrame-wrapper" :style="{height: `${fullHeight}px`, minHeight: `${fullHeight}px`}" @contextmenu="doNothing()" v-if="initFinish">
    <!-- 1、树列表主控（左） -->
      <nav class="nav-wrapper" ref="nav">
        <!-- 搜索控件 -->
        <div class="autoComplete-wrapper" ref="search">
          <searchComplete
            :dataCollections="searchDataSource" :filter="filterCode"
            :initFinish="initFinish">
          </searchComplete>
        </div>
        <!-- 条件筛选控件 -->
        <!--<div class="condition-wrapper" ref="condition">
          <p style="border: 1px solid #9a9a9e;cursor:pointer">
            <span class="condition-title" title="过滤显示数据" @click="showConditionMenu">条件筛选</span>
          </p>
          <el-collapse-transition>
            <div v-show="showCondition" class="condition-menu">
              <ul v-if="conditions.length > 0" >
                <Row class="group-wrapper" v-for="(group, gIndex) in conditions" :key="gIndex">
                  <Col class="group-title" span="7">
                  <span>{{ group.groupName }} <strong>:</strong> </span>
                  </Col>
                  <Col class="group-items" span="17">
                  <Checkbox  v-for="(item, iIndex) in group.groupItems"
                             v-model="item.checked"
                             :key="iIndex">
                    <span :class="item.checked ? 'span-active' : ''">{{ item.itemName }}</span>
                  </Checkbox>
                  </Col>
                </Row>
              </ul>
              <li class="btn-wrapper" v-if="conditions.length > 0">
                <Button class="submit" size="small" @click="resetCondition">重置</Button>
                <Button class="submit" size="small" @click="confirmChecked">确定</Button>
                <Button class="cancel" size="small" @click="cancelChecked">取消</Button>
              </li>
              <ul v-else> 暂无数据 </ul>
            </div>
          </el-collapse-transition>
        </div>-->
        <!-- 树列表内容 -->
        <treeContent :showCheckBox="showCheckBox" :showArr="showArr"
                     :treeHeight="treeWrapperHeight" v-if="initFinish && !isRebuild">
        </treeContent>
      </nav>
    <!-- 2、中间分隔栏（中） -->
    <div class="moveLine" @mousedown="recordX($event)" ref="move">
      <div class="middle-line">
        <span>||</span>
      </div>
    </div>
    <!-- 3、插入栏（） -->
    <div ref="right" class="content-right">
      <slot></slot>
    </div>
    <!-- 数据加载组件 -->
    <!--<div class="loading-container" v-if="loading">
      <loading></loading>
    </div>-->
    <!-- 树列表重构对话 -->
    <Modal v-model="showModal"
           style="color: red;font-size: 16px"
           :title="modalTitle"
           @on-ok="modalOk"
           @on-cancel="modalCancel">
      <p style="font-size: 16px;color: grey">{{ modalContent }}</p>
    </Modal>
  </div>
</template>
<script>
import searchComplete from './searchComplete/searchComplete.vue'
import treeContent from './treeContent/treeContent.vue'
// import Loading from 'base/loading/loading'
import { mapGetters, mapMutations } from 'vuex'
import { getUrlParams } from 'common/js/getUrlParamsInfo'
import { setUserSetting } from 'api/setUserSetting'
//
import { UniqueData } from './utils/uniqueOriginalData.js'
// 自定义显示
import { groupByFilterAttr, computedChecked, treeDataHandler } from 'common/js/treeDataHandler'
const TO_BIN = 2
export default {
  name: 'masterFrame',
  components: {
    searchComplete,
    treeContent
  },
  data () {
    return {
      fullHeight: 736, // 800
      treeWrapperHeight: 600, // 620
      //loading: true,
      // The flag of check-box
      showCheckBox: true,
      initFinish: false,
      // Duplicate of respondData && listTreeData && regionTreeData && typeTreeData
      RESPOND_DATA: [],
      LIST_TREE_DATA: [],
      REGION_TREE_DATA: [],
      TYPE_TREE_DATA: [],
      //
      // todo: 筛选条件 begin
      showCondition: false, // 显示标志
      // 自定义显示数据[初始化]
      showArr: [
        {
          attrName: 'isUsed',
          attrType: 'Boolean',
          attrValue: 'true',
          attrColor: 'green'
        },
        {
          attrName: 'isUsed',
          attrType: 'Boolean',
          attrValue: 'false',
          attrColor: 'grey'
        }
      ],
      // 自定义过滤数据[初始化]
      filterArr: [],
      conditions: [],
      // 保存勾选记录(上一次)
      lastChecked: [],
      // 重构标志, Number
      isRebuild: false,
      //
      showModal: false,
      modalTitle: '',
      modalContent: ''
      // todo: 筛选条件 end
    }
  },
  computed: {
    // Todo: MapGetters
    ...mapGetters('treeModule', [
      'treeCheckedArr',
      'listTreeData',
      'regionTreeData',
      'typeTreeData',
      'respondData',
      'filterCode',
      'treeTerminal'
    ]),
    // todo: DWJ refresh timer
    ...mapGetters('dwjModule', [
      'dwjRespond'
    ]),
    ...mapGetters('userModule', [
      'depCode',
      'userCode',
      'tree',
      'UFCode'
    ]),
    //
    // Todo: 搜索组件数据源
    searchDataSource () {
      let Source = JSON.parse(JSON.stringify(this.respondData))
      Source.forEach(item => {
        item.pinYinS = this.TO_PinYinS(item.objData.pinYin)
      })
      return Source
    },
    //
    // Todo: 自定义筛选组件
    conditionInfo () {
      if (this.filterArr.length > 0 && this.RESPOND_DATA.length > 0) {
        let temp = groupByFilterAttr(this.RESPOND_DATA, this.filterArr)
        return temp
      }
      return []
    }
  },
  watch: {
    // todo: Filter-conditions
    conditionInfo (newVal) {
      this.lastChecked = JSON.parse(JSON.stringify(newVal))
      this.conditions = JSON.parse(JSON.stringify(newVal))
    }
  },
  methods: {
    ...mapMutations('treeModule', {
      setListData: 'SET_LIST_DATA',
      setRegionData: 'SET_REGION_DATA',
      setTypeData: 'SET_TYPE_DATA',
      setRespondData: 'SET_RESPOND_DATA',
      setFilterCode: 'SET_FILTER_CODE',
      setTreeTerminal: 'SET_TREE_TERMINAL',
      setAddressCode: 'SET_ADDRESS_CODE',
      setRunningCode: 'SET_RUNNING_CODE',
      setSelectedArr: 'SET_TREE_SELECTED',
      setCheckedArr: 'SET_CHECKED_ARR',
      setRespondMap: 'SET_RESPOND_MAP'
    }),
    ...mapMutations('userModule', {
      setDepCode: 'SET_DEP_CODE',
      setUFCode: 'SET_UF_CODE',
      setUserCode: 'SET_USER_CODE',
      setTreeCode: 'SET_TREE_CODE'
    }),
    ...mapMutations('dwjModule', {
      setStatus: 'SET_DWJ_STATUS',
      setQTS: 'SET_QTS'
    }),
    //
    TO_PinYinS (str) {
      let retStr = ''
      const tempArr = str.split('')
      for (let i in tempArr) {
        if (tempArr[i].charCodeAt() > 127 || tempArr[i].charCodeAt() < 97) {
          retStr += tempArr[i]
        }
      }
      return retStr
    },
    //
    // Todo: Filter Show
    showConditionMenu (bool = 'auto') {
      switch (bool) {
        case true:
          this.showCondition = true
          break
        case false:
          this.showCondition = false
          break
        default:
          this.showCondition = !this.showCondition
      }
    },
    // 确定 自定义 筛选
    confirmChecked () {
      this.modalTitle = ` 确认继续进行此操作吗 `
      this.modalContent = ` 该操作将会根据已指定的筛选条件重置树列表所有数据 `
      this.showModal = true
    },
    // 取消 [ 清除操作 ]
    cancelChecked () {
      this.showConditionMenu(false)
      this.conditions = JSON.parse(JSON.stringify(this.lastChecked))
    },
    modalOk () {
      this.showModal = false
      this.showConditionMenu(false)
      // 记录当前 勾选状态
      this.lastChecked = JSON.parse(JSON.stringify(this.conditions))
      // 重构树列表
      this._resetTreeStoreData()
    },
    modalCancel () {
      this.showModal = false
      this.showConditionMenu(false)
      // 没有点击确认，则恢复上一次筛选状态
      this.conditions = JSON.parse(JSON.stringify(this.lastChecked))
    },
    // Todo: Rebuild Options
    resetCondition () {
      // reset the condition record
      this.lastChecked = JSON.parse(JSON.stringify(this.conditionInfo))
      this.conditions = JSON.parse(JSON.stringify(this.conditionInfo))
      // hidden the conditionMenu
      this.showConditionMenu(false)
      // clear treeStore information
      this._resetTreeStoreData()
    },
    _resetTreeStoreData () {
      /* if lengthen of conditionsResult = 0 , show original data ; else show data after filtering */
      let checkedResult = computedChecked(this.conditions)
      // console.log(checkedResult)
      if (checkedResult.length > 0) {
        this.setRespondData(treeDataHandler(this.RESPOND_DATA, checkedResult))
        this.setListData(treeDataHandler(this.LIST_TREE_DATA, checkedResult))
        this.setRegionData(treeDataHandler(this.REGION_TREE_DATA, checkedResult))
        this.setTypeData(treeDataHandler(this.TYPE_TREE_DATA, checkedResult))
      } else {
        /* restore original dataSource */
        this.setRespondData(JSON.parse(JSON.stringify(this.RESPOND_DATA)))
        this.setListData(JSON.parse(JSON.stringify(this.LIST_TREE_DATA)))
        this.setRegionData(JSON.parse(JSON.stringify(this.REGION_TREE_DATA)))
        this.setTypeData(JSON.parse(JSON.stringify(this.TYPE_TREE_DATA)))
      }
      this._clearTreeStore()
      // 重构树视图
      this.isRebuild = true
      this.$nextTick(() => {
        this.isRebuild = false
      })
    },
    _clearTreeStore () {
      let arr = new Array()
      this.setCheckedArr(arr)
    },
    //
    // Todo: Data-Request
    // 请求树列表配置数据
    _getInitTreeSetting () {
      // console.log(`${this.tree}树列表配置数据`)
      setUserSetting({
        depCode: this.depCode,
        treeTypeCode: this.tree,
        active: 'InitTreeSetting.InitSettingHandler'
      })
        .then(res => {
          // resArr[0] => showArr ; resArr[1] => filterArr
          let resArr = JSON.parse(res)
          let showArr = resArr[0].RespondData
          let filterArr = resArr[1].RespondData
          if (showArr.length > 0) {
            this.showArr = showArr
          }
          if (filterArr.length > 0) {
            this.filterArr = filterArr
          }
          // 主控数据请求
          this._getInitTreeData()
        })
        .catch(err => {
          console.log(err)
          console.log('_getInitTreeSetting error in masterFrame.vue')
        })
    },
    // 树列表 数据[ ZL ]
    _getInitTreeData () {
      // console.log(`${this.tree}树列表数据`)
      setUserSetting({
        depCode: this.depCode,
        treeTypeCode: this.tree,
        active: 'TreeData.GetTreeInitData'
      })
        .then(res => {
          let obj = JSON.parse(res)
          // 计算字典 {'terminalCode' : Object}
          let respondDic = UniqueData(obj)
          if (!respondDic.size) {
            console.log('树列表没有任何数据，请确认tree参数是否设置正确')
            return
          }
          this.setRespondMap(respondDic)
          // 设置当前数据
          let { listTreeData, regionTreeData, lightingTypeTreeData } = obj
          let resArr = [...respondDic.values()]
          this.setRespondData(resArr)
          this.setFilterCode(this.recognizeFilter(resArr[0].objData.type))
          console.log(`${this.filterCode}去重`)
          //
          this.setListData(listTreeData)
          this.setRegionData(regionTreeData)
          this.setTypeData(lightingTypeTreeData)
          // 设置备份数据
          this.RESPOND_DATA = JSON.parse(JSON.stringify(resArr))
          this.LIST_TREE_DATA = JSON.parse(JSON.stringify(listTreeData))
          this.REGION_TREE_DATA = JSON.parse(JSON.stringify(regionTreeData))
          this.TYPE_TREE_DATA = JSON.parse(JSON.stringify(lightingTypeTreeData))
          // 数据设置完成，允许外部调用
          // this.loading = false
          this.initFinish = true
          this.$emit('init-finish', true)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    _getTreeData () {
      $.ajax({
        url: 'static/AllData.json',
        type: 'GET',
        success: (res) => {
          console.log('请求成功')
          let obj = res
          // 计算字典 {'terminalCode' : Object}
          let respondDic = UniqueData(obj)
          this.setRespondMap(respondDic)
          // 设置当前数据
          let { listTreeData, regionTreeData, lightingTypeTreeData } = obj
          let resArr = [...respondDic.values()]
          this.setRespondData(resArr)
          this.setFilterCode(this.recognizeFilter(resArr[0].objData.type))
          console.log(`${this.filterCode}去重`)
          //
          this.setListData(listTreeData)
          this.setRegionData(regionTreeData)
          this.setTypeData(lightingTypeTreeData)
          // 设置备份数据
          this.RESPOND_DATA = JSON.parse(JSON.stringify(resArr))
          this.LIST_TREE_DATA = JSON.parse(JSON.stringify(listTreeData))
          this.REGION_TREE_DATA = JSON.parse(JSON.stringify(regionTreeData))
          this.TYPE_TREE_DATA = JSON.parse(JSON.stringify(lightingTypeTreeData))
          // 数据设置完成，允许外部调用
          // this.loading = false
          this.initFinish = true
          this.$emit('init-finish', true)
        },
        error: function (error) {
          console.log(error)
        }
      })
    },
    // 查询是否显示复选框
    _getCheckBoxFlag () {
      if (this.UFCode !== undefined) {
        setUserSetting({
          active: 'CheckBoxOfElectricEnergy.GetCheckBoxInfo',
          UFCode: this.UFCode
        })
          .then(res => {
            let showFlag = JSON.parse(res).showFlag
            switch (showFlag) {
              case 'Y':
                this.showCheckBox = false
                break
              default:
                this.showCheckBox = true
            }
          })
      }
    },
    // Recognized The Type Of Current FilterCode
    recognizeFilter (type) {
      switch (type) {
        // 自动化
        case 'Master':
          return 'terminalCode'
        // 电能量
        case 'EnergyMeter_ZL':
        case 'EnergyMeter_NS':
          return 'addressCode'
        // 亮灯率
        case 'LightingRate':
          return 'runningCode'
        default:
          return 'terminalCode'
      }
    },
    //
    // ToDo: By Handle Window Events
    onResize () {
      window.addEventListener('resize', this.handleResize)
    },
    handleResize () {
      const fullHeight = document.documentElement.clientHeight
      this.fullHeight = fullHeight
      // 最小高度 600
      let treeWrapperHeight = fullHeight - 36 - 20 // - 30 // - 50
      this.treeWrapperHeight = treeWrapperHeight > 600 ? treeWrapperHeight : 600
    },
    // Drag to resize the masterController's width
    recordX (event) {
      let _this = this
      let disX = 0
      document.onmousedown = (ev) => {
        disX = ev.clientX - this.$refs.nav.offsetWidth - this.$refs.nav.offsetLeft
      }
      document.onmousemove = (ev) => {
        let mouseMoveX = ev.clientX
        let width = mouseMoveX - disX
        _this.$refs.nav.style.width = width + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
      if (event.preventDefault) {
        event.preventDefault()
      }
    },
    // Prevent Browser's ContentTextMenu
    doNothing () {
      window.event.returnValue = false
    }
  },
  created () {
    this.handleResize()
    // 获取人员基础信息
    let userInfo = getUrlParams(window.location.href)
    if (process.env.NODE_ENV === 'development') {
      this.setDepCode(userInfo.depCode || '003000000000000000000029')
      this.setUFCode(userInfo.UFCode)
      this.setUserCode(userInfo.userCode || '003700000000000000000254')
      this.setTreeCode(parseInt(userInfo.tree) || 0)
      this.setQTS(userInfo.qts === 'Y' || userInfo.qts === 'y')
      let statusCode = /^[1-7]$/.test(userInfo.status) ? parseInt(userInfo.status) : 0
      let statusArr = statusCode.toString(TO_BIN).split('')
      while (statusArr.length < 3) {
        statusArr.unshift('0') // 高位补零
      }
      this.setStatus(statusArr)
      // 是否显示复选框
      this._getCheckBoxFlag()
      // 主控配置请求 [ ZL ]
      // this._getInitTreeSetting()
      // Home_Test
      this._getTreeData()
    } else {
      if (userInfo.depCode && userInfo.userCode && userInfo.UFCode) {
        this.setDepCode(userInfo.depCode)
        this.setUFCode(userInfo.UFCode)
        this.setUserCode(userInfo.userCode)
        this.setTreeCode(parseInt(userInfo.tree) || 0)
        this.setQTS(userInfo.qts === 'Y' || userInfo.qts === 'y')
        let statusCode = /^[1-7]$/.test(userInfo.status) ? parseInt(userInfo.status) : 0
        let statusArr = statusCode.toString(TO_BIN).split('')
        while (statusArr.length < 3) {
          statusArr.unshift('0') // 高位补零
        }
        this.setStatus(statusArr)
        // 是否显示复选框
        this._getCheckBoxFlag()
        // 主控配置请求
        this._getInitTreeSetting()
      } else {
        console.log('不同时具备 depCode, userCode, UFCode 三个必须参数')
      }
    }
  },
  mounted () {
    // this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  html, body {
    overflow hidden
  }
  #mainFrame-wrapper
    display flex
    // min-width 1200px;
    min-height 700px
    width 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-top 2px solid $color-dialog-background
    border-left 2px solid $color-dialog-background
    border-right 2px solid $color-dialog-background
    border-bottom 2px solid $color-dialog-background
    padding  6px 4px
    position relative
    font-family '微软雅黑'
    // Left content
    .nav-wrapper
      /*width 390px*/
      height 100%
      min-width 350px
      max-width 460px
      display inline-block
      border 4px solid $color-background-d
      border-radius 5px
      background #eeeeee
      position relative
      overflow hidden
      // 搜索控件
      .autoComplete-wrapper
        height 36px
        width 100%
        border 1px solid #eeeeee
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      // 条件筛选控件
      .condition-wrapper
        height: 30px
        width: 100%
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        position: relative
        background: #eeeeee
        & p
          height 100%
          line-height 30px
          padding-right 4px
          text-align right
          & span
            &:hover
              color #2db7f5
        .condition-menu
          font-size: 14px
          width: 100%
          border-radius 4px
          position: absolute
          top: 100%
          left: 0
          z-index: 5
          background: gainsboro
          & ul
            padding 4px
            height: 150px
            overflow-y: auto
            overflow-x: auto
          .group-wrapper
            border-bottom 1px solid silver
            .group-title
              color darkgreen
            .group-items
              color black
              span:hover
                color deepskyblue
              .span-active
                color deepskyblue
          .btn-wrapper
            text-align:center
            list-style none
            .submit
              cursor pointer
              &:hover
                background #87CEEB
                color white
            .cancel
              cursor pointer
              &:hover
                background #87CEEB
                color white
      // 树控件
        // tabs nav style
        .el-tabs__nav
          display flex
          width 100%
          text-align center
        .el-tabs__header
          margin 0
        .el-tabs__item
          flex 1
          font-size 14px
          font-weight 600
        .is-active
          background: -webkit-linear-gradient(bottom, #409eff, #87CEEB); // Safari 5.1 - 6.0
          background: -o-linear-gradient(bottom, #409eff, #87CEEB); // Opera 11.1 - 12.0
          background: -moz-linear-gradient(bottom, #409eff, #87CEEB); // Firefox 3.6 - 15
          background: linear-gradient(to bottom, #409eff, #87CEEB);
          color greenyellow
          font-size 15px
    // middle Line
    .moveLine
      display inline-block
      width 10px
      min-width 10px
      border-radius 5px
      background gainsboro
      cursor ew-resize
      position relative
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .middle-line
        position absolute
        top 50%
        margin-top -4px
        height 8px
        width 10px
        text-align center
        & span:hover
          cursor pointer
    // Right content
    .content-right
      width 100%
      height 100%
      // min-width 930px
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      border 4px solid $color-background-b
      boxShadow: 4px 2px 3px 2px rgba(176,196,222,.1)
      position relative;
      display inline-block;
      overflow hidden;
    // loadding
    .loading-container
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
</style>
