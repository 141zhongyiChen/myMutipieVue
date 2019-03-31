<template>
  <div id="LoadPlans" >
    <Modal class="cl_Modal"
           v-model="isShowDialog"
           :mask-closable="false"
           width="800px"
    >
      <p  style="color:purple;font-size: 20px;font-weight: bold;height: 36px;line-height: 36px;" slot="header">{{dialogTitle}}</p>
      <div style="height:511px;">
        <changtable ref="planTable"></changtable>
      </div>
      <div slot="footer" style="margin-top: 10px;">
        <Button type="primary"  size="small"   v-on:click="LoadPlanInfoHandler"><span style="color: #fff;font-size: 16px;">确定选中预案</span></Button>
        <Button type="primary" size="small"  v-if="btnDeleteShow"  @click="btnDelete"  style="margin-left: 16px;"><span style="color: #fff;font-size: 16px;">删除选中预案</span></Button>
        <Button type="primary"  size="small"   @click="isShowDialog=false"><span style="color: #fff;font-size: 16px;">返回</span></Button>
      </div>
    </Modal>
    <Modal class="cl_Modal" v-model="dialogShow" :mask-closable="false" >
      <p slot="header" style="padding-left: 2px;color: #fff; background-color: rgb(45, 140, 240); line-height: 32px; height: 32px;position: absolute;top: -1px;left: 0px;">
        温馨提示：
      </p>
      <div >
        <div >
          <p style="font-size: 16px;" v-html="tipText"></p>
        </div>
      </div>
      <div slot="footer">
        <Button  @click="dialogShow = false" style="font-size: 16px;color: #fff; background-color: #D6D8DB;width: 60px;height: 36px;">取消</Button>
        <Button  @click="okClick" style="font-size: 16px;color: #fff; background-color: #2D8CF0;width: 60px;height: 36px;">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import changtable from 'components/table/changeTable'
import 'jquery'
export default {
  name: 'LoadPlans',
  components: {
    changtable
  },
  data () {
    return {
      dialogTitle: '预案详情',
      tdHeaders: [],
      isShowDialog: false,
      tdRows: [],
      useDefault: true,
      planType: 0,
      dialogShow: false,
      tipText: '',
      okType: 0,
      btnDeleteShow: true

    }
  },
  watch: {
    tdHeaders (newval, oldval) {
      this.$refs.planTable.tdCols = newval
    },
    tdRows (newval, oldval) {
      var arr = []
      this.$refs.planTable.tdData = newval.length > 0 ? newval : arr
    }
  },
  mounted () {
    this.$refs.planTable.tableHeight = 413
    if (this.$data.useDefault) {
      this.$data.tdHeaders = [
        {
          title: '序号',
          key: 'num',
          width: 88
        },
        {
          title: '预案名称',
          key: 'PlanName',
          width: 320,
          align: 'left'
        },
        {
          title: '预案说明',
          key: 'PlanLegend',
          width: 400,
          align: 'left'
        }
      ]
    }
  },
  methods: {
    setTitleAndRows (type, title = '预案详情') {
      var my = this
      // this.$data.isShowDialog = true
      this.$data.planType = type
      this.$data.dialogTitle = title
      $.ajax({
        url: window.dataURL,
        type: 'POST',
        data: {
          active: 'WaterLineParams.RequestWaterLineParams',
          method: 'GetManualSwitchLampPlanData',
          depCode: window.depCode,
          isTimePlan: type === 2 ? 'true' : 'false'
        },
        dataType: 'json',
        error: function (e) {
          my.showTip(title + '信息加载失败！')
        },
        success (re) {
          console.log(window.depCode)
          my.$data.tdRows = re
        }
      })
    },
    showTip (text) {
      this.$Message.info({
        content: text,
        duration: 0,
        closable: true,
        onClose: function () {
        }
      })
    },
    showTheDialog (val, type, dialogTitle) {
      this.$data.tipText = val
      this.$data.okType = type
      this.$data.dialogTitle = dialogTitle
      this.$data.dialogShow = true
    },
    LoadPlanInfoHandler () {
      var my = this
      var index = this.$refs.planTable.currentRowIndex
      if (index < 0) {
        this.showTip('请选择预案再重试！')
        return
      }
      var PlanCode = this.$data.tdRows[index].PlanCode
      $.ajax({
        url: window.dataURL,
        type: 'POST',
        dataType: 'json',
        data: {
          active: 'WaterLineParams.RequestWaterLineParams',
          method: 'getPlanInfoBydepCode',
          Plancode: PlanCode,
          isTimePlan: this.$data.planType === 1 ? 'false' : 'true'
        },
        error: function () {
          my.showTip('选择预案信息加载失败！')
        },
        success: function (re) {
          my.$emit('updatePlanInfoEvent', re)
          my.$data.isShowDialog = false
        }
      })
    },
    btnDelete () {
      var planCode = ''
      var planName = ''
      if (this.$refs.planTable.currentRowIndex >= 0) {
        planCode = this.$refs.planTable.tdData[this.$refs.planTable.currentRowIndex].PlanCode
        planName = this.$refs.planTable.tdData[this.$refs.planTable.currentRowIndex].PlanName
      }
      this.deletePlanEvent(planCode, planName)
    },
    deletePlanEvent (planCode, planName) {
      if (planCode.length < 1) {
        alert('请选择您要删除的预案')
      } else { this.showTheDialog('您确定要删除' + planName + '预案？', 1, '温馨提示：') }
    },
    okClick () {
      this.$data.dialogShow = false
      var my = this
      console.log(my.$refs.planTable.tdData[my.$refs.planTable.currentRowIndex].PlanCode)
      $.ajax({
        url: window.dataURL,
        type: 'POST',
        dataType: 'json',
        data: {
          active: 'WaterLineParams.RequestWaterLineParams',
          method: 'DeleteManualSwitchLampPlan',
          Plancode: my.$refs.planTable.tdData[my.$refs.planTable.currentRowIndex].PlanCode,
          isTimePlan: this.$data.planType === 1 ? 'false' : 'true'
        },
        error: function () {
          alert('预案删除失败！')
        },
        success: function (re) {
          var i = Number(re)
          console.log(i)
          if (i > 0) {
            alert('预案删除成功！')
            my.$refs.planTable.tdData.splice(my.$refs.planTable.currentRowIndex, 1)
          } else {
            alert('预案删除失败！')
          }
        }
      })
    }
  }
}
</script>

<style  >
  .cl_Modal .ivu-modal-wrap{
    z-index: 1100 !important;
  }

</style>
