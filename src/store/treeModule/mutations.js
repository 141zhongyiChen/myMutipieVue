import * as types from './mutation-types'

const mutations = {

  [types.SET_TREE_TERMINAL] (states, data) {
    states.treeTerminal = data
  },

  [types.SET_TREE_SELECTED] (states, data) {
    states.treeSelectedArr = data
  },

  [types.SET_CHECKED_ARR] (states, data) {
    states.treeCheckedArr = data
  },

  // 请求总数据
  [types.SET_RESPOND_DATA] (states, data) {
    states.respondData = data
  },

  // 电能表 12位地址码
  [types.SET_ADDRESS_CODE] (states, data) {
    states.treeAddressCode = data
  },

  [types.SET_RUNNING_CODE] (states, data) {
    states.treeRunningCode = data
  },

  // 新增优化
  [types.SET_LIST_DATA] (states, data) {
    states.listTreeData = data
  },

  [types.SET_REGION_DATA] (states, data) {
    states.regionTreeData = data
  },

  [types.SET_TYPE_DATA] (states, data) {
    states.typeTreeData = data
  },

  [types.SET_FILTER_CODE] (states, data) {
    states.filterCode = data
  },

  [types.SET_OLD_CHECKED] (states, data) {
    states.oldCheckedArr = data
  },

  [types.SET_RESPOND_MAP] (states, data) {
    states.respondMap = data
  }
}

export default mutations
