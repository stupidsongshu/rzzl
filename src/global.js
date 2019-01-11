import Vue from 'vue'
import router from './router'
import store from './store'
import { Toast, MessageBox } from 'mint-ui'
import { http, fileHttp } from './utils'

/* eslint-disable no-unused-vars */
// var VConsole = require('vconsole/dist/vconsole.min')
// var vConsole = new VConsole()

Vue.prototype.$http = http
Vue.prototype.$fileHttp = fileHttp

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

Vue.prototype.messageBox = MessageBox

// 全局loading
// Vue.prototype.loading = {
//   open: function (msg) {
//     if (!msg) {
//       msg = '加载中'
//     }
//     Indicator.open({
//       text: msg,
//       spinnerType: 'fading-circle'
//     })
//   },
//   close: function () {
//     Indicator.close()
//   }
// }

Vue.prototype.goBack = function () {
  // router.replace('/list')
  router.go(-1)
}

Vue.prototype.processCtrl = function () {
  /**
   * operatorStatus: 1运营商认证成功
   * ocrStatus: 1身份证认证成功
   * faceStatus: 1活体识别成功
   * videoStatus: 1视频认证成功
   */
  let data = store.state.com.processStatus
  if (data.operatorStatus === 0) {
    router.push('/auth')
    return
  }
  if (data.ocrStatus === 0 && data.faceStatus === 0 && data.videoStatus === 0) {
    router.push('/idcard')
    return
  }
  if (data.ocrStatus === 1 && data.faceStatus === 0 && data.videoStatus === 0) {
    router.push('/sign')
    return
  }
  if (data.ocrStatus === 1 && data.faceStatus === 1 && data.videoStatus === 0) {
    router.push('/video')
  }
  if (data.ocrStatus === 1 && data.faceStatus === 1 && data.videoStatus === 1) {
    router.push('/detail')
  }
}
