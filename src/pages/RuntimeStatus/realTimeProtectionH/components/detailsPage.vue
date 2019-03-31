<template>
  <div id="dialog-wrapper" :style="{width: width}">
    <transition name="bounce">
      <div class="dialog-content" v-if="isShow">
        <p style="position: relative" class="btn-wrapper">
          <Button class="dialog-close" @click="closeMyself">返回</Button>
        </p>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<!-- Script -->
<script>
export default {
  props: {
    // 约定 变量的类型 与 初始值
    isShow: {
      type: Boolean,
      default: false
    },
    //
    width: {
      type: String,
      default () {
        return '86%'
      }
    }
    //
  },
  data () {
    return {
      // pageHeight: 600,
      // pageWidth: 800
    }
  },
  methods: {
    closeMyself () {
      this.$emit('on-close-dialog')
    }
    // todo 监听浏览器窗口变化 begin
    /*onResize () {
      let _this = this
      window.addEventListener('resize', _this.handleResize)
    },*/
    /*handleResize (event) {
      // this.pageHeight = document.documentElement.pageHeight * 70 / 100
    }*/
    // todo 监听浏览器变化 end
  },
  mounted () {
    // this.handleResize()
    //this.onResize()
  }
}
</script>

<!-- Inward styles -->
<style scoped>

  #dialog-wrapper {
    overflow: scroll;
    /*width: 60%;*/
    overflow: scroll;
    position: absolute; top:50%; left: 50%;
    transform:translate(-50%, -50%);
    z-index: 50;
    background: #ffffff;
    border: 1px solid #464068;
    padding: 0 1%;
  }
  /*  transition && transform */
  #dialog-wrapper .drop-enter{
    transform: translateY(-500px);
  }
  #dialog-wrapper .drop-enter-active{
    transition:all .7s ease;
  }
  #dialog-wrapper .drop-leave-active{
    transform: translateY(-500px);
    transition:all .5s ease;
  }

  #dialog-wrapper .bounce-enter-active {
    animation: bounce-in .5s;
  }
  #dialog-wrapper .bounce-leave-active {
    transform: scale(0);
    transition: all .3s ease-in;
  }
  /*  自定义动画 */
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  #dialog-wrapper .dialog-content{
    width: 100%;
  }

  #dialog-wrapper .btn-wrapper {
    border-bottom: 1px solid blue;
    position: relative;
    height: 40px;
    margin-bottom: 6px;
  }

  #dialog-wrapper .dialog-close{
    position: absolute;  top: 4px;  right: 2px;
  }

  #dialog-wrapper .dialog-close button{
    cursor: pointer;
    border-radius: 5px;
  }

  #dialog-wrapper .dialog-close button:hover{
    color: lightcoral;
    background: lightskyblue;
  }
</style>
