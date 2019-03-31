<template>
  <div id="showSetting">
    <ul class="selection-wrapper">
      <!-- 当前用户 -->
      <!--<li>
        <strong class="selection-title">当前用户：</strong>
        <span class="option-result">{{ depCode }}</span>
      </li>-->
      <!-- 树列表类型 -->
      <li>
        <strong class="selection-title">树列表类型：</strong>
        <Select v-model="treeTypeCode" clearable style="width:200px" placeholder="请选择（必选）">
          <OptionGroup v-for="(group, gIndex) in treeTypeArr" :key="gIndex" :label="group.groupName">
            <Option v-for="(item, iIndex) in group.groupItems" :key="iIndex" :value="item.value"></Option>
          </OptionGroup>
        </Select>
        <span class="option-result">{{ treeTypeCode }}</span>
      </li>
      <!-- 需自定义的显示属性 -->
      <li v-if="objDataField.length">
        <strong class="selection-title">需自定义显示的属性：</strong>
        <Select v-model="attrName" clearable style="width:200px" placeholder="请选择（必选）">
          <Option v-for="item in objDataField" :value="item.toString()" :key="item">{{ item }}</Option>
        </Select>
        <span class="option-result">{{ attrName }}</span>
      </li>
      <!-- 属性字段的数据类型 -->
      <li>
        <strong class="selection-title">属性字段的数据类型：</strong>
        <Select v-model="attrType" clearable style="width:200px" placeholder="请选择（必选）">
          <Option v-for="item in attrTypeArr" :value="item.toString()" :key="item">{{ item }}</Option>
        </Select>
        <span class="option-result">{{ attrType }}</span>
      </li>
      <!-- 自定义显示的特定值 -->
      <li>
        <strong class="selection-title">自定义显示属性的特定值：</strong>
        <Select v-model="attrValue" clearable style="width:200px" placeholder="请选择（必选）">
          <Option v-for="item in fieldValue" :value="item.toString()" :key="item">{{ item }}</Option>
        </Select>
        <span class="option-result">{{ attrValue }}</span>
      </li>
      <!-- 需自定义显示的颜色值 -->
      <li>
        <strong class="selection-title">需自定义显示的颜色值：</strong>
        <span style="display: inline-block;width: 200px">
          <ColorPicker v-model="rgbaColor" format="rgb" recommend/>
        </span>
        <span class="option-result" :style="{color: rgbaColor}">{{ attrColor }}</span>
      </li>
    </ul>
    <!-- btn -->
    <div class="btn-wrapper">
      <Button class="submit"
              v-show="showConfirmBtn"
              @click="confirm">保存设置</Button>
      <Button :class="showConfirmBtn ? '' : 'submit'"
              v-show="showCancelBtn"
              @click="cancel">取消
      </Button>
    </div>
    <!-- dialog -->
    <Modal v-model="showModal"
           style="color: red;font-size: 16px"
           :title="modalTitle"
           @on-ok="modalOk"
           @on-cancel="modalCancel">
      <Alert>
        <template slot="desc">
          <p style="font-size: 16px;color: grey">{{ modalContent }}</p>
        </template>
      </Alert>
    </Modal>
  </div>
</template>
<script type='text/ecmascript-6'>
import { getUrlParams } from 'common/js/getUrlParamsInfo'
import { setUserSetting } from 'api/setUserSetting'
export default {
  props: {
    dataSource: {
      type: Array,
      default () {
        return []
      }
    },
    objDataField: {
      type: Array,
      default () {
        return []
      }
    },
    objDataValue: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      attrName: '',
      attrType: '',
      attrValue: '',
      rgbaColor: 'rgba(25,190,107,1)',
      attrColor: '',
      treeTypeCode: '',
      attrTypeArr: [
        'string',
        'int',
        'boolean'
      ],
      treeTypeArr: [
        {
          groupName: '主控相关',
          groupItems: [
            {
              value: '0'
            }
          ]
        },
        {
          groupName: '电能量相关',
          groupItems: [
            {
              value: '1'
            },
            {
              value: '14'
            }
          ]
        },
        {
          groupName: '亮灯率相关',
          groupItems: [
            {
              value: '10'
            }
          ]
        }
      ],
      // dialog
      showModal: false,
      modalTitle: '确定要保存设置吗',
      modalContent: '继续进行该操作将保存已选自定义显示设置'
    }
  },
  computed: {
    fieldValue () {
      if (this.objDataValue.hasOwnProperty(this.attrName)) {
        return this.objDataValue[this.attrName]
      }
      return []
    },
    // 是否显示 确定 按钮
    showConfirmBtn () {
      if (this.attrName && this.attrType && this.attrValue && this.attrColor && this.treeTypeCode) {
        return true
      }
      return false
    },
    // 是否显示 取消 按钮
    showCancelBtn () {
      if (this.attrName || this.attrType || this.attrValue || this.treeTypeCode) {
        return true
      }
      return false
    },
    depCode () {
      let { depCode } = getUrlParams(window.location.href)
      if (depCode === undefined) {
        depCode = '003000000000000000000029'
      }
      return depCode
    }
  },
  watch: {
    attrName (newVal) {
      this.attrValue = ''
    },
    rgbaColor: {
      handler: function (newVal) {
        if (newVal.length > 0) {
          let reg = newVal.replace('a', '')
          this.attrColor = reg.substring(0, reg.length - 3) + ')'
        } else {
          this.attrColor = ''
        }
      },
      // 立即先执行handler方法
      immediate: true
    }
  },
  methods: {
    saveSetting () {
      let data = {
        active: 'treeManagmentSetting.Main',
        setType: 'show',
        depCode: this.depCode,
        treeTypeCode: this.treeTypeCode,
        attrName: this.attrName,
        attrType: this.attrType,
        attrValue: this.attrValue,
        attrColor: this.attrColor
      }
      setUserSetting(data).then(res => {
        this.saveSettingResult(res)
      }).catch(err => {
        console.log(err)
      })
    },
    saveSettingResult (result) {
      if (result === '1') {
        this.$Modal.success({
          title: '保存成功',
          content: '已为您成功保存设置'
        })
        setTimeout(() => {
          this.$Modal.remove()
        }, 1300)
      } else {
        this.$Modal.error({
          title: '保存失败',
          content: '请检查网络连接是否正常或重新保存'
        })
        setTimeout(() => {
          this.$Modal.remove()
        }, 1300)
      }
    },
    confirm () {
      this.showModal = true
    },
    cancel () {
      this.attrName = ''
      this.attrType = ''
      this.treeTypeCode = ''
    },
    modalOk () {
      this.showModal = false
      this.saveSetting()
    },
    modalCancel () {
      this.showModal = false
      this.cancel()
    }
  },
  created () {},
  mounted () {},
  beforeDestroy () {},
  destroy () {}
}
</script>
<style scoped>

  #showSetting .selection-wrapper > li{
    list-style: none;
    padding: 12px 0px;
    color: #409eff;
    font-size: 16px;
  }

  #showSetting .selection-title {
    display: inline-block;
    width: 200px;
  }

  #showSetting .option-result {
    padding-left: 8px;
    color: green;
    font-size: 14px;
  }

  #showSetting .btn-wrapper {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
  }

  #showSetting .btn-wrapper button:hover {
    cursor: pointer;
  }

  #showSetting .btn-wrapper .submit {
    background: #87CEEB;
    color: white;
  }
</style>
