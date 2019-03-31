<template>
  <div class="loading">
    <img width="30" height="30" src="./loading.gif">
    <p class="desc">{{ title }}</p>
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  },
  components: {
  }
}
</script>
<style scoped >
  .loading {
    width: 100%;
    text-align: center;
  }
  .desc {
    line-height: 20px;
    font-size: 12px;
    color: #008000
  }
</style>
