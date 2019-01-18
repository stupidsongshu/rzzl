import Vue from 'vue'
import router from './router'
import store from './store'
import { Toast } from 'mint-ui'
import { http, fileHttp } from './utils'

/* eslint-disable no-unused-vars */
if (process.env.NODE_ENV === 'develpoment') {
  var VConsole = require('vconsole/dist/vconsole.min')
  var vConsole = new VConsole()
}

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
  router.go(-1)
}

/**
 * operatorStatus: 1运营商认证成功
 * ocrStatus: 1身份证认证成功
 * faceStatus: 1活体识别成功
 * videoStatus: 1视频认证成功
 */
Vue.prototype.processCtrl = function () {
  let data = store.state.com.processStatus
  let operatorStatus = data.operatorStatus
  let ocrStatus = data.ocrStatus
  let faceStatus = data.faceStatus
  let videoStatus = data.videoStatus

  if (operatorStatus === 0) {
    router.push('/auth')
    return
  }
  if (ocrStatus === 0 && faceStatus === 0 && videoStatus === 0) {
    router.push('/idcard')
    return
  }
  if (ocrStatus === 1 && faceStatus === 0 && videoStatus === 0) {
    router.replace('/sign')
    return
  }
  if (ocrStatus === 1 && faceStatus === 1 && videoStatus === 0) {
    router.replace('/video')
    return
  }
  if (ocrStatus === 1 && faceStatus === 1 && videoStatus === 1) {
    router.push('/detail')
  }
}
