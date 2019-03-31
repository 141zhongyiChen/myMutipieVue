<template>
  <div id="autoComplete-wrapper">
    <div id="search">
      <Input type="text" v-model="searchData" size="large" :placeholder="placeHolder" style="width: 100%"
             @keyup.enter.native="searchByTerminalCode"
             @on-blur="toHidden"></Input>
      <Icon type="search" class="buttonSearch"
            @click.stop="searchByTerminalCode"
            title="确认查找"
      ></Icon>
    </div>
    <!-- 搜索结果 -->
    <div style="height:300px;width: 100%;overflow: auto;display: none" class="result" ref="resultWrapper">
      <div v-if="result.length > 0">
        <transition-group tag="ul" name="fade">
          <li v-for="(item, index) in result" :key="index"
              :title="`${item.title}-${item.objData[`${filter}`]}`"
              :class="[item.objData[filter] === treeTerminal ? 'resultActive': '']"
              @mousedown.stop="commitData(item)">
            <!--<span class="title">{{ item.title }}</span>-->
            <span class="title" :style="{ color: isUsed(item.objData) }">{{ item.title }}</span>
          </li>
        </transition-group>
      </div>
      <div v-else>
        <li>
          <span class="title" style="color: red">抱歉，未能匹配到任何结果...</span>
        </li>
      </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    dataCollections: {
      type: Array,
      default () {
        return []
      }
    },
    filter: {
      type: String,
      default () {
        return ''
      }
    }
  },
  components: {
  },
  data () {
    return {
      placeHolder: '输入编码或查找名称（支持拼音、首字母简拼）',
      searchData: '',
      selectedCode: '',
      isResultQuery: false,
      result: new Array(),
      modalTimer: null
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'treeTerminal',
      'respondData',
      'treeSelectedArr'
    ])
  },
  watch: {
    // todo: 因主控筛选条件变化，实时更新 供 智能搜索的 数据源
    dataCollections: {
      handler: (newVal) => {
        return newVal
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL'
    }),
    // 输入框延时处理
    debounce (func, delay) {
      let timer = null
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
    // 搜索结果框 显示隐藏
    toShow () {
      if (!this.isResultQuery) {
        this.$refs.resultWrapper.style.display = 'block'
      }
    },
    toHidden () {
      this.$refs.resultWrapper.style.display = 'none'
    },
    // 搜索结果
    searchResult (query) {
      let ret = []
      let index = 1
      if (query && this.dataCollections.length > 0) {
        this.dataCollections.filter(dItem => {
          index++
          const query = this.searchData.toUpperCase()
          const testStr = dItem.title + dItem.objData.pinYin + dItem.pinYinS + dItem.objData[this.filter]
          const testStrUpper = testStr.toUpperCase()
          if (testStrUpper.indexOf(query) > -1) {
            ret.push(dItem)
          }
        })
      }
      console.log(`搜索框执行循环${index}次`)
      return ret
    },
    // 判断是否有使用
    isUsed (objData, filter = 'isUsed') {
      if (objData.hasOwnProperty(filter)) {
        return objData[filter].toString() === 'false' ? 'gray' : 'green'
      }
      return 'green'
    },
    // 点击确认搜索数据
    commitData (item) {
      this.isResultQuery = true
      this.searchData = item.title
      this.selectedCode = item.objData[this.filter]
    },
    // 点击定位目标
    searchByTerminalCode () {
      this.toHidden()
      const filterCode = this.selectedCode
      this.selectedCode = ''
      // 空查询
      if (this.searchData === '') {
        this.$Modal.warning({
          title: '查询参数错误',
          content: '查询的字符不能为空'
        })
        clearInterval(this.modalTimer)
        this.modalTimer = setTimeout(() => {
          this.$Modal.remove()
        }, 2500)
        return
      }
      // 补全查询
      if (filterCode) {
        this.setTreeTerminal(filterCode)
        return
      }
      // 精确查找 有唯一记录
      const ret = JSON.parse(JSON.stringify(this.result))
      const tips = ret.length && ret.length > 1 ? '查询结果存在多条记录,请继续完善 待查询字符' : `没有为您查找到信息为 ${this.searchData} 的终端`
      if (ret.length === 1) {
        const code = ret[0].objData[this.filter]
        this.setTreeTerminal(code)
      } else {
        // 存在多条记录 或 记录不存在
        this.$Modal.error({
          title: '设置失败!详细查看提示信息',
          content: tips
        })
        clearInterval(this.modalTimer)
        this.modalTimer = setTimeout(() => {
          this.$Modal.remove()
        }, 2500)
      }
    }
  },
  created () {
    this.$watch('searchData', this.debounce((newQuery) => {
      if (newQuery !== '' && !this.isResultQuery) {
        this.result = this.searchResult(newQuery)
        this.toShow()
        const scrollTarget = $('#autoComplete-wrapper .result')[0]
        scrollTarget.scrollTop = 0
      } else {
        this.toHidden()
        this.isResultQuery = false
      }
    }, 500))
  },
  mounted () {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  /* buttonSearch样式 */
  @import "~common/stylus/variable.styl"
  /* 自动补全 */
  #autoComplete-wrapper {
    position relative
    width 100%
  }

  #autoComplete-wrapper #search {
    width 100%
  }

  /* placeHolder 样式 */
  #autoComplete-wrapper #search ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #61C6EB
    font-size 14px
    font-weight 550
    font-family '微软雅黑'
  }
  #autoComplete-wrapper #search :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #61C6EB
    font-size 14px
    font-weight 550
  }
  #autoComplete-wrapper #search ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #61C6EB
    font-size 14px
    font-weight 550
    font-family '微软雅黑'
  }
  #autoComplete-wrapper #search :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #61C6EB
    font-size 14px
    font-weight 550
    font-family '微软雅黑'
  }
  /* Input */
  #mainFrame-wrapper #autoComplete-wrapper #search .ivu-input {
    border: 0
    color: green
    outline: 0
    font-size 14px
    font-weight 550
    font-family '微软雅黑'
  }
  #autoComplete-wrapper .buttonSearch {
    font-size $font-size-large-x
    vertical-align middle
    text-align center
    position absolute
    right 6px
    top 6px
  }

  #autoComplete-wrapper .buttonSearch:hover {
    cursor: pointer;
    color $color-background-dl
  }

  #autoComplete-wrapper .result {
    width 100%
    position absolute
    top 36
    z-index 6000
    background white
    border 2px solid $color-background-dl
    font-size 18px
  }

  #autoComplete-wrapper .result li {
    width 450px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    line-height 2
    list-style-type:none
    padding-left 6px
    font-size 12px
    border-bottom 1px solid rgba(255, 255, 255, 0.3)
  }

  #autoComplete-wrapper .result li:hover {
    cursor: pointer;
    color $color-background-dl
    background $color-theme
  }

  #autoComplete-wrapper .resultActive {
    background $color-theme
  }

  #autoComplete-wrapper li > span.title {
    color black
    font-weight bold
    font-size 15px
    font-family '微软雅黑'
  }

  #autoComplete-wrapper .code {
    color deepskyblue
  }
</style>
