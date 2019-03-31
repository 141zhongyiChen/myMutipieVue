<template>
  <div id="filterSetting">
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
        <strong class="selection-title">需自定义筛选的属性：</strong>
        <Select v-model="filterAttr" clearable style="width:200px" placeholder="请选择（必选）">
          <Option v-for="item in objDataField" :value="item.toString()" :key="item">{{ item }}</Option>
        </Select>
        <span class="option-result">{{ filterAttr }}</span>
      </li>
      <!-- 依据属性分组的组名 -->
      <li>
        <strong class="selection-title">需自定义的分组名称：</strong>
          <Input v-model="filterName" placeholder="请键入分组名（必填）" style="width: 200px" :maxlength="maxLength"></Input>
        <span class="option-result">{{ filterName }}</span>
      </li>
      <!-- 属性字段的数据类型 -->
      <li>
        <strong class="selection-title">属性字段的数据类型：</strong>
        <Select v-model="filterType" clearable style="width:200px" placeholder="请选择（必选）">
          <Option v-for="item in attrTypeArr" :value="item.toString()" :key="item">{{ item }}</Option>
        </Select>
        <span class="option-result">{{ filterType }}</span>
      </li>
      <li v-if="filterType === 'boolean'">
        <strong class="selection-title">属性字段为true的分组名：</strong>
        <Input v-model="boolTrueValue" placeholder="请键入分组名（必填）" style="width: 200px" :maxlength="maxLength"></Input>
        <span class="option-result">{{ boolTrueValue }}</span>
      </li>
      <li v-if="filterType === 'boolean'">
        <strong class="selection-title">属性字段为false的分组名：</strong>
        <Input v-model="boolFalseValue" placeholder="请键入分组名（必填）" style="width: 200px" :maxlength="maxLength"></Input>
        <span class="option-result">{{ boolFalseValue }}</span>
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
    }
  },
  data () {
    return {
      maxLength: 15,
      filterAttr: '',
      filterType: '',
      boolTrueValue: '',
      boolFalseValue: '',
      filterName: '',
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
    // 是否显示 确定 按钮
    showConfirmBtn () {
      if (this.filterAttr && this.filterType && this.filterName && this.treeTypeCode) {
        if (this.filterType === 'boolean') {
          if (this.boolTrueValue && this.boolFalseValue) {
            return true
          }
          return false
        }
        return true
      }
      return false
    },
    filterValue () {
      if (this.boolTrueValue && this.boolFalseValue) {
        return `${this.boolTrueValue}/${this.boolFalseValue}`
      }
      return ''
    },
    // 是否显示 取消 按钮
    showCancelBtn () {
      if (this.filterAttr || this.filterType || this.filterName || this.treeTypeCode) {
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
    // 属性类型改变，清空 布尔值设置
    filterType (newVal) {
      this.boolTrueValue = ''
      this.boolFalseValue = ''
      return newVal
    }
  },
  methods: {
    saveSetting () {
      let data = {
        active: 'treeManagmentSetting.Main',
        setType: 'filter',
        depCode: this.depCode,
        treeTypeCode: this.treeTypeCode,
        filterAttr: this.filterAttr,
        filterType: this.filterType,
        filterValue: this.filterValue,
        filterName: this.filterName
      }
      // console.log(data)
      setUserSetting(data).then(res => {
        // console.log(res)
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
      this.treeTypeCode = ''
      this.filterAttr = ''
      this.filterType = ''
      this.filterName = ''
      this.boolTrueValue = ''
      this.boolFalseValue = ''
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

  #filterSetting .selection-wrapper > li{
    list-style: none;
    padding: 12px 0px;
    color: #409eff;
    font-size: 16px;
  }

  #filterSetting .selection-title {
    display: inline-block;
    width: 200px;
  }

  #filterSetting .option-result {
    padding-left: 8px;
    color: green;
    font-size: 14px;
  }

  #filterSetting .btn-wrapper {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
  }

  #filterSetting .btn-wrapper button:hover {
    cursor: pointer;
  }

  #filterSetting .btn-wrapper .submit {
    background: #87CEEB;
    color: white;
  }
</style>
