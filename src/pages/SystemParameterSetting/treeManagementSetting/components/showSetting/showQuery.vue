<template>
  <div id="showQuery">
    <Table width="100%" :height="fullHeight" border
           v-if="settingData.length"
           :columns="columnsInfo"
           :data="currentPageData">
    </Table>
    <div style="margin: 10px;overflow: hidden"  v-if="settingData.length">
      <div style="float: right;">
        <Page :total="totalData" show-sizer :current="currentPage"
              :page-size="pageSize"
              show-total
              @on-change="changePage"
              @on-page-size-change="changePageSize">
          <span slot>共{{ totalData }}条</span>
        </Page>
      </div>
    </div>
    <!-- Modal 修改对话框 -->
    <Modal v-model="showModal"
             style="width: auto;"
             @on-ok="modalModifyOk"
             @on-cancel="modalModifyCancel">
        <header style="font-size: 16px;color: grey;padding-bottom: 8px;border-bottom: 2px solid skyblue">当前修改信息详情：</header>
        <footer style="padding: 0px 10px">
          <li style="list-style: none;padding: 6px;font-size: 14px">
            <strong style="display: block;padding: 4px 0">树列表类型：</strong>
            <Select v-model="ModalContent.treeTypeCode" style="width:200px;margin-left: 50px" :placeholder=ModalContent.treeTypeCode>
              <OptionGroup v-for="(group, gIndex) in treeTypeArr" :key="gIndex" :label="group.groupName">
                <Option v-for="(item, iIndex) in group.groupItems" :key="iIndex" :value="item.value"></Option>
              </OptionGroup>
            </Select>
            <span style="padding-left: 8px;color: green;font-size: 14px;">当前值 : {{ ModalContent.treeTypeCode }}</span>
          </li>
          <!-- 需自定义的显示属性 -->
          <li style="list-style: none;padding: 6px;font-size: 14px">
            <strong style="display: block;padding: 4px 0">需自定义显示的属性：</strong>
            <Select v-model="ModalContent.attrName" style="width:200px;margin-left: 50px" placeholder="请选择（必选）">
              <Option v-for="item in objDataField" :value="item.toString()" :key="item">{{ item }}</Option>
            </Select>
            <span style="padding-left: 8px;color: green;font-size: 14px;">当前值 : {{ ModalContent.attrName}}</span>
          </li>
          <!-- 需自定义的属性类型 -->
          <li style="list-style: none;padding: 6px;font-size: 14px">
            <strong style="display: block;padding: 4px 0">属性字段的数据类型：</strong>
            <Select v-model="ModalContent.attrType" style="width:200px;margin-left: 50px" placeholder="请选择（必选）">
              <Option v-for="item in attrTypeArr" :value="item.toString()" :key="item">{{ item }}</Option>
            </Select>
            <span style="padding-left: 8px;color: green;font-size: 14px;">当前值 : {{ ModalContent.attrType }}</span>
          </li>
          <!-- 需自定义的属性值 -->
          <li style="list-style: none;padding: 6px;font-size: 14px">
            <strong style="display: block;padding: 4px 0">自定义显示属性的特定值：</strong>
            <Select v-model="ModalContent.attrValue" style="width:200px;margin-left: 50px" placeholder="请选择（必选）">
              <Option v-for="item in fieldValue" :value="item.toString()" :key="item">{{ item }}</Option>
            </Select>
            <span style="padding-left: 8px;color: green;font-size: 14px;">当前值 : {{ ModalContent.attrValue }}</span>
          </li>
          <!-- 需自定义显示的颜色值 -->
          <li style="list-style: none;padding: 6px;font-size: 14px">
            <strong style="display: inline-block;padding: 4px 0">需自定义显示的颜色值：</strong>
            <span style="display: inline-block;width: 60px;margin-left: 34px">
            <ColorPicker v-model="rgbaColor" format="rgb" recommend/>
          </span>
            <span :style="{color: rgbaColor,paddingLeft: '8px',fontSize: '14px'}">{{ ModalContent.attrColor }}</span>
          </li>
        </footer>
      </Modal>
    <!-- Model 删除对话框 -->
    <Modal v-model="showDeleteModal"
           style="color: red;font-size: 16px"
           title="确定要删除该条记录吗"
           @on-ok="modalDeleteOk"
           @on-cancel="modalDeleteCancel">
      <Alert>
        <template slot="desc">
          <p style="font-size: 16px;color: grey">点击确定，继续进行此操作</p>
        </template>
      </Alert>
    </Modal>
  </div>
</template>
<script type='text/ecmascript-6'>
import { setUserSetting } from 'api/setUserSetting'
// import { getUrlParams } from 'common/js/getUrlParamsInfo'
import _ from 'lodash'
export default {
  props: {
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
      fullHeight: 0,
      // string, '1-19' => 第一页 第十九条 高亮
      activeIndex: -1,
      settingData: [],
      columnsInfo: [
        {
          title: '用户编码',
          key: 'depCode',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.currentPage + '-' + params.index === this.activeIndex
              },
              on: {
                click: () => {
                  this.activeIndex = this.currentPage + '-' + params.index
                }
              }
            }, params.row.depCode)
          }
        },
        {
          title: '树列表类型',
          key: 'treeTypeCode',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.currentPage + '-' + params.index === this.activeIndex
              },
              on: {
                click: () => {
                  this.activeIndex = this.currentPage + '-' + params.index
                }
              }
            }, params.row.treeTypeCode)
          }
        },
        {
          title: '自定义显示字段',
          key: 'attrName',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.currentPage + '-' + params.index === this.activeIndex
              },
              on: {
                click: () => {
                  this.activeIndex = this.currentPage + '-' + params.index
                }
              }
            }, params.row.attrName)
          }
        },
        {
          title: '自定义显示字段类型',
          key: 'attrType',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.currentPage + '-' + params.index === this.activeIndex
              },
              on: {
                click: () => {
                  this.activeIndex = this.currentPage + '-' + params.index
                }
              }
            }, params.row.attrType)
          }
        },
        {
          title: '自定义显示字段值',
          key: 'attrValue',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.currentPage + '-' + params.index === this.activeIndex
              },
              on: {
                click: () => {
                  this.activeIndex = this.currentPage + '-' + params.index
                }
              }
            }, params.row.attrValue)
          }
        },
        {
          title: '自定义显示颜色',
          key: 'attrColor',
          width: 160,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.currentPage + '-' + params.index === this.activeIndex
              },
              on: {
                click: () => {
                  this.activeIndex = this.currentPage + '-' + params.index
                }
              }
            }, params.row.attrColor)
          }
        },
        {
          title: '操作',
          width: 160,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              class: {
                'demo-table-info-row': this.currentPage + '-' + params.index === this.activeIndex
              }
            }, [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '4px'
                },
                on: {
                  click: () => {
                    this.activeIndex = this.currentPage + '-' + params.index
                    this.modifyItem(params.index)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteItem(params.index)
                  }
                }
              }, '删除')
            ], '操作')
          }
        }
      ],
      // 分页器相关
      currentPage: 1,
      pageSize: 10,
      // 对话框
      modalTitle: '',
      showModal: false,
      ModalContent: '',
      modifyIndex: -1,
      showDeleteModal: false,
      // 修改相关
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
      attrTypeArr: [
        'string',
        'int',
        'boolean'
      ],
      rgbaColor: ''
    }
  },
  computed: {
    fieldValue () {
      let currentAttr = this.ModalContent.attrName
      if (this.objDataValue.hasOwnProperty(currentAttr)) {
        return this.objDataValue[currentAttr]
      }
      return []
    },
    totalData () {
      return this.settingData.length
    },
    currentPageData () {
      let data = JSON.parse(JSON.stringify(this.settingData))
      let chunkArr = _.chunk(data, this.pageSize)
      return chunkArr[this.currentPage - 1]
    }
  },
  watch: {
    rgbaColor (newVal) {
      // console.log(newVal)
      let reg = newVal.toString().replace('a', '')
      this.ModalContent.attrColor = reg.substring(0, reg.length - 3) + ')'
      return newVal
    },
    ModalContent: {
      handler: function (newVal) {
        let reg = newVal.attrColor.replace('rgb', 'rgba')
        this.rgbaColor = reg.substring(0, reg.length - 1) + ',1)'
      },
      deep: true
    }
  },
  methods: {
    // todo 监听浏览器窗口变化 begin
    onResize () {
      let _this = this
      window.addEventListener('resize', _this.handleResize)
    },
    handleResize (event) {
      this.fullHeight = document.documentElement.clientHeight * 76 / 100
    },
    // todo 监听浏览器变化 end
    // 数据请求
    _getShowSetting () {
      /*let { depCode } = getUrlParams(window.location.href)
      if (depCode === undefined) {
        depCode = '003000000000000000000029'
      }
      let data = {
        setType: 'showQuery',
        active: 'treeManagmentSetting.Main',
        depCode: depCode
      }
      setUserSetting(data).then(res => {
        let obj = JSON.parse(res)
        if (obj.hasOwnProperty('RespondData')) {
          this.settingData = obj.RespondData
        }
      }).catch(err => {
        console.log(err)
      })*/
      $.ajax({
        url: 'static/tree.json',
        type: 'GET',
        success: (res) => {
          let obj = JSON.parse(JSON.stringify(res))
          if (obj.hasOwnProperty('RespondData')) {
            this.settingData = obj.RespondData
          }
        },
        error: function (error) {
          console.log(error)
        }
      })
    },
    // todo 分页器 begin
    // 改变当前页码
    changePage (pageIndex) {
      this.currentPage = pageIndex
      console.log(this.activeIndex)
    },
    // 改变每页显示条数
    changePageSize (pageSize) {
      // 修改每页显示条数时，重新计算 activeIndex
      if (this.activeIndex !== -1) {
        let tempArr = this.activeIndex.split('-')
        let lastPageIndex = parseInt(tempArr[0])
        let lastCountIndex = parseInt(tempArr[1])
        let newPageIndex = parseInt(((lastPageIndex - 1) * parseInt(this.pageSize) + lastCountIndex) / parseInt(pageSize)) + 1
        let newCountIndex = parseInt(((lastPageIndex - 1) * parseInt(this.pageSize) + lastCountIndex) % parseInt(pageSize))
        // console.log(newPageIndex)
        // console.log(newCountIndex)
        this.activeIndex = newPageIndex + '-' + newCountIndex
      }
      this.pageSize = pageSize
    },
    // todo 分页器 end
    // todo 删除记录项
    deleteItem (index) {
      let dataIndex = (parseInt(this.currentPage) - 1) * parseInt(this.pageSize) + parseInt(index)
      let dataList = JSON.parse(JSON.stringify(this.settingData))
      /* this.settingData = _.slice(dataList, 0, dataIndex).concat(_.slice(dataList, dataIndex + 1, dataList.length))
      if (this.currentPage + '-' + index === this.activeIndex) {
        this.activeIndex = -1
      } */
      this.ModalContent = dataList[dataIndex]
      this.showDeleteModal = true
    },
    // 确认删除
    modalDeleteOk () {
      this.showDeleteModal = false
      let data = {
        setType: 'showQuery',
        active: 'treeManagmentSetting.Main',
        depCode: this.ModalContent.depCode,
        deleteItem: JSON.stringify(this.ModalContent)
      }
      setUserSetting(data).then(result => {
        if (result === '1') {
          this.settingData = []
          this._getShowSetting()
          this.activeIndex = -1
          this.$Modal.success({
            title: '删除成功',
            content: '已为您成功保存设置'
          })
          setTimeout(() => {
            this.$Modal.remove()
          }, 1300)
        } else {
          this.$Modal.error({
            title: '删除失败',
            content: '请检查网络连接是否正常或重新保存'
          })
          setTimeout(() => {
            this.$Modal.remove()
          }, 1300)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 取消删除
    modalDeleteCancel () {
      this.showDeleteModal = false
    },
    // todo 修改记录项
    modifyItem (index) {
      let dataIndex = (parseInt(this.currentPage) - 1) * parseInt(this.pageSize) + parseInt(index)
      let dataList = JSON.parse(JSON.stringify(this.settingData))
      this.ModalContent = dataList[dataIndex]
      this.modifyIndex = dataIndex
      this.showModal = true
    },
    // 确认修改
    modalModifyOk () {
      // console.log(this.ModalContent)
      // console.log(this.modifyIndex)
      let dataList = JSON.parse(JSON.stringify(this.settingData))
      let originItem = dataList[this.modifyIndex]
      let data = {
        setType: 'showQuery',
        active: 'treeManagmentSetting.Main',
        depCode: this.ModalContent.depCode,
        modifyItem: JSON.stringify(this.ModalContent),
        originItem: JSON.stringify(originItem)
      }
      setUserSetting(data).then(result => {
        if (result === '1') {
          this._getShowSetting()
          this.activeIndex = -1
          this.$Modal.success({
            title: '修改成功',
            content: '已为您成功保存设置'
          })
          setTimeout(() => {
            this.$Modal.remove()
          }, 1300)
        } else {
          this.$Modal.error({
            title: '修改失败',
            content: '请检查网络连接是否正常或重新保存'
          })
          setTimeout(() => {
            this.$Modal.remove()
          }, 1300)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 取消修改
    modalModifyCancel () {
      this.showModal = false
      let dataList = JSON.parse(JSON.stringify(this.settingData))
      // 恢复原始数据
      this.ModalContent = dataList[this.modifyIndex]
    }

  },
  created () {
    this._getShowSetting()
  },
  mounted () {
    // 添加监听事件
    this.fullHeight = document.documentElement.clientHeight * 76 / 100
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
<style>
  /* 表格样式设置 */
  #showQuery thead .ivu-table-column-center .ivu-table-cell span {
    font-size: 16px;
    color: black;
    font-weight: 500;
  }

  #showQuery tbody .ivu-table-column-center .ivu-table-cell span {
    font-size: 14px;
    color: black;
    font-weight: 500;
  }

  /* reset table header &&  table fixed-header*/
  #showQuery .ivu-table .ivu-table-header .ivu-table-cell,
  #showQuery .ivu-table .ivu-table-fixed .ivu-table-fixed-header .ivu-table-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: justify;
  }

  /* reset table body */

  #showQuery .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell {
    width: 100%;
    height: 100%;
    padding: 0;
    display:table
  }

  /* reset default span && setting render div */
  /*#my-table-wrapper .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell > span,*/
  #showQuery .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell > div {
    width: 100%;
    height: 100%;
    padding: 0;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
  }

  /* reset table-row-hover */
  #showQuery .ivu-table tr.ivu-table-row-hover .ivu-table-cell {
    background: #87CEEB;
    color: #fff;
  }

  #showQuery .ivu-table tr.ivu-table-row-hover .ivu-table-cell > div:hover {
    background: #ffcd32;
    color: #fff;
  }
  /* 自定义 */

  /* curSelected style */
  #showQuery .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell .demo-table-info-row {
    background-color: #2db7f5;
    color: #fff;
  }

  /* cur-select-hover */
  #showQuery .ivu-table .ivu-table-tbody .ivu-table-row .ivu-table-cell .demo-table-info-row:hover {
    font-size: 16px;
    background: #ffcd32;
    color: #fff;
  }

  /* 修改 对话框 设置 */
  #showQuery .selection-wrapper {
    background: red;
  }
</style>
