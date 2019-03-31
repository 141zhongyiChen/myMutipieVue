<!--  This is a  template -->
<template>
  <div class="dialog-wrap">
    <div class="dialog-cover" v-if="isShow" ></div>

    <transition name="bounce">
      <div class="dialog-content" v-if="isShow">
        <p class="dialog-close"><button @click="closeMyself">Back</button></p>
        <div class="hr"></div>
        <!-- 插槽 ：与 组件标签中的内容 对接 -->
        <slot> This is a slot tag </slot>
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
    }
  },
  data () {
    return {
    }
  },
  methods: {
    closeMyself () {
      this.$emit('on-close-dialog')
    }
  }
}
</script>

<!-- Inward styles -->
<style scoped>

  /* the outermost element */
  .dialog-wrap{
    width: 100%;  height: 100%;
  }
  /*  dialog-cover style 遮罩层 */
  .dialog-cover{
    position: fixed;  top: 0;  left: 0;
    background: #000; opacity: .3; filter: opacity(30);
    width: 100%;  height: 100%;
    z-index: 5;
  }

  /*  transition && transform */
  .drop-enter{
    transform: translateY(-500px);
  }
  .drop-enter-active{
    transition:all .7s ease;
  }
  .drop-leave-active{
    transform: translateY(-500px);
    transition:all .5s ease;
  }

  /* test */
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
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
  /* test */
  /*  dialog-content */
  .dialog-content{
    width: 50%;max-height: 50%;   /* max-height 属性设置，元素实际没有高度，导致不显示 */
    position: fixed;  top: 20%;  left: 50%; margin-left: -25%;z-index: 10;  /* 居中实现 */
    background: bisque;border:2px solid #464068;padding: 2%;
    line-height: 1.6;
    /*
      line-height:1.5em ==>父元素行高为1.5em, 会根据子元素的字体大小动态计算出行高值让子元素继承
        子元素字体大小为 30px , 子元素行高为 ： 30*1.5 = 45px
    */
  }

  /*  dialog-close*/
  .dialog-close{
    position: absolute;  top: 4px;  right: 26px;   /* 以 dialog-content 为 参照 */
  }
  .dialog-close button{
    cursor: pointer;
    border-radius: 5px;
  }
  .dialog-close button:hover{
    color: lightcoral;
    background: lightskyblue;
  }
  /**/
  .hr{
    width: 100%;
    border-top:2px solid blue;
  }
</style>
