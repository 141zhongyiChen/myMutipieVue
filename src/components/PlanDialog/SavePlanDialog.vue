<template>
 <div>
   <Modal
     v-model="isShowDialog"
     :mask-closable="false"
     width="800px"
   >
     <p  style="color:purple;font-size: 20px;font-weight: bold;height: 36px;line-height: 36px;" slot="header">{{dialogTitle}}</p>
     <div style="height:400px;">
       <changtable ref="planTable"></changtable>
     </div>
     <div slot="footer">
       <Button type="primary" size="small"    @click="deleteCurentRowClick" ><span style="color: #fff;">删除选中项</span></Button>
       <Button type="primary"  size="small"   @click="clearAllRowClick"><span style="color: #fff;">清除所有项</span></Button>
       <Button type="primary" size="small"    @click="save(1)"  style="margin-left: 125px;"><span style="color: #fff;">保存为人工关灯预案</span></Button>
       <Button type="primary"  size="small"   @click="save(2)"><span style="color: #fff;">保存为定时执行关灯预案</span></Button>
     </div>
   </Modal>
   <Modal
     v-model="modal1"
     :mask-closable="false"
     width="500px"
     id="dialog2"
   >
     <p  style="padding-left:2px;color:#fff;font-size: 22px;font-weight: bold;height: 36px;background-color:#007ACC;line-height:36px;width:500px;margin-left:-16px;margin-top:-15px;" slot="header">
       {{dialogHeader}}</p>
     <div class="fontSizeClass" style="height:auto;width:500px;margin-left: -16px;margin-top: -40px;">
       <p style="text-align: center">
         <input id="radNew" type="radio" @click="radioChecked(true)"  name="rad"
                Checked="isAddNew"/><span style="margin-right: 80px;">保存新的预案</span>
         <input   type="radio"  @click="radioChecked(false)" name="rad"  /><span>覆盖旧的预案</span>
       </p>
       <p style="margin-left: 15px;margin-top: 20px;" v-if="!isAddNew"><span>覆盖预案：</span>
         <select id="selectPlan" style="width: 350px;height: 30px;font-size: 15px;" >
           <option v-for="planInfo in listPlanInfo" :key="planInfo.PlanCode">{{planInfo.PlanName}}</option>
         </select>
       </p>
       <p style="margin-left: 15px;margin-top: 20px;"><span>预案名称：</span> <input v-model="planName" type="text"
        style="width: 350px;height: 30px;line-height: 30px;"/> </p>
       <p style="margin-left: 15px;margin-top: 16px;"><span>预案说明：</span> <input v-model="planDescript" type="text" style="width: 350px;height: 30px;line-height: 30px;"/> </p>
       <div v-if="showTimeDesign" style="margin: 15px;border:1px solid silver;padding-bottom: 15px;">
         <span style="color:blue;position: relative; top: -15px; left: 30px; background-color: #EDEDED;">时间设置</span>
         <p>
           <span class="classSpan">
           <input type="radio" name="timeRad" @click="timingTypeCode = 1" Checked/> 每隔
         </span>
           <input type="text" v-model="minute" style="width:100px;margin-right: 5px;height: 30px;line-height: 30px;" /><span style="color:blue;">分钟</span>
         </p>
         <p>
           <span  class="classSpan"><input type="radio" name="timeRad" @click="timingTypeCode = 2"/> 每天</span>
           <input type="time"  v-model="timeSpan" style="width:100px;margin-right: 5px;height: 30px;line-height: 30px;" />
         </p>
         <p>
           <span  class="classSpan"><input type="radio" name="timeRad" @click="timingTypeCode = 3"/> 每周</span>
           <select id="cboWeek" style="font-size:15px;height: 30px;width:60px;text-align: center">
             <option value="0">周日</option>
             <option value="1">周一</option>
             <option value="2">周二</option>
             <option value="3">周三</option>
             <option value="4">周四</option>
             <option value="5">周五</option>
             <option value="6">周六</option>
           </select>
           <input type="time" v-model="weekTimespan" style="width:100px;margin-right: 5px;height: 30px;line-height: 30px;font-size:15px;" />
         </p>
         <p>
           <span  class="classSpan"><input type="radio" name="timeRad" @click="timingTypeCode = 4"/> 每月</span>
           <select id="cboMonthDay" style="font-size:15px;height: 30px;width:60px;">
             <option>1</option>
             <option>2</option>
             <option>3</option>
             <option>4</option>
             <option>5</option>
             <option>6</option>
             <option>7</option>
             <option>8</option>
             <option>9</option>
             <option>10</option>
             <option>11</option>
             <option>12</option>
             <option>13</option>
             <option>14</option>
             <option>15</option>
             <option>16</option>
             <option>17</option>
             <option>18</option>
             <option>19</option>
             <option>20</option>
             <option>21</option>
             <option>22</option>
             <option>23</option>
             <option>24</option>
             <option>25</option>
             <option>26</option>
             <option>27</option>
             <option>28</option>
             <option>29</option>
             <option>30</option>
             <option>31</option>
           </select>
           <input type="time" v-model="monthTimespan" style="width:100px;margin-right: 5px;height: 30px;line-height: 30px;" />
         </p>
         <p>
           <span  class="classSpan"><input type="radio" name="timeRad" @click="timingTypeCode = 5"/> 指定时间</span>
           <DatePicker type="datetime" @on-change="selectedSpecialTime" format="yyyy-MM-dd HH:mm" placeholder="请输入指定时间" style="width:200px;font-size: 15px;line-height: 30px;height: 30px;"></DatePicker>
         </p>
       </div>
     </div>
     <div slot="footer">
       <button  @click="cancel()" style="font-size:18px;color: #fff;width:75px;background-color: #2D8CF0;height: 30px;border:1px solid white;">退出</button>
       <button @click="MakesureSavePlan" style="font-size:18px;color: #fff;width:75px;background-color: #2D8CF0;height: 30px;border:1px solid white;"> 确定</button>
     </div>
   </Modal>
 </div>
</template>
<script>
import changtable from 'components/table/changeTable'
import 'vue'
import 'iview'
import 'jquery'
export default {
  components: {
    changtable
  },
  data () {
    return {
      switchLampList: [],
      isShowDialog: false,
      modal1: false,
      planTableHeaders: [
        {
          title: '控制箱名称',
          key: '0',
          width: 200
        },
        {
          title: '控制箱编码',
          key: '1',
          width: 200
        },
        {
          title: 'K路序号',
          key: '2',
          width: 120
        },
        {
          title: ' ',
          key: 'end'
        }
      ],
      dialogTitle: '预案详情',
      planName: '',
      planDescript: '',
      isAddNew: true,
      planType: 1, // 1为人工预案 2为定时执行预案
      listPlanInfo: [], // 旧预案下拉列表数据源
      dialogHeader: '保存人工预案',
      showTimeDesign: false,
      TimePlanInfo: [], // 旧的定时预案数据源
      PeoplePlanInfo: [],
      timingTypeCode: 1,
      minute: 15,
      timeSpan: '00:00',
      weekTimespan: '00:00',
      monthTimespan: '00:00',
      specialTime: (function () {
        var now = new Date()
        var month = (now.getMonth() + 1) > 12 ? '01' : (now.getMonth() + 1) > 9 ? (now.getMonth() + 1).toString() : ('0' + (now.getMonth() + 1))
        var date = now.getDate() > 9 ? now.getDate().toString() : ('0' + now.getDate())
        var hour = now.getHours() > 9 ? now.getHours().toString() : ('0' + now.getHours())
        var miniute = now.getMinutes() > 9 ? now.getMinutes().toString() : ('0' + now.getMinutes())
        // var second = now.getSeconds() > 9 ? now.getSeconds().toString() : ('0' + now.getSeconds())
        var timeFormat = now.getFullYear() + '-' + month + '-' + date + 'T' + hour + ':' + miniute // 2022-02-04T01:00
        return timeFormat
      }()
      )
    }
  },
  watch: {
  },
  methods: {
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$data.modal1 = false
    },
    deleteCurentRowClick () {
      if (this.$refs.planTable.$data.currentRowIndex >= 0) {
        this.$refs.planTable.$data.tdData.splice(this.$refs.planTable.$data.currentRowIndex, 1)
      } else {
        this.$Message.info({
          content: '请选中需要删除的行',
          duration: 3
        })
      }
    },
    clearAllRowClick () {
      this.$refs.planTable.$data.tdData.splice(0, this.$refs.planTable.$data.tdData.length)
    },
    initPlanInfo (planTableHeaders, h) {
      if (planTableHeaders === null) {
        this.$refs.planTable.initTableData(this.$data.planTableHeaders, null, h, '预案导出')
      } else { this.$refs.planTable.initTableData(planTableHeaders, null, h, '预案导出') }
    },
    initPlanRowDataSource (curentData, h) {
      this.$refs.planTable.initTableData(null, curentData, h, '')
    },
    save (val) {
      this.$data.modal1 = true
      this.$data.planType = val
      this.$data.isAddNew = true
      if (val === 1) {
        this.$data.showTimeDesign = false
        this.$data.dialogHeader = '保存人工预案'
        this.$data.listPlanInfo = this.$data.PeoplePlanInfo
      } else {
        this.$data.showTimeDesign = true
        this.$data.dialogHeader = '保存定时预案'
        this.$data.listPlanInfo = this.$data.TimePlanInfo
      }
    },
    MakesureSavePlan () {
      var timeSpan = ''
      if (this.$data.planName.length < 1) {
        this.$Message.info('请输入预案名称后在重试！')
      } else {
        if (this.$refs.planTable.$data.tdData.length < 1 && this.$data.switchLampList.length < 1) {
          this.renderFunc(100, 50, '当前没有可以保存的关灯预案！')
        } else {
          var SwitchLampDetailBase = ''
          if (this.$data.switchLampList.length > 0 && this.$refs.planTable.$data.tdData.length < 1) {
            SwitchLampDetailBase = this.$data.switchLampList
          } else {
            this.$refs.planTable.$data.tdData.map((item, index) => {
              SwitchLampDetailBase += '{2:' + item['1'] + ',3:' + item['2'] + ',4:0};'
            })
            SwitchLampDetailBase = SwitchLampDetailBase.slice(0, SwitchLampDetailBase.length - 1)
          }
          if (this.$data.planType === 2) {
            var tip = null
            var arr = null
            var index = -1
            switch (this.$data.timingTypeCode) {
              case 1:
                if (isNaN(this.$data.minute) === true || Number(this.$data.minute) <= 0) { tip = '请输入时间间隔后，再重试！' }
                break
              case 2:
                arr = this.$data.timeSpan.split(':')
                timeSpan = this.$data.timeSpan
                if (arr.length < 2 || (isNaN(arr[0]) || isNaN(arr[1]))) { tip = '请每天的预案执行时间后，再重试！' }
                break
              case 3:
                index = document.getElementById('cboWeek').selectedIndex
                timeSpan = this.$data.weekTimespan
                arr = this.$data.weekTimespan.split(':')
                if (index < 0 || (isNaN(arr[0]) || isNaN(arr[1]))) { tip = '请输入每周的执行时间后，再重试！' }
                break
              case 4:
                index = document.getElementById('cboMonthDay').selectedIndex
                timeSpan = this.$data.monthTimespan
                arr = this.$data.monthTimespan.split(':')
                if (index < 0 || (isNaN(arr[0]) || isNaN(arr[1]))) { tip = '请输入每月的执行时间后，再重试！' }
                break
              case 5:
                var r = this.$data.specialTime.replace(/[/]/, '').replace(/T/g, '').replace(/:/g, '').replace(/-/g, '')
                if (isNaN(r)) { tip = '请输入指定的执行时间后，再重试！' }
                break
            }
            if (tip !== null) {
              this.$Message.info(tip)
            }
          }// this.$data.planType
          this.HandleKSwitchLampPlan(this.$data.planType, SwitchLampDetailBase, timeSpan)
        }
      }
    },
    HandleKSwitchLampPlan (type, SwitchLampDetailBase, timeSpan) {
      // type为1是保存人工预案
      var obj = this
      var data = this.$data
      // 保存人工预案处理
      if (type === 1) {
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'WaterLineParams.RequestWaterLineParams',
            planCode: data.isAddNew ? '' : data.listPlanInfo[document.getElementById('selectPlan').selectedIndex].PlanCode,
            planName: data.planName,
            planDescript: data.planDescript,
            depCode: window.depCode,
            SwitchLampDetailBase: SwitchLampDetailBase,
            method: 'SaveManualSwitchLampPlan'
          },
          timeout: 0,
          error: function (e) { obj.renderFunc(30, 250, '关灯预案保存失败，请重试！') },
          success: function (re) {
            console.log(re)
            obj.renderFunc(30, 250, re)
          }
        })
      } else if (type === 2) { // 保存定时预案处理
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'WaterLineParams.RequestWaterLineParams',
            planCode: data.isAddNew ? '' : data.listPlanInfo[document.getElementById('selectPlan').selectedIndex].PlanCode,
            planName: data.planName,
            planDescript: data.planDescript,
            depCode: window.depCode,
            SwitchLampDetailBase: SwitchLampDetailBase,
            method: 'SaveTimingSwitchLampPlan',
            timingTypeCode: data.timingTypeCode,
            minutes: data.minute,
            timeSpan: timeSpan,
            week: document.getElementById('cboWeek').selectedIndex,
            month: (document.getElementById('cboMonthDay').selectedIndex + 1).toString(),
            time: data.specialTime.replace(/T/g, ' ')
          },
          timeout: 0,
          error: function (e) { obj.renderFunc(30, 250, '关灯预案保存失败，请重试！') },
          success: function (re) {
            console.log(re)
            obj.renderFunc(30, 250, re)
          }
        })
      }
    },
    // 自定义消息提示框
    renderFunc (h, w, tip) {
      this.$Message.info({
        duration: 30,
        closable: true,
        render: h => {
          return h('div', {
            style: {
              textAlign: 'center',
              height: h + 'px',
              width: w + 'px'
            }
          }, [ h('span', tip) ], ' '
          )
        }
      })
    },
    radioChecked (val) {
      this.$data.isAddNew = val
      if (!val) {
        if (this.$data.listPlanInfo.length > 0) {
          this.$data.planName = this.$data.listPlanInfo[0]['PlanName']
          this.$data.planDescript = this.$data.listPlanInfo[0]['PlanLegend']
        } else {
          this.$Message.info('抱歉,当前用户没有旧预案,不能进行操作！')
          this.$data.isAddNew = true
          document.getElementById('radNew').checked = 'checked'
        }
      } else {
        this.$data.planName = ''
        this.$data.planDescript = ''
      }
    },
    selectedSpecialTime (val) {
      this.$data.specialTime = val
      console.log(val)
    }
  },
  mounted () {
    var obj = this.$data
    this.$refs.planTable.saveFileName = '预案信息'
    // 加载旧的人工预案信息
    $.ajax({
      url: window.dataURL,
      type: 'POST',
      data: {
        active: 'WaterLineParams.RequestWaterLineParams',
        method: 'GetManualSwitchLampPlanData',
        depCode: window.depCode
      },
      dataType: 'json',
      timeout: 0,
      error: function (r) { console.log('旧的人工预案数据源加载失败!') },
      success: function (re) {
        obj.PeoplePlanInfo = re
      }
    })
    // 加载旧的定时预案信息
    $.ajax({
      url: window.dataURL,
      type: 'POST',
      data: {
        active: 'WaterLineParams.RequestWaterLineParams',
        method: 'GetManualSwitchLampPlanData',
        depCode: window.depCode,
        isTimePlan: 'true'
      },
      dataType: 'json',
      timeout: 0,
      error: function (r) { console.log('就的定时预案数据源加载失败!') },
      success: function (re) {
        obj.TimePlanInfo = re
      }
    })
  }
}
</script>
<style>
  #dialog2 .ivu-modal div{
    background-color:#EDEDED;
  }
  #dialog2 .ivu-modal span{
    font-size: 15px;
  }
  #dialog2 .ivu-modal input{
    line-height: 25px;
  }
  #dialog2 .ivu-modal-body div>div{
    margin-left: 15px;
  }
  #dialog2 .ivu-modal div>div>p{
    margin-top: 15px;
  }
  #dialog2 .ivu-modal .classSpan{
    width:88px;
    display: inline-block;
    margin-left: 15px;
  }
  .fontSizeClass *{
    font-size: 15px;
  }
</style>
