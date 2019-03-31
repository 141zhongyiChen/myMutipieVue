// ES6 转义补丁
import 'babel-polyfill'
import Vue from 'vue'
import newVue from './treeManagementSetting.vue'
import router from './router'
import store from '@/store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

// ( 水平滚动 )引入css
import 'vue-happy-scroll/docs/happy-scroll.css'

import Vuex from 'vuex'

// todo import kendo-ui-grid begin

import '@progress/kendo-ui'
import '@progress/kendo-theme-default/dist/all.css'
import { Grid, GridInstaller } from '@progress/kendo-grid-vue-wrapper'

// todo import kendo-ui-grid end

// todo import kendo-ui-data-Source begin
import { DataSource,
  HierarchicalDataSource,
  GanttDataSource,
  GanttDependencyDataSource,
  PivotDataSource,
  SchedulerDataSource,
  TreeListDataSource,
  DataSourceInstaller } from '@progress/kendo-datasource-vue-wrapper'

// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.use(DataSourceInstaller)
// todo import kendo-ui-data-Source end

Vue.use(GridInstaller)

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(Vuex)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    Grid,
    DataSource,
    HierarchicalDataSource,
    GanttDataSource,
    GanttDependencyDataSource,
    PivotDataSource,
    SchedulerDataSource,
    TreeListDataSource,
    DataSourceInstaller
  },
  render: h => h(newVue)
})
