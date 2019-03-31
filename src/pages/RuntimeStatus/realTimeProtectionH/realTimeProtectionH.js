// ES6 api polyfill
import 'babel-polyfill'
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css'
// stylus
import 'common/stylus/index.styl'
import Vue from 'vue'
import Protection from './realTimeProtectionH.vue'
import router from './router'

import store from '@/store'
// Element UI
import ElementUI from 'element-ui'
/* Vuex */
import Vuex from 'vuex'
import iView from 'iview'

Vue.use(ElementUI)

/* UI iview */
Vue.use(iView)
/* UI iview */

Vue.use(Vuex)
/* Vuex */
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(Protection)
})
