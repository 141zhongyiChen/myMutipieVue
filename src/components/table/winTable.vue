<template>
  <div  >
    <Modal class="cl_Modal"
           v-model="isShowDialog"
           :mask-closable="false"
           :width="width"
    >
      <p  style="color:purple;font-size: 20px;font-weight: bold;height: 36px;line-height: 36px;" slot="header">{{dialogTitle}}</p>
      <div style="overflow: auto;">
        <changtable ref="winTable"  :style="'width:' + tableW + 'px'"></changtable>
      </div>
    </Modal>
  </div>
</template>

<script>
import changtable from './changeTable'
export default {
  name: 'winTable',
  components: {changtable},
  data: function() {
    return {
      dialogTitle: '',
      isShowDialog: false,
      width: '1200px',
      Colnums: [],
      Rows: [],
      tableW: 1200
    }
  },
  watch: {
    isShowDialog(val) {
      if (!val) {
        this.$emit('okEvent')
      }
    },
    Colnums (val) {
      this.$refs.winTable.tdCols = val
    },
    Rows (val) {
      this.$refs.winTable.tdData = val
    }
  }
}
</script>

<style scoped>

</style>
