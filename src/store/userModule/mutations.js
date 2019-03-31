import * as types from './mutation-types'

const mutations = {

  [types.SET_DEP_CODE] (states, data) {
    states.depCode = data
  },

  [types.SET_UF_CODE] (states, data) {
    states.UFCode = data
  },

  [types.SET_USER_CODE] (states, data) {
    states.userCode = data
  },

  [types.SET_TREE_CODE] (states, data) {
    states.tree = data
  }
}

export default mutations
