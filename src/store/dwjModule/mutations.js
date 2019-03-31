import * as types from './mutation-types'

const mutations = {

  [types.SET_DWJ_STATUS] (states, data) {
    states.DWJStatus = data
  },

  [types.SET_QTS] (states, data) {
    states.qts = data
  },

  [types.SET_DWJ_RESPOND] (states, data) {
    states.dwjRespond = data
  }

}

export default mutations
