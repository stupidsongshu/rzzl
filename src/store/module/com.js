import Cookies from 'js-cookie'

const state = {
  mobileNo: '',
  signStatusMap: {
    1: '待签署',
    2: '待审核',
    3: '审核通过',
    4: '审核拒绝'
  },
  // 签约项目信息
  projectInfo: {},
  // 流程控制状态
  processStatus: {},
  // face++
  faceBizIdInfo: Cookies.get('faceBizIdInfo')
}
const getters = {}
const mutations = {
  MobileNo (state, payload) {
    state.mobileNo = payload
  },
  ProjectInfo (state, payload) {
    state.projectInfo = payload
  },
  ProcessStatus (state, payload) {
    state.processStatus = payload
  },
  FaceBizIdInfo (state, payload) {
    state.faceBizIdInfo = payload
    Cookies.set('faceBizIdInfo', payload, { expires: 1 })
  }
}
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
