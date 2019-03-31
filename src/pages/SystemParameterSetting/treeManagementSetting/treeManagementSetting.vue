<template>
  <div id="treeManagementSetting">
    <div class="layout">
      <!-- 侧边栏 -->
      <Sider :style="siderStyle">
        <Menu :active-name="activeName" theme="dark" width="auto" :open-names="openName">
          <Submenu v-for="(menu, mIndex) in subMenu" :key="mIndex" :name="menu.name">
            <template slot="title">
              <Icon :type="menu.iconType"></Icon>
              {{ menu.subTitle }}
            </template>
            <MenuItem v-for="(item, iIndex) in menu.MenuItem" :key="iIndex" :name="item.name">
              <div class="itemContent" @click="changeActiveName(item)">
                  <span>{{ item.option }}</span>
              </div>
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <!-- 内容区 -->
      <Layout :style="layoutStyle">
        <Header :style="headerStyle">
          <span style="color: black;font-weight: 900;font-size: 20px">{{ headerTitle }}</span>
        </Header>
        <Content :style="contentStyle" v-if="treeData.length">
          <Breadcrumb :style="breadCrumbStyle">
            <BreadcrumbItem>{{ activePage.menuName }}</BreadcrumbItem>
            <BreadcrumbItem>{{ activePage.itemName }}</BreadcrumbItem>
          </Breadcrumb>
          <Card style="height: 86vh;overflow: auto">
            <!-- 显示设置 -->
            <show-setting
              v-if="currentPage === 'showSetting'"
              :objDataField="objDataField"
              :objDataValue="objDataValue"
              :dataSource="treeData"></show-setting>
            <show-query
              v-if="currentPage === 'showQuery'"
              :objDataField="objDataField"
              :objDataValue="objDataValue"></show-query>
            <!-- 过滤设置 -->
            <filter-setting
              v-if="currentPage === 'filterSetting'"
              :objDataField="objDataField"
              :dataSource="treeData"></filter-setting >
            <filter-query
              v-if="currentPage === 'filterQuery'"
              :objDataField="objDataField"></filter-query>
          </Card>
        </Content>
      </Layout>
    </div>
  </div>
</template>

<script>
import { getInitTreeData } from 'api/getInitTreeData'
import { getUniqueData } from 'common/js/getUniqueData'
import showSetting from './components/showSetting/showSetting.vue'
import showQuery from './components/showSetting/showQuery.vue'
import filterSetting from './components/filterSetting/filterSetting.vue'
import filterQuery from './components/filterSetting/filterQuery.vue'
import _ from 'lodash'
export default {
  data () {
    return {
      // sider base setting
      siderStyle: {
        position: 'fixed',
        height: '100vh',
        left: 0,
        overflow: 'auto'
      },
      // content base setting
      layoutStyle: {
        marginLeft: '200px'
      },
      headerStyle: {
        background: '#fff',
        boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',
        padding: '0 10px',
        height: '50px',
        lineHeight: '50px'
      },
      headerTitle: '树列表显示及筛选管理',
      contentStyle: {
        padding: '0 16px 16px'
      },
      breadCrumbStyle: {
        margin: '16px 0'
      },
      // 侧边栏数据
      subMenu: [
        {
          name: '1',
          iconType: 'ios-navigate',
          subTitle: '树列表显示管理',
          MenuItem: [
            {
              name: '1-1',
              option: '添加显示条件',
              showPage: 'showSetting'
            },
            {
              name: '1-2',
              option: '查看/更改显示条件',
              showPage: 'showQuery'
            }
          ]
        },
        {
          name: '2',
          iconType: 'ios-keypad',
          subTitle: '树列表筛选管理',
          MenuItem: [
            {
              name: '2-1',
              option: '添加过滤条件',
              showPage: 'filterSetting'
            },
            {
              name: '2-2',
              option: '查看/更改筛选条件',
              showPage: 'filterQuery'
            }
          ]
        }
      ],
      activeName: '1-1',
      openName: ['1'],
      // 当前显示页, '字符串'
      currentPage: 'showSetting',
      // 树列表数据
      treeData: []
    }
  },
  components: {
    showSetting,
    showQuery,
    filterSetting,
    filterQuery
  },
  computed: {
    // 计算当前展示的 Breadcrumb
    activePage () {
      let tempArr = this.activeName.split('-')
      let obj = {}
      obj.menuName = this.subMenu[tempArr[0] - 1].subTitle
      let menuItem = this.subMenu[tempArr[0] - 1].MenuItem
      obj.itemName = menuItem[tempArr[1] - 1].option
      return obj
    },
    // 计算 treeData objData 中 包含的 字段属性
    objDataField () {
      let result = []
      if (this.treeData.length > 0) {
        let item = this.treeData[0]
        for (let attr in item.objData) {
          result.push(attr)
        }
      }
      return result
    },
    // 获得所有字段的所有不同值
    objDataValue () {
      let result = {}
      if (this.treeData.length > 0) {
        let objDataArr = []
        // 获取所有 objData
        for (let k = 0; k < this.treeData.length; k++) {
          objDataArr.push(this.treeData[k].objData)
        }
        // 计算所有字段的所有不同值, 构造指定数据结构 => { a: [], b:[],... }
        let item = this.treeData[0]
        for (let attr in item.objData) {
          let temp = []
          let attrArr = _.uniqBy(objDataArr, function (o) {
            return o[attr]
          })
          if (attrArr.length > 0) {
            for (let i = 0; i < attrArr.length; i++) {
              temp.push(attrArr[i][attr])
            }
            result[attr] = temp
          }
        }
      }
      return result
    }
  },
  watch: {},
  methods: {
    // 更改当前激活页(菜单项点击事件)
    changeActiveName (item) {
      // change activeItem
      this.activeName = item.name
      // change current active page
      this.currentPage = item.showPage
      // console.log(this.objDataField)
      // console.log(this.objDataValue)
    },
    // get tree data, in order to init the setting options
    _getInitTreeData () {
      getInitTreeData()
        .then(res => {
          // console.log(JSON.parse(res))
          this.treeData = getUniqueData(JSON.parse(res))
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this._getInitTreeData()
  },
  mounted () {},
  beforeDestroy () {},
  destroy () {}
}
</script>

<style>
  #treeManagementSetting ul .ivu-menu > li {
   position: relative;
  }

  #treeManagementSetting .itemContent {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    cursor: pointer;
    padding-top: 4px;
  }
</style>
