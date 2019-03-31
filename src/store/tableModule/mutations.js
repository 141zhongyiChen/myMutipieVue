import * as types from './mutation-types'

const mutations = {
  [types.SET_TABLE_TERMINAL] (states, data) {
    states.tableTerminal = data
  },
  [types.SET_TABLE_SELECTED] (states, data) {
    states.tableSelectedArr = data
  }
}

export default mutations
