<template>
  <div ref="outerWrapper" :class="wrapperClasses">
    <!-- 左右 -->
    <div v-if="isHorizontal" :class="`${prefix}-horizontal`">
      <div :style="{right: `${anotherOffset}%`}" class="left-pane" :class="paneClasses">
        <slot name="left"/>
      </div>
      <div :class="`${prefix}-trigger-con`" :style="{left: `${offset}%`}" @mousedown="handleMousedown">
        <slot name="trigger">
          <trigger mode="vertical"/>
        </slot>
      </div>
      <div :style="{left: `${offset}%`}" class="right-pane" :class="paneClasses">
        <slot name="right"/>
      </div>
    </div>
    <!-- 垂直 -->
    <div v-else :class="`${prefix}-vertical`">
      <div :style="{bottom: `${anotherOffset}%`}" class="top-pane" :class="paneClasses">
        <slot name="top"/>
      </div>
      <div :class="`${prefix}-trigger-con`" :style="{top: `${offset}%`}" @mousedown="handleMousedown">
        <slot name="trigger">
          <trigger mode="horizontal"/>
        </slot>
      </div>
      <div :style="{top: `${offset}%`}" class="bottom-pane" :class="paneClasses">
        <slot name="bottom"/>
      </div>
    </div>
  </div>
</template>

<script>
import { oneOf, on, off } from './utils'
import Trigger from './trigger.vue'
export default {
  name: 'Split',
  components: {
    Trigger
  },
  props: {
    // 分割比例
    value: {
      type: [Number, String],
      default: 0.5
    },
    // 分割模式
    mode: {
      validator (value) {
        return oneOf(value, ['horizontal', 'vertical'])
      },
      default: 'horizontal'
    },
    // 最小分割点
    min: {
      type: [Number, String],
      default: '40px'
    },
    // 最大分割点
    max: {
      type: [Number, String],
      default: '40px'
    }
  },
  /**
   * Events
   * @on-move-start
   * @on-moving 返回值：事件对象，但是在事件对象中加入了两个参数：atMin(当前是否在最小值处), atMax(当前是否在最大值处)
   * @on-move-end
   */
  data () {
    return {
      // 类名前缀
      prefix: 'my-split',
      offset: 0,
      oldOffset: 0,
      isMoving: false
    }
  },
  computed: {
    // Build ClassName
    wrapperClasses () {
      return [
        `${this.prefix}-wrapper`,
        this.isMoving ? 'no-select' : ''
      ]
    },
    paneClasses () {
      return [
        `${this.prefix}-pane`,
        {
          [`${this.prefix}-pane-moving`]: this.isMoving
        }
      ]
    },
    isHorizontal () {
      return this.mode === 'horizontal'
    },
    anotherOffset () {
      return 100 - this.offset
    },
    valueIsPx () {
      return typeof this.value === 'string'
    },
    offsetSize () {
      return this.isHorizontal ? 'offsetWidth' : 'offsetHeight'
    },
    computedMin () {
      return this.getComputedThresholdValue('min')
    },
    computedMax () {
      return this.getComputedThresholdValue('max')
    }
  },
  methods: {
    px2percent (numerator, denominator) {
      return parseFloat(numerator) / parseFloat(denominator)
    },
    getComputedThresholdValue (type) {
      let size = this.$refs.outerWrapper[this.offsetSize]
      if (this.valueIsPx) {
        return typeof this[type] === 'string' ? this[type] : size * this[type]
      } else {
        return typeof this[type] === 'string' ? this.px2percent(this[type], size) : this[type]
      }
    },
    getMin (value1, value2) {
      if (this.valueIsPx) {
        return `${Math.min(parseFloat(value1), parseFloat(value2))}px`
      } else {
        return Math.min(value1, value2)
      }
    },
    getMax (value1, value2) {
      if (this.valueIsPx) {
        return `${Math.max(parseFloat(value1), parseFloat(value2))}px`
      } else {
        return Math.max(value1, value2)
      }
    },
    getAnotherOffset (value) {
      let res = 0
      if (this.valueIsPx) {
        res = `${this.$refs.outerWrapper[this.offsetSize] - parseFloat(value)}px`
      } else {
        res = 1 - value
      }
      return res
    },
    // 计算拖拽拉伸
    handleMove (e) {
      let pageOffset = this.isHorizontal ? e.pageX : e.pageY
      let offset = pageOffset - this.initOffset
      let outerWidth = this.$refs.outerWrapper[this.offsetSize]
      let value = this.valueIsPx ? `${parseFloat(this.oldOffset) + offset}px` : (this.px2percent(outerWidth * this.oldOffset + offset, outerWidth))
      let anotherValue = this.getAnotherOffset(value)
      if (parseFloat(value) <= parseFloat(this.computedMin)) {
        value = this.getMax(value, this.computedMin)
      }
      if (parseFloat(anotherValue) <= parseFloat(this.computedMax)) {
        value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax))
      }
      e.atMin = this.value === this.computedMin
      e.atMax = this.valueIsPx ? this.getAnotherOffset(this.value) === this.computedMax : this.getAnotherOffset(this.value).toFixed(5) === this.computedMax.toFixed(5)
      this.$emit('input', value)
      this.$emit('on-moving', e)
    },
    // 拖拽结束
    handleUp () {
      this.isMoving = false
      off(document, 'mousemove', this.handleMove)
      off(document, 'mouseup', this.handleUp)
      this.$emit('on-move-end')
    },
    // 拖拽开始
    handleMousedown (e) {
      this.initOffset = this.isHorizontal ? e.pageX : e.pageY
      this.oldOffset = this.value
      this.isMoving = true
      on(document, 'mousemove', this.handleMove)
      on(document, 'mouseup', this.handleUp)
      this.$emit('on-move-start')
    },
    computeOffset () {
      this.offset = (this.valueIsPx ? this.px2percent(this.value, this.$refs.outerWrapper[this.offsetSize]) : this.value) * 10000 / 100
    }
  },
  watch: {
    value () {
      this.computeOffset()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.computeOffset()
    })
    window.addEventListener('resize', this.computeOffset)
  },
  beforeDestroy () {
    // Remove listener
    window.removeEventListener('resize', this.computeOffset)
  }
}
</script>
<style scoped>

  .my-split-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .my-split-pane {
    position: absolute
  }

  .my-split-pane.left-pane, .my-split-pane.right-pane {
    top: 0;
    bottom: 0
  }

  .my-split-pane.left-pane {
    left: 0
  }

  .my-split-pane.right-pane {
    right: 0
  }

  .my-split-pane.bottom-pane, .my-split-pane.top-pane {
    left: 0;
    right: 0;
    overflow: auto;
  }

  .my-split-pane.top-pane {
    top: 0;
  }

  .my-split-pane.bottom-pane {
    bottom: 0;
  }

  .my-split-pane-moving {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .my-split-trigger {
    border: 1px solid #dcdee2
  }

  .my-split-trigger-con {
    position: absolute;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 10
  }

  .my-split-trigger-bar-con {
    position: absolute;
    overflow: hidden
  }

  .my-split-trigger-bar-con.vertical {
    left: 1px;
    top: 50%;
    height: 32px;
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    transform: translate(0, -50%)
  }

  .my-split-trigger-bar-con.horizontal {
    left: 50%;
    top: 1px;
    width: 32px;
    -webkit-transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0);
    transform: translate(-50%, 0)
  }

  .my-split-trigger-vertical {
    width: 6px;
    height: 100%;
    background: #f8f8f9;
    border-top: none;
    border-bottom: none;
    cursor: col-resize
  }

  .my-split-trigger-vertical .my-split-trigger-bar {
    width: 4px;
    height: 1px;
    background: rgba(23, 35, 61, .25);
    float: left;
    margin-top: 3px
  }

  .my-split-trigger-horizontal {
    height: 6px;
    width: 100%;
    background: #f8f8f9;
    border-left: none;
    border-right: none;
    cursor: row-resize
  }

  .my-split-trigger-horizontal .my-split-trigger-bar {
    height: 4px;
    width: 1px;
    background: rgba(23, 35, 61, .25);
    float: left;
    margin-right: 3px
  }

  .my-split-horizontal .my-split-trigger-con {
    top: 50%;
    height: 100%;
    width: 0
  }

  .my-split-vertical .my-split-trigger-con {
    left: 50%;
    height: 0;
    width: 100%
  }

  .my-split .no-select {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }
</style>
