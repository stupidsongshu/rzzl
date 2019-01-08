// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible'
import { Toast, Indicator, Popup } from 'mint-ui'
import 'mint-ui/lib/style.css'

import './assets/style/reset.css'
import './assets/style/base.css'

import './components/header'
import './components/button'
import './components/xy'

Vue.use(Toast)
Vue.use(Indicator)
// Vue.use(Popup)
Vue.component(Popup.name, Popup)

/* eslint-disable no-unused-vars */
// var VConsole = require('vconsole/dist/vconsole.min')
// var vConsole = new VConsole()

// 全局toast
Vue.prototype.toastInstance = null
Vue.prototype.toast = (msg, time) => {
  // 页面同一时间只显示一个toast
  if (this.toastInstance) {
    this.toastInstance.close()
  }
  this.toastInstance = Toast({
    message: msg,
    duration: time
  })
}

// 全局loading
Vue.prototype.loading = {
  open: function (msg) {
    if (!msg) {
      msg = '加载中'
    }
    Indicator.open({
      text: msg,
      spinnerType: 'fading-circle'
    })
  },
  close: function () {
    Indicator.close()
  }
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
