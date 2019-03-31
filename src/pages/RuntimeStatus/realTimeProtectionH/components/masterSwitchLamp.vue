<template>
  <div id="masterFrame">
    <p id="p_Fname" style="height: 24px;background:#EEEEF2; ">
      <span style="background-color:#007ACC;padding: 5px;color:#fff;font-size: 15px;">{{FunctionName}}</span>
    </p>
    <div id="left_Content" style="border: 1px solid #007ACC;border-top: 2px solid #007ACC; ">
      <div style="width:540px;float:left;margin-top: 10px;margin-left: 10px;">
        <button style="width:60px;float: right;margin: 56px 25px 0px 0px;" @click="btnMoveClick">{{btnText}}</button>
        <div style="border: silver 1px solid;width: 430px;">
          <span style="font-size: 14px;color:blue;position: relative;top: -14px;background: #fff;left: 15px;">控制箱的K路</span>
          <ul  >
            <li style="margin-bottom:26px; " v-for="(kGroupInfo, num) in allKGroupInfo" :key="num">
              <ul class="ul_X">
                <li style="" v-for="(onoff, index) in kGroupInfo" :key="index">
                  <input type="checkbox"  v-model="onoff.isEnabled"/>K{{onoff.kIndex}}
                  <ul style="margin-top: -36px;margin-left: 40px;">
                    <li>
                      <p v-bind:class="{ Silverp: !onoff.isEnabled}">
                        <input :disabled="!onoff.isEnabled" type="radio" :name="onoff.name" checked  @click="checkedOnOff(0,onoff.kIndex)"/>开灯
                      </p>
                      <p  v-bind:class="{ Silverp: !onoff.isEnabled}">
                        <input :disabled="!onoff.isEnabled" type="radio" :name="onoff.name" @click="checkedOnOff(1,onoff.kIndex)"/>关灯
                      </p>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <p style="margin:16px 0px;"><button @click="btnLoadPlan(1)">加载人工操作预案</button></p>
        <p><button @click="btnLoadPlan(2)">加载定时操作预案</button></p>
      </div>
      <div style="margin-left:550px;border:1px solid silver;padding: 3px;margin-top: 10px;">
        <span style="font-size: 14px;color:blue;position: relative;top: -14px;background: #fff;left: 15px;">预案内容详情</span>
        <changtable ref="mytable"> </changtable>
        <p style="margin:16px 20px;">
          <button @click="btndeleteIt">删除选中项</button>
          <button @click="btnRowClear" style="margin-left:35px;">清空预案内容</button>
        </p>
        <p>
          <button  @click="btnDoThisClick">立即执行</button>
          <button style="margin:5px 25px;"  @click="btn_savePlan(1)">保存为人工预案</button>
          <button @click="btn_savePlan(2)">保存为定时预案</button>
        </p>
      </div>
    </div>
    <LoadPlans ref="myPlans" v-on:updatePlanInfoEvent="updatePlanInfoEvent"   ></LoadPlans>
    <Modal  v-model="dialogShow" :mask-closable="false">
      <p slot="header" style="padding-left: 2px;color: #fff; background-color: rgb(45, 140, 240); line-height: 32px; height: 32px;position: absolute;top: -1px;left: 0px;">
        {{dialogTitle}}
      </p>
      <div >
        <div >
          <p style="font-size: 16px;" v-html="tipText"></p>
          <p v-if="isTipInput"><input type="password" v-model="InputPassword" style="line-height: 28px;width:464px"/></p>
          <div v-if="isShowIdentifyCode">
            <IdentifyCode v-on:IdentitySuccess="IdentitySuccess"></IdentifyCode>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button  @click="dialogCloseClick" style="font-size: 16px;color: #fff; background-color: #D6D8DB;width: 60px;height: 36px;">取消</Button>
        <Button  @click="okClick" v-if="showOkBut" style="font-size: 16px;color: #fff; background-color: #2D8CF0;width: 60px;height: 36px;">确定</Button>
      </div>
    </Modal>
    <savePlanDialog ref="saveDialog"/>
    <div class="div_alldisEnbale" v-if="isShowMarkLayer"></div>
  </div>
</template>
<script>
//import MainFrame from 'components/masterFrame/masterFrame'
import 'api/serverURL.config'
import {mapGetters} from 'vuex'
import changtable from 'components/table/changeTable'
import LoadPlans from 'components/PlanDialog/LoadPlans'
import {SendCommand} from 'common/js/CommandMethod/'
import savePlanDialog from 'components/PlanDialog/SavePlanDialog'
import IdentifyCode from 'components/IdentifyCode'
export default {
  props: {
    BoxHeight: {
      type: Number,
      default () {
        return 600
      }
    }
  },
  name: 'MasterSwitchLamp',
  components: {
    // MainFrame,
    changtable,
    LoadPlans,
    savePlanDialog,
    IdentifyCode
  },
  data () {
    return {
      FunctionName: '集中预案控制开关灯',
      planName: '',
      showOkBut: true,
      saveNewType: true,
      dialogShow: false,
      planLend: '关灯',
      tipText: '',
      dialogTitle: '温馨提示：',
      arrOldPlans: [],
      allKGroupInfo: [
        [
          {name: 'rd1', onchecked: true, offchecked: false, kIndex: 1, isEnabled: false},
          {name: 'rd2', onchecked: true, offchecked: false, kIndex: 2, isEnabled: false},
          {name: 'rd3', onchecked: true, offchecked: false, kIndex: 3, isEnabled: false},
          {name: 'rd4', onchecked: true, offchecked: false, kIndex: 4, isEnabled: false}
        ],
        [
          {name: 'rd5', onchecked: true, offchecked: false, kIndex: 5, isEnabled: false},
          {name: 'rd6', onchecked: true, offchecked: false, kIndex: 6, isEnabled: false},
          {name: 'rd7', onchecked: true, offchecked: false, kIndex: 7, isEnabled: false},
          {name: 'rd8', onchecked: true, offchecked: false, kIndex: 8, isEnabled: false}
        ]
      ],
      btnText: '>>',
      tdHeaders: [
        {
          title: '终端编码',
          key: 'terminalCode',
          align: 'center',
          width: 180
        },
        {
          title: '控制箱名称',
          key: 'name',
          align: 'center',
          width: 320
        },
        {
          title: '开关灯操作情况说明',
          key: 'listK',
          align: 'left',
          width: 420,
          render: function (h, param) {
            var arr = []
            if (param.row.listK.length > 0) {
              param.row.listK.map((item, i) => {
                var s = item.toString()
                var text = 'K' + s.charAt(0)
                // console.log()
                text += s.charAt(2).toString() === '0' ? '开灯' : '关灯'
                arr.push(h('span', {style: {padding: '0px 8px'}}, text))
              })
            }
            return h('div', arr, ' ')
          }
        },
        {
          title: '   ',
          key: 'end',
          align: 'center'
        }
      ],
      tdRowsData: [],
      checkedNodes: [],
      isShowMarkLayer: false,
      codesKindexs: [],
      InputPassword: '',
      codes: '',
      lastPlanType: 0,
      okType: 0, // 对话框的确定执行事件类型
      isTipInput: false,
      switchLampData: [],
      isCheckOpen: 0, // 进行立即执行操作是否需要进行明暗线的开灯范围判断
      isCheckClose: 0, // 进行立即执行操作是否需要进行明暗线的关灯范围判断
      isShowIdentifyCode: false //立即发送的第二步验证
    }
  },
  computed: {
    ...mapGetters('treeModule', [
      'respondData',
      'treeSelectedArr',
      'treeCheckedArr'
    ])
  },
  watch: {
    /*respondData (nodes) {
      var my = this
      this.$data.codes = ''
      if (nodes.length > 0) {
        nodes.map((item, i) => {
          this.$data.codes += item.objData.terminalCode + ','
          this.$data.codesKindexs.push(
            {
              terminalCode: item.objData.terminalCode,
              name: item.title,
              kindexs: []
            }
          )
        })
        this.$data.codes = this.$data.codes.substring(0, this.$data.codes.length - 1)
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'WaterLineParams.RequestWaterLineParams',
            codes: this.$data.codes,
            method: 'getUsedKindexByTerminalCodes'
          },
          dataType: 'json',
          timeout: 0,
          error: function (e) {
            my.$Message.info('K路使用信息加载失败！')
          },
          success: function (re) {
            if (re.length > 0 && my.$data.codesKindexs.length > 0) {
              var arr = re
              while (arr.length > 0) {
                var index = 0
                var isBreak = false
                var i = arr.length - 1
                while (index < my.$data.codesKindexs.length && !isBreak) {
                  var item = my.$data.codesKindexs[index]
                  if (item.terminalCode === arr[i]['1']) {
                    item.kindexs.push(Number(arr[i]['2']))
                    isBreak = true
                  }
                  index++
                }
                arr.pop()
              }
            }
          }
        })
      }
    },*/
    treeCheckedArr (nodes) {
      this.$data.checkedNodes = nodes
    }
  },
  methods: {
    btn_savePlan (val) {
      if (this.$refs.mytable.tdData.length > 0) {
        var switchLampList = ''
        this.$refs.mytable.tdData.map((item, index) => {
          if (item.listK.length > 0) {
            item.listK.map((kInfo, num) => {
              switchLampList += 2 + ':' + item.terminalCode + ','
              switchLampList += 3 + ':' + kInfo.toString().charAt(0) + ','
              var state = kInfo.charAt(2).toString() === '0' ? 1 : 0
              switchLampList += 4 + ':' + state + ';'
            })
          }
        })
        if (switchLampList.length > 0) {
          switchLampList = switchLampList.toString().slice(0, switchLampList.length - 1)
        }
        this.$refs.saveDialog.switchLampList = switchLampList
        this.$refs.saveDialog.save(val)
      }
    },
    dialogCloseClick () {
      this.$data.dialogShow = false
      this.$data.InputPassword = ''
    },
    btnMoveClick () {
      // Add
      this.$data.checkedNodes = this.treeCheckedArr
      //
      if (this.$data.checkedNodes.length < 1) {
        this.showTip('至少勾选一个终端，在重试！')
      } else {
        if (this.$data.codesKindexs.length > 0) {
          this.$data.checkedNodes.map((node, index) => {
            var hasKIndex = false
            var hasCode = false
            var y = 0
            while (!hasCode && this.$data.tdRowsData.length > y) {
              if (this.$data.tdRowsData[y].terminalCode === node.objData.terminalCode) {
                hasCode = true
              } else { y++ }
            }
            if (!hasCode) {
              this.$data.tdRowsData.push(
                {
                  terminalCode: node.objData.terminalCode,
                  name: node.title,
                  listK: []
                }
              )
            }
            var j = 0
            while (this.$data.allKGroupInfo.length > j) {
              var listitem = this.$data.allKGroupInfo[j]
              j++
              var num = 0
              while (listitem.length > num) {
                var item = listitem[num]
                num++
                var isbreak = false
                var i = 0
                while (item.isEnabled && i < this.$data.codesKindexs.length > 0 && !isbreak) {
                  if (this.$data.codesKindexs[i].terminalCode === node.objData.terminalCode && this.$data.codesKindexs[i].kindexs.indexOf(item.kIndex) !== -1) {
                    isbreak = true
                    hasKIndex = true
                    var obj = item.kIndex + '|'
                    obj += item.onchecked === true ? 0 : 1
                    var a = 0
                    var k = item.kIndex.toString()
                    var isExist = false
                    while (!isExist && a < this.$data.tdRowsData[y].listK.length) {
                      if (this.$data.tdRowsData[y].listK[a].toString().charAt(0).toString() === k) { isExist = true } else { a++ }
                    }
                    if (isExist) {
                      this.$data.tdRowsData[y].listK.splice(a, 1)
                    } this.$data.tdRowsData[y].listK.push(obj)
                  }
                  i++
                }
              }
            }
            if (!hasKIndex) {
              this.$data.tdRowsData.splice(y, 1)
            }
          })
          this.$refs.mytable.tdData = this.$data.tdRowsData
        }
      }
    },
    showTip (text, durationTip) {
      if (durationTip === undefined) {
        durationTip = 0
      }
      var my = this
      this.$data.isShowMarkLayer = true
      this.$Message.info({
        content: text,
        duration: durationTip,
        closable: true,
        onClose: function () {
          my.$data.isShowMarkLayer = false
        }})
    },
    checkedOnOff (checkedType, kindex) {
      if (kindex < 5) {
        this.$data.allKGroupInfo[0][kindex - 1].onchecked = checkedType === 0
        this.$data.allKGroupInfo[0][kindex - 1].offchecked = checkedType === 1
      } else {
        this.$data.allKGroupInfo[0][kindex - 1].onchecked = checkedType === 0
        this.$data.allKGroupInfo[0][kindex - 1].offchecked = checkedType === 1
      }
    },
    btnLoadPlan (type) {
      var title = type === 1 ? '开关灯人工预案' : '开关灯定时预案'
      this.$refs.myPlans.setTitleAndRows(type, title)
      if (this.$data.lastPlanType !== type) {
      }
      this.$data.lastPlanType = type
      this.$refs.myPlans.isShowDialog = true
    },
    updatePlanInfoEvent (data) {
      this.$data.tdRowsData = []
      if (data.length > 0) {
        data.map((item, index) => {
          var rowIndex = 0
          var isContinue = true
          var obj = item.kIndex + '|'
          obj += item.isOnLight.toString() === 'true' ? 0 : 1
          while (isContinue && this.$data.tdRowsData.length > rowIndex) {
            if (this.$data.tdRowsData[rowIndex].terminalCode.toString() === item.terminalCode.toString()) {
              isContinue = false
            } else { rowIndex++ }
          }
          if (isContinue) {
            this.$data.tdRowsData.push(
              {
                terminalCode: item.terminalCode,
                name: item.TerminalName,
                listK: []
              }
            )
          }
          this.$data.tdRowsData[rowIndex].listK.push(obj)
        })
      }
      this.$refs.mytable.tdData = this.$data.tdRowsData
    },
    btndeleteIt () {
      var i = this.$refs.mytable.currentRowIndex
      if (i < 0) {
        this.showTip('请选择要删除项，在重试！')
        return
      }
      this.$data.tdRowsData.splice(i, 1)
      this.$refs.mytable.tdData.splice(i, 1)
    },
    btnRowClear () {
      this.$data.tdRowsData = []
      this.$refs.mytable.tdData = []
    },
    okClick () {
      this.$data.isLineLimit = 0
      var my = this
      if (this.$data.okType === 1) { //  确定执行立即执行操作
        var text = '<span style="font-size:14px; "> 当前用户：</span><span style="font-size:14px; color: purple;"> ' + window.userName + '</span><br/>'
        text += '<span style="font-size:14px;" >请再次输入当前用户密码进行验证</span>'
        this.showTheDialog(text, 2, true, '信息验证')
      } else if (this.$data.okType === 2) {
        // 进行立即执行的用户操作权限的密码验证 确定操作
        if (this.$data.InputPassword.length < 1) {
          this.showTip('请输入密码！')
          return
        }
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'WaterLineParams.RequestWaterLineParams',
            method: 'SitchLightCheckAuthenticationFromUser',
            userCode: window.userCode,
            depCode: window.depCode,
            password: this.$data.InputPassword,
            isCheckOpen: this.$data.isCheckOpen,
            isCheckClose: this.$data.isCheckClose
          },
          error: function () {
            my.showTip('验证失败，当前开关灯操作被取消！') //, this.$data.okType, false, '温馨提示：')
          },
          success: function (re) {
            my.$data.InputPassword = ''
            if (re.toString() === '0') { // 当前用户密码验证失败
              my.showTip('您的密码有误，请重新输入！')
            } else if (re.toString() === '1') { // 当前用户密码验证成功，并且当前时间在明暗线范围内，不需要进行上级验证
              my.$data.dialogShow = false
              my.showTip('您的验证通过,开关灯操作正在执行...', 10)
              my.doSendCommand()
            } else if (re.toString() === '2') { // 当前用户密码验证成功，并且当前时间不在明暗线范围内，需要进行上级验证
              /* text = '<span style="font-size:14px; color:purple;"> 不在预设的开关灯时间范围内，不允许本次操作。</span><br/>'
                text += '<span style="font-size:14px;" >请输入<b style="font-size:14px; color:blue;">上级</b>机构(部门)负责人的密码进行确认。</span>'*/
              my.showTheDialog(text, 3, false, '验证码验证', true)
            }
          }
        })
      } else if (this.$data.okType === 3) { // 当前用户上级密码验证
        if (this.$data.InputPassword.length < 1) {
          this.showTip('请输入密码！')
          return
        }
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'WaterLineParams.RequestWaterLineParams',
            method: 'SitchLightCheckAuthenticationFromSuperior', // (String password, String userCode, String departmentCode, Boolean userIsInCharge)
            userCode: window.userCode,
            depCode: window.depCode,
            password: this.$data.InputPassword,
            userIsInCharge: 'true'
          },
          error: function () {
            my.showTip('验证失败，当前开关灯操作被取消！') //, this.$data.okType, false, '温馨提示：')
          },
          success: function (re) {
            my.$data.InputPassword = ''
            if (re.toString() === '0') { // 当前用户密码验证失败
              my.showTip('验证失败，当前开关灯操作被取消！')
            } else if (re.toString() === '1') { // 当前用户密码验证成功，并且当前时间在明暗线范围内，不需要进行上级验证
              my.$data.dialogShow = false
              my.showTip('您的验证通过,开关灯操作正在执行...', 10)
              my.doSendCommand()
            }
          }
        })
      } else if (this.$data.okType === 4) {
      }
    },
    IdentitySuccess() {
      this.doSendCommand()
    },
    btnDoThisClick: function () {
      this.$data.isCheckOpen = 0
      this.$data.isCheckClose = 0
      this.$data.switchLampData = []
      if (this.$refs.mytable.tdData.length > 0) {
        this.$refs.mytable.tdData.map((item, index) => {
          var arr = [0, 0, 0, 0, 0, 0, 0, 0]
          if (item.listK.length > 0) {
            item.listK.map((K, i) => {
              var a = Number(K.toString().charAt(0, 1))
              var strK = K.toString().charAt(2, 1)
              arr[a - 1] = strK === '1' ? 2 : 1 // 2位关，1为开
              if (strK === '1') {
                this.$data.isCheckClose = 1
              } else { this.$data.isCheckOpen = 1 }
            })
          }
          var j = 0
          var operationDictionary = []
          while (j < 8) {
            var keyvalue = (j + 7) + ':' + arr[j]
            operationDictionary.push(keyvalue)
            j++
          }
          this.$data.switchLampData.push({terminalCode: item.terminalCode, values: operationDictionary})
        })
        this.showTheDialog(' 确定要立即执行开关灯预案？', 1, false, '温馨提示：')
      } else { this.showTip('当前预案列表没有可执行的数据！') }
    },
    showTheDialog (val, type, isTipInput, dialogTitle, isShowIdentifyCode) {
      this.$data.tipText = val
      this.$data.okType = type
      this.$data.isTipInput = isTipInput
      this.$data.dialogTitle = dialogTitle
      this.$data.dialogShow = true
      this.showOkBut = true
      if (isShowIdentifyCode === true) {
        this.isShowIdentifyCode = true
        this.showOkBut = false
      } else {
        this.isShowIdentifyCode = false
      }
    },
    doSendCommand () {
      var my = this
      if (this.$data.switchLampData.length > 0) {
        var strDataDictionary = JSON.stringify(this.$data.switchLampData)
        if (strDataDictionary.length > 10) {
          /* $.ajax({
              url: window.dataURL,
              type: 'POST',
              data: {
                active: 'CommandMethods.Main',
                method: 'SendCommand',
                tableName: 'w_0356000',
                DataDictionary: strDataDictionary,
                depCode: window.depCode,
                userCode: window.userCode
              },
              error: function (e) {
                my.showTip('开关灯指令操作发送失败！')
              },
              success: function (re) {
                console.log(re)
              }
            }) */
          SendCommand('w_0356000', strDataDictionary).then((re) => {
            var i = Number(re)
            if (i > 0) {
              my.showTip('开关灯指令操作发送成功！')
            } else { my.showTip('开关灯指令操作发送失败！') }
            // console.log(re)
          }).catch(() => {
            my.showTip('开关灯指令操作发送失败！')
          })
        }
      }
    },
    //
    //
    _getData (nodes) {
      var my = this
      this.$data.codes = ''
      if (nodes.length > 0) {
        nodes.map((item, i) => {
          this.$data.codes += item.objData.terminalCode + ','
          this.$data.codesKindexs.push(
            {
              terminalCode: item.objData.terminalCode,
              name: item.title,
              kindexs: []
            }
          )
        })
        this.$data.codes = this.$data.codes.substring(0, this.$data.codes.length - 1)
        $.ajax({
          url: window.dataURL,
          type: 'POST',
          data: {
            active: 'WaterLineParams.RequestWaterLineParams',
            codes: this.$data.codes,
            method: 'getUsedKindexByTerminalCodes'
          },
          dataType: 'json',
          timeout: 0,
          error: function (e) {
            my.$Message.info('K路使用信息加载失败！')
          },
          success: function (re) {
            if (re.length > 0 && my.$data.codesKindexs.length > 0) {
              var arr = re
              while (arr.length > 0) {
                var index = 0
                var isBreak = false
                var i = arr.length - 1
                while (index < my.$data.codesKindexs.length && !isBreak) {
                  var item = my.$data.codesKindexs[index]
                  if (item.terminalCode === arr[i]['1']) {
                    item.kindexs.push(Number(arr[i]['2']))
                    isBreak = true
                  }
                  index++
                }
                arr.pop()
              }
            }
          }
        })
      }
    }
  },
  mounted () {
    this.$refs.mytable.codeKey = 'terminalCode'
    // var h = document.body.clientHeight - 200 - 200
    // var h = document.body.clientHeight - 200 - 200
    // this.$refs.mytable.tableHeight = h
    this.$refs.mytable.tableHeight = this.BoxHeight - 260
    this.$refs.mytable.excImprot = false
    this.$refs.mytable.tdCols = this.$data.tdHeaders
    // 获取数据
    this._getData(this.respondData)
    //
    $.ajax({
      url: window.dataURL,
      type: 'POST',
      data: {
        active: 'CommonMethod.Main',
        method: 'SelAnyTFields',
        t: 'w_0037000',
        f: 'Field1',
        w: " code='" + window.userCode + "'"
      },
      error: function(e) {
        console.log('集中预案控制开关灯用户名加载失败!')
      },
      success: function (re) {
        var json = JSON.parse(re)
        if (json.length > 0 && json[0].Field1 !== undefined) {
          window.userName = json[0].Field1
        }
      }
    })
  }
}
</script>

<style scoped>
  #masterFrame {
    width: 100%;
  }
  #masterFrame #left_Content ul{
    list-style: none;
  }
  #masterFrame .ul_X > li{
    display: inline-block;
    margin-left: 16px;
  }
  #masterFrame #left_Content .Silverp{
    color:silver;
  }
  #masterFrame .div_alldisEnbale{
    position: absolute;
    top: 0px;
    height: 98%;
    width: 100%;
    background-color: #000000;
    opacity: 0.1;
  }
  #masterFrame .ivu-message-notice-content{
    height: 100px;
    margin-top: 200px;
  }
  #masterFrame .ivu-message-notice-content-text{
    margin-top: 30px;
  }

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
</style>
