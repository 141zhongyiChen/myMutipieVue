<template>
  <div class="autoComplete-wrapper">
    <div class="search">
      <Input type="text" v-model="searchData" size="large" placeholder="输入编码或查找名称"
             @on-focus="toShow"
      ></Input>
      <Icon type="search" class="buttonSearch"
            @click.stop="searchByTerminalCode"
            title="确认查找"
      ></Icon>
    </div>
    <!-- 搜索结果 -->
    <div style="height:300px;width: 100%;overflow: scroll" class="result" ref="resultWrapper"
         v-show="searchData !== '' && isShow === true">
        <div v-if="result.length > 0">
          <li
            v-for="(item, index) in result"
            :key="index"
            :class="[index == 0 ? 'resultActive': '']"
            @mousedown.stop="commitData(item)">
            <span class="title">{{ item.title }}</span>
            <span class="code">{{ item.objData[`${filterCode}`]}}</span>
          </li>
        </div>
        <div v-else>
          <li>
            <span class="title" style="color: red">抱歉，未能匹配到任何结果</span>
          </li>
        </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import 'vue-happy-scroll/docs/happy-scroll.css'
// import { HappyScroll } from 'vue-happy-scroll'
import Velocity from 'velocity-animate'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    /* HappyScroll */
  },
  data () {
    return {
      dataList: [],
      searchData: '',
      selectedArr: [],
      // 记录 数据源 类型， 默认值为：主控 Master
      dataType: 'Master',
      // 记录当前 筛选条件，随 数据源 变化而变化
      filterCode: 'terminalCode',
      // 记录用于 辨识的 唯一识别码
      uniqueCode: null,
      //
      isShow: false
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'treeTerminal',
      'respondData',
      'treeAddressCode',
      'treeRunningCode'
    ]),
    // 搜索结果
    result () {
      let _this = this
      let ret = []
      if (this.searchData && this.dataList.length > 0) {
        this.dataList.filter(function (dItem) {
          if (dItem.title.indexOf(_this.searchData) !== -1 ||
            dItem.objData[_this.filterCode].indexOf(_this.searchData) !== -1 ||
            dItem.objData.pinYin.toUpperCase().indexOf(_this.searchData.toUpperCase()) !== -1
          ) {
            ret.push(dItem)
          }
        })
      }
      return ret
    }
  },
  watch: {
    respondData (newVal) {
      this.dataList = newVal
      // 更新 数据源 类型
      this.dataType = newVal[0].objData.type
      switch (this.dataType) {
        case 'EnergyMeter_ZL':
        case 'EnergyMeter_NS':
          this.filterCode = 'addressCode'
          break
        case 'LightingRate':
          this.filterCode = 'runningCode'
          break
        // 默认为：'Master'
        default:
          this.filterCode = 'terminalCode'
      }
    },
    // 搜索结果框 隐藏与显示
    searchData (newVal) {
      if (newVal !== '' && this.isShow === true) {
        this.$refs.resultWrapper.style.zIndex = 100
      } else {
        this.$refs.resultWrapper.style.zIndex = -1
      }
      // 添加监听事件
      /* let _this = this
      document.addEventListener('mouseup', function () {
        _this.$refs.resultWrapper.style.zIndex = -1
      }, false) */
    }
  },
  methods: {
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL',
      setTreeSelected: 'SET_TREE_SELECTED',
      setAddressCode: 'SET_ADDRESS_CODE',
      setRunningCode: 'SET_RUNNING_CODE'
    }),
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    },
    // 搜索结果框 显示隐藏
    toShow () {
      this.isShow = true
    },
    toHidden () {
      this.isShow = false
    },
    // 点击确认搜索数据
    commitData (item) {
      let title = $(event.currentTarget).find('.title').text()
      let code = $(event.currentTarget).find('.code').text()
      this.isShow = false
      this.searchData = title
      // 记录 选中项 的 唯一编码（终端码或地址码）
      this.uniqueCode = code
      this.selectedArr[0] = item
      // 隐藏搜索结果栏
      this.toHidden()
      this.$refs.resultWrapper.style.zIndex = -1
    },
    // 点击定位目标
    searchByTerminalCode () {
      if (this.searchData === '') {
        this.$Modal.warning({
          title: '查询参数错误',
          content: '无效的参数查询'
        })
        setTimeout(() => {
          this.$Modal.remove()
        }, 2000)
      } else {
        // 选中搜索结果行后,执行该方法 处理
        if (this.selectedArr.length > 0 && this.uniqueCode !== null) {
          switch (this.dataType) {
            case 'EnergyMeter_ZL':
            case 'EnergyMeter_NS':
              this.setAddressCode(this.uniqueCode)
              this.setTreeTerminal(this.selectedArr[0].objData.terminalCode)
              break
            case 'LightingRate':
              this.setRunningCode(this.uniqueCode)
              this.setTreeTerminal(this.selectedArr[0].objData.terminalCode)
              break
            // 默认为：'Master'
            default:
              this.setTreeTerminal(this.uniqueCode)
          }
          // 设置当前选中终端信息
          this.setTreeSelected(this.selectedArr)
          // 清空数据
          this.searchData = ''
          this.uniqueCode = null
          this.selectedArr = []
        } else {
          if (this.dataList.length > 0) {
            // 隐藏搜索结果栏
            this.$refs.resultWrapper.style.zIndex = -1
            let _this = this
            let query = this.searchData
            this.dataList.map((dItem) => {
              //
              if (query === dItem.title || query === dItem.objData[_this.filterCode] ||
                  query.toUpperCase() === dItem.objData.pinYin.toUpperCase()) {
                switch (_this.dataType) {
                  case 'EnergyMeter_ZL':
                  case 'EnergyMeter_NS':
                    _this.setAddressCode(dItem.objData.addressCode)
                    _this.setTreeTerminal(dItem.objData.terminalCode)
                    break
                  case 'LightingRate':
                    _this.setRunningCode(dItem.objData.runningCode)
                    _this.setTreeTerminal(dItem.objData.terminalCode)
                    break
                  // 默认为：'Master'
                  default:
                    _this.setTreeTerminal(dItem.objData.terminalCode)
                }
                // 当前选中终端信息
                let ret = []
                ret[0] = dItem
                _this.setTreeSelected(ret)
              }
            })
            this.searchData = ''
          }
        }
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  /* buttonSearch样式 */
  @import "~common/stylus/variable.styl"
  /* 自动补全 */
  .autoComplete-wrapper {
    position relative
  }

  .buttonSearch {
    font-size $font-size-large-x
    vertical-align middle
    text-align center
    position absolute
    right 6px
    top 6px
  }

  .buttonSearch:hover {
    cursor: pointer;
    color $color-background-dl
  }

  .result {
    width 100%
    position absolute
    top 36
    z-index -1
    background white
    border 2px solid $color-background-dl
    font-size 18px
  }

  .result li {
    width 400px
    line-height 2
    list-style-type:none
    padding-left 6px
    font-size 12px
    border-bottom 1px solid rgba(255, 255, 255, 0.3)
  }

  .result li:hover {
    cursor: pointer;
    color $color-background-dl
    background $color-theme
  }
  .resultActive {
    background $color-theme
  }

  .title {
    color black
    font-weight 500
  }

  .code {
    color deepskyblue
  }
</style>
