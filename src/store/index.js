import Vue from 'vue'
import Vuex from 'vuex'
import treeModule from './treeModule/index'
import tableModule from './tableModule/index'
import dwjModule from './dwjModule/index'
import userModule from './userModule/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tableModule,
    treeModule,
    dwjModule,
    userModule
  }
})
