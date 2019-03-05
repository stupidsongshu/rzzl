import Cookies from 'js-cookie'
import http from '@/http/http'

const state = {
  mobileNo: '',
  /**
   * projectStatus项目状态
   * 0默认值 1创建成功待审核 2信息录入完成待复核 3复核通过待签约 4复核拒绝待修改 5签约完成待审核 6审核通过项目成功 7审核失败，项目结束
   */
  /**
   * signatoryStatus项目签约状态
   * 1创建成功待签约 2签约完成待审核 3审核通过 4审核拒绝
   */
  signStatusMap: {
    0: '',
    1: '待签约',
    2: '签约完成待审核',
    3: '审核通过、签约完成、合同有效',
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
const actions = {
  // 重设签约人状态
  resetSignatoryStatus ({ commit, state }) {
    let options = {
      url: 'i/resetSignatoryStatus',
      params: {
        projectSignatoryId: state.processStatus.projectSignatoryId
      }
    }
    return new Promise((resolve, reject) => {
      http(options).then(res => {
        commit('ProcessStatus', res.data)
        resolve()
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
