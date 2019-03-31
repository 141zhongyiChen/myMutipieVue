// ES6 转义补丁
import 'babel-polyfill'
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import newVue from './LightingModeSetting.vue'
import router from './router'
import store from '@/store'
import iView from 'iview'
// Element UI
import ElementUI from 'element-ui'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(Vuex)
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(newVue)
})
