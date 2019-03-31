<template>
  <div class="tabs-wrapper">
    <!-- 搜索自动补全 -->
    <div class="autoComplete-wrapper">
      <searchComplete></searchComplete>
    </div>
    <!-- 树列表切换按钮 -->
    <nav class="tab-buttons">
      <Button :style="{padding: '0px'}" v-for="m in menus" :key="m.index" @click="toggleTabs(m)">
        <a
           :class="currentActive == m.index ? 'active' : '' ">
          <Icon :style="{fontSize: '14px'}" :type="m.type"></Icon>
          {{ m.title }}
        </a>
      </Button>
    </nav>
    <!-- 树列表切换视图 -->
    <div class="view-wrapper" :style="{ height: treeHeight + 'px'}" @contextmenu="showMenu">
      <div v-if="currentView === 'treeList'" style="height: 95%">
        <transition :name="run" mode="out-in">
          <treeList></treeList>
        </transition>
      </div>
      <div v-else-if="currentView === 'treeArea'" style="height: 95%">
        <transition :name="run" mode="out-in">
          <treeArea></treeArea>
        </transition>
      </div>
      <div v-else style="height: 95%">
        <transition :name="run" mode="out-in">
          <treeType></treeType>
        </transition>
      </div>
    </div>
    <!-- 树列表 勾选总数 计算 -->
    <div class="selected">
      <span>[</span>
      <span style="color: #d93f30">&nbsp;{{ hasSelected }}&nbsp;</span>
      <span>/</span>
      <span>&nbsp;{{ totalNumber }}&nbsp;</span>
      <span>]</span>
    </div>
    <!-- 右键菜单 -->
    <vue-context-menu
        class="treeContext"
        :contextMenuData="contextMenuData"
        @refresh="refresh"
        @add="add"
        @del="del">
    </vue-context-menu>
    <!-- 右键菜单 -->
  </div>
</template>
<script type='text/ecmascript-6'>
import treeArea from 'components/tabs/treeArea.vue'
import treeType from 'components/tabs/treeType.vue'
import treeList from 'components/tabs/treeList.vue'
import searchComplete from 'components/searchComplete/searchComplete.vue'
import VueContextMenu from 'base/contextmenu/VueContextMenu'
import { mapGetters } from 'vuex'
export default {
  components: {
    treeArea,
    treeList,
    treeType,
    searchComplete,
    VueContextMenu
  },
  data () {
    return {
      menus: [
        {
          id: 'treeList',
          title: '列表',
          type: 'navicon-round',
          index: 1
        },
        {
          id: 'treeArea',
          title: '区域',
          type: 'location',
          index: 2
        },
        {
          id: 'treeType',
          title: '类型',
          type: 'videocamera',
          index: 3
        }
      ],
      /* current */
      currentActive: 1,
      currentView: 'treeList',
      run: 'left',
      totalNumber: 0,
      hasSelected: 0,
      /* 右键菜单 */
      contextMenuData: {
        // 菜单名称，全局唯一
        menuName: 'name1',
        // 菜单位置
        axios: {
          x: null,
          y: null
        },
        // 菜单选项
        menulists: [
          {
            fnHandler: 'refresh',
            icoName: 'el-icon-more',
            btnName: '刷新'
          },
          {
            fnHandler: 'add',
            icoName: 'el-icon-more',
            btnName: '添加'
          },
          {
            fnHandler: 'del',
            icoName: 'el-icon-delete',
            btnName: '删除'
          }
        ]
      },
      // 树列表高度
      treeHeight: 700
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'treeCheckedArr',
      'respondData'
    ])
  },
  watch: {
    currentActive (newVal, oldVal) {
      if (newVal > oldVal) {
        this.run = 'left'
      } else {
        this.run = 'right'
      }
    },
    treeCheckedArr (selectedArr) {
      this.hasSelected = selectedArr.length
    },
    respondData (newVal) {
      this.totalNumber = newVal.length
    }
  },
  methods: {
    toggleTabs (obj) {
      this.currentView = obj.id
      this.currentActive = obj.index
    },
    /* 右键事件定义开始 */
    showMenu () {
      event.preventDefault()
      var x = event.clientX + 6
      var y = event.clientY
      // Get the current location
      this.contextMenuData.axios = {
        x, y
      }
    },
    refresh () {
      console.log('refresh in tabs at line 163')
    },
    add () {
      console.log('add in tabs at line 166')
    },
    del () {
      console.log('del in tabs at line 169')
    },
    /* 右键事件定义结束 */
    // todo 监听浏览器窗口变化 begin
    onResize () {
      let _this = this
      window.addEventListener('resize', _this.handleResize)
    },
    handleResize (event) {
      // this.fullHeight = document.documentElement.clientHeight * 70 / 100
      let height = document.documentElement.clientHeight
      this.treeHeight = height - 100
    }
    // todo 监听浏览器变化 end
  },
  created () {
  },
  mounted () {
    this.handleResize()
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tabs-wrapper {
    height 100%
    position relative
  }
  .tab-buttons
    width: 100%
    background #eeeeee
    display flex
    justify-content space-around
    button
      flex 1
    .active
      background: -webkit-linear-gradient(bottom, #409eff, #87CEEB); // Safari 5.1 - 6.0
      background: -o-linear-gradient(bottom, #409eff, #87CEEB); // Opera 11.1 - 12.0
      background: -moz-linear-gradient(bottom, #409eff, #87CEEB); // Firefox 3.6 - 15
      background: linear-gradient(to bottom, #409eff, #87CEEB);
      color greenyellow
      font-size 14px
    & a
      width 100%
      text-decoration: none
      color:#000;
      display: inline-block !important
      text-align:center
      background:#aaaaaa
      padding:10px
      &:hover
        background $color-background-sky
  .left-enter
    transform: translateX(100%)
    opacity 0
  .left-enter-to
    transform: translateX(0)
    opacity 1
  .left-enter-active
    transition: 0.3s
    opacity 1
  .left-leave
    transform: translateX(0)
    opacity 1
  .left-leave-to
    transform: translateX(-100%)
    opacity 1
  .left-leave-active
    transition: 0.2s
    opacity 0
  .right-enter
    transform: translateX(-100%)
  .right-enter-to
    transform: translateX(0)
  .right-enter-active
    transition: 0.3s
  .right-leave
    transform: translateX(0)
  .right-leave-to
    transform: translateX(100%)
  .right-leave-active
    transition: 0.2s
  .view-wrapper
    min-height: 700px
    /* max-height: 700px */
    overflow: hidden
    margin: 2px
    // border-left: 1px solid $color-background-dl
    // border-right: 1px solid $color-background-dl
    // border-bottom: 1px solid $color-background-dl
    border-top: 2px solid $color-background-dl
  .selected
    position absolute
    bottom 10px
    left 10px
    height 30px
    line-height 30px
    font-size $font-size-medium
    font-weight bold
    color $color-background
  .treeContext
    z-index 99999
</style>
