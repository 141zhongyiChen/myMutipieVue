<template>
  <div class="selection-component">
    <button
       class="selection-show"
       :disabled="!allowedFlag"
       :class="!allowedFlag ? 'no-allowed' : 'allow-select'"
       @click="toggleDrop">
      <span>{{ selections[nowIndex].value }}</span>
      <div class="arrow"></div>
    </button>
    <div class="selection-list" v-if="isDrop">
      <transition-group tag="ul" name="staggered-fade"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave">
        <li v-for="(item, index) in selections" @mousedown="chooseSelection(index)" :key="index"
            :id="index === nowIndex && item.value !== '' ? 'active' : ''">
          {{ item.value }}
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate'
export default {
  props: {
    selections: {
      type: Array,
      default () {
        return [{
          value: ''
        }]
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    allowedFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    activeIndex (newVal) {
      this.nowIndex = newVal
      if (this.isDrop === true) {
        this.isDrop = false
      }
    },
    allowedFlag (newVal) {
      this.allowedFlag = newVal
      this.isDrop = false
      let _this = this
      document.addEventListener('mouseup', function () {
        _this.isDrop = false
      }, false)
    }
  },
  data () {
    return {
      isDrop: false,
      nowIndex: 0
    }
  },
  methods: {
    toggleDrop () {
      this.isDrop = !this.isDrop
    },
    chooseSelection (index) {
      this.nowIndex = index
      this.isDrop = false
      this.$emit('on-change', index)
    },
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
    }
  }
}
</script>

<style scoped>
.selection-component {
  position: relative;
  display: inline-block;
  width: 100px;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
}

.allow-select {
  cursor : pointer;
  /* border: 1px solid deepskyblue; */
  color: deepskyblue;
  line-height: 1;
  border: 1px solid deepskyblue;
}

.no-allowed {
  cursor: not-allowed;
  text-decoration: line-through;
  text-decoration-color: #8391a5;
  line-height: 1;
  opacity: .5;
  filter:alpha(opacity=50);
}

.selection-show {
 /* border: 1px solid #8391a5; */
  border: 1px solid grey;
  padding: 0 20px 0 10px;
  display: inline-block;
  position: relative;
  /* cursor: pointer; */
  height: 25px;
  line-height: 25px;
  border-radius: 4px;
  background: #fff;
  width: 100%;
}
.selection-show .arrow {
  display: inline-block;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid grey;
  width: 0;
  height: 0;
  /* margin-top: -1px;
  margin-left: 6px;
  margin-right: -14px;
  vertical-align: middle; */
  position: absolute;
  top: 40%;
  right: 4px;
}

.selection-show .arrow:hover {
  border-top: 5px solid deepskyblue;
}
.selection-list {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 25px;
  width: 100%;
  background: #fff;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  z-index: 99;
}
.selection-list li {
  text-align: center;
  line-height: 1;
  padding: 5px 15px 5px 10px;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  cursor: pointer;
  background: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
.selection-list li:hover, #active {
  background: #ffcd32;
}
</style>
