import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import com from './module/com'
import link from './module/link'

Vue.use(Vuex)

const vuexSession = new VuexPersist({
  storage: window.sessionStorage
})

const store = new Vuex.Store({
  modules: {
    com,
    link
  },
  plugins: [vuexSession.plugin]
})

export default store
