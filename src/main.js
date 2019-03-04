// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible'
// import { Toast, Indicator } from 'mint-ui'
import 'mint-ui/lib/style.css'

import './assets/style/reset.css'
import './assets/style/base.css'

import './components/header'
import './components/button'
import './components/xy'

import './global'

// Vue.use(Indicator)
// Vue.component(Toast.name, Toast)
// Vue.component(MessageBox.name, MessageBox)
// Vue.component(Popup.name, Popup)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
