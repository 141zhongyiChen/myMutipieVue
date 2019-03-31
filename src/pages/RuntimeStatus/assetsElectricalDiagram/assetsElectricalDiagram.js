/* eslint-disable */
import "babel-polyfill"
import Vue from "vue"
import assetsElectricalDiagram from "./assetsElectricalDiagram.vue"
import router from "./router"
import store from "@/store"
import iView from "iview"
import "iview/dist/styles/iview.css"

import "jquery"

import Vuex from "vuex"

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(Vuex)

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(assetsElectricalDiagram)
})
