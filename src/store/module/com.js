const state = {
  mobileNo: '15620516990',
  signStatusMap: {
    1: '待签署',
    2: '待审核',
    3: '审核通过',
    4: '审核拒绝'
  },
  projectInfo: {}
}
const getters = {}
const mutations = {
  MobileNo (state, payload) {
    state.mobileNo = payload
  },
  ProjectInfo (state, payload) {
    state.projectInfo = payload
  }
}
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
