const state = {
  link_ocr: '',
  link_face: '',
  link_video: '',
  link_detail: ''
}

const mutations = {
  Link_ocr (state, payload) {
    state.link_ocr = payload
  },
  Link_face (state, payload) {
    state.link_face = payload
  },
  Link_video (state, payload) {
    state.link_video = payload
  },
  Link_detail (state, payload) {
    state.link_detail = payload
  }
}

export default {
  state,
  mutations
}
