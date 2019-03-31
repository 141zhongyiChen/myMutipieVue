import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'
import state from './states'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
