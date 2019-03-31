<template>
  <div class="app-wrapper">
    <transition name="nav">
      <nav class="nav-wrapper" ref="nav" v-show="isShow">
        <Tabs></Tabs>
      </nav>
    </transition>
    <div class="moveLine" @mousedown="recordX" ref="move">
      <div class="middle-line">
        <span>||</span>
      </div>
    </div>
    <div ref="right" class="content-right">
      <slot></slot>
    </div>
    <div class="loading-container" v-show="loading">
      <!--<loading></loading>-->
    </div>
  </div>
</template>

<script>
import Tabs from './tabs.vue'
// import Loading from 'base/loading/loading'
import { mapGetters, mapMutations } from 'vuex'
import { getDataOfLampRate } from 'api/getDataOfLampRate'
import { getUniqueData } from 'common/js/getUniqueData'
import { getUrlParams } from 'common/js/getUrlParams'
export default {
  components: {
    Tabs
    // Loading
  },
  data () {
    return {
      isShow: true,
      loading: false
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'respondData'
    ])
  },
  methods: {
    ...mapMutations('treeModule', {
      setRespondData: 'SET_RESPOND_DATA'
    }),
    // resize nav width
    recordX () {
      let _this = this
      let disX = event.clientX - this.$refs.nav.offsetWidth - this.$refs.nav.offsetLeft
      document.onmousemove = function () {
        let ev = event
        let mouseMoveX = ev.clientX
        let width = mouseMoveX - disX
        _this.$refs.nav.style.width = width + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      if (event.preventDefault) {
        event.preventDefault()
      }
    },
    // request data
    _getTreeData () {
      if (process.env.NODE_ENV === 'development') {
        getDataOfLampRate().then((res) => {
          this.loading = false
          this.setRespondData(getUniqueData(JSON.parse(res)))
        })
      } else {
        let { DepCode, userCode, UFCode } = getUrlParams(window.location.href)
        if (DepCode !== undefined && userCode !== undefined && UFCode !== undefined) {
          let data = {
            depCode: DepCode
          }
          getDataOfLampRate(data).then((res) => {
            this.loading = false
            this.setRespondData(getUniqueData(JSON.parse(res)))
          })
        } else {
          this.dataList = []
        }
      }
    },
    // nav toggle-show
    toggleShow () {
      this.isShow = !this.isShow
    }
  },
  created () {
    this.loading = true
    // window.developerCode = '003000000000000000000029'
    this._getTreeData()
  },
  mounted () {
  }
}
</script>

<style scroped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  /* nav style */
  .app-wrapper
    display flex
    min-width 1200px
    border-left 4px solid $color-dialog-background
    border-right 4px solid $color-dialog-background
    border-bottom 4px solid $color-dialog-background
    padding  6px 4px
    width 100vw;
    height 100vh;
    min-height 784px
    position relative
    .loading-container
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    .nav-enter
      transform translateX(-50%)
      opacity 0
    .nav-enter-to
      transform: translateX(0)
      opacity 1
    .nav-enter-active
      transition: 0.5s
      opacity 1
    .nav-leave
      transform: translateX(0)
      opacity 1
    .nav-leave-to
      transform: translateX(-50%)
      opacity 1
    .nav-leave-active
      transition: 0.5s
      opacity 0
    .nav-wrapper
      width 300px
      display inline-block
      min-width 270px
      max-width 460px
      border 4px solid $color-background-d
      border-radius 5px
      background #eeeeee
      position relative
      overflow hidden
    .moveLine
      display inline-block
      width 10px
      min-width 10px
      border-radius 5px
      background gainsboro
      cursor ew-resize
      position relative
      .middle-line
        position absolute
        top 50%
        margin-top -4px
        height 8px
        width 10px
        text-align center
        & span:hover
          cursor pointer
    .content-right
      display inline-block
      width 100%
      min-width 930px
      border 4px solid $color-background-b
      boxShadow: 4px 2px 3px 2px rgba(176,196,222,.1)
</style>
