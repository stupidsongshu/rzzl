import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
// import { MessageBox } from 'mint-ui'
// import http from '@/http/http'

const Login = () => import('@/pages/login.vue')
const List = () => import('@/pages/list.vue')
const Auth = () => import('@/pages/auth.vue')
const OCR = () => import('@/pages/ocr.vue')
const Face = () => import('@/pages/face.vue')
const Video = () => import('@/pages/video.vue')
const Detail = () => import('@/pages/detail.vue')
const VuePDF = () => import('@/pages/vue-pdf.vue')

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/auth',
    component: Auth
  },
  {
    path: '/ocr',
    component: OCR
  },
  {
    path: '/face',
    component: Face
  },
  {
    path: '/video',
    component: Video
  },
  {
    path: '/detail',
    component: Detail
  },
  {
    path: '/pdf',
    component: VuePDF,
    name: 'VuePDF'
  }
]

const router = new Router({
  routes
})

// 重设签约人状态
// function resetSignatoryStatus () {
//   let processStatus = store.state.com.processStatus
//   let options = {
//     url: 'i/resetSignatoryStatus',
//     params: {
//       projectSignatoryId: processStatus.projectSignatoryId
//     }
//   }
//   return new Promise((resolve, reject) => {
//     http(options).then(res => {
//       store.commit('ProcessStatus', res.data)
//       resolve()
//     })
//   })
// }

let blackList = ['/ocr', '/face', '/video']
router.beforeEach((to, from, next) => {
  let mobileNo = store.state.com.mobileNo
  // 未登录
  if (!mobileNo && to.path !== '/login') {
    next({ path: '/login', replace: true })
    return
  }
  // 登录过期
  if (mobileNo && to.path === '/login') {
    next()
    return
  }

  let isBlack = blackList.some(item => {
    return item === from.path
  })
  let appFromFace = sessionStorage.getItem('appFrom') === 'face'
  console.log('from.path:', from.path, from.fullPath)
  console.log('to.path:', to.path)
  console.log('isBlack:', isBlack)
  console.log('appFromFace:', appFromFace)
  console.log('document.URL:', document.URL)
  console.log('window.history.length:', window.history.length)

  // history.pushState(null, null, document.URL)

  // link start
  // if (to.path === '/ocr') {
  //   if (from.path === '/list') store.commit('Link_ocr', 'push')
  //   if (from.path === '/auth') store.commit('Link_ocr', 'replace')
  // }
  // if (to.path === '/face') {
  //   if (from.path === '/list') store.commit('Link_face', 'push')
  //   if (from.path === '/ocr') store.commit('Link_face', 'replace')
  // }
  // if (to.path === '/video') {
  //   if (from.path === '/list') store.commit('Link_video', 'push')
  //   if (from.path === '/face') store.commit('Link_video', 'replace')
  // }
  // if (to.path === '/detail') {
  //   if (from.path === '/list') store.commit('Link_detail', 'push')
  //   if (from.path === '/video') store.commit('Link_detail', 'replace')
  // }
  // link end

  if ((to.path === '/list' && isBlack) || (from.path === '/' && appFromFace)) {
    if (window.confirm('中途退出需重新进行认证')) {
      if (appFromFace) sessionStorage.removeItem('appFrom')
      // next({
      //   path: '/list',
      //   replace: true
      // })

      next()
    } else {
      next(false)
    }

    // MessageBox.confirm('', {
    //   title: '',
    //   message: '中途退出需重新进行认证',
    //   closeOnClickModal: false
    // }).then(_ => {
    //   // resetSignatoryStatus().then(_ => {
    //   //   next()
    //   // })
    //   // next({ path: '/list', replace: true })

    //   // store.dispatch('resetSignatoryStatus').then(_ => {
    //   //   if (appFromFace) {
    //   //     sessionStorage.removeItem('appFrom')
    //   //   }
    //   //   next({
    //   //     redirect: '/list',
    //   //     replace: true
    //   //   })
    //   // })

    //   if (appFromFace) {
    //     sessionStorage.removeItem('appFrom')
    //   }
    //   next({
    //     redirect: '/list',
    //     replace: true
    //   })
    // }).catch(_ => {
    //   // 防止页面后退
    //   history.pushState(null, null, document.URL)
    //   // window.addEventListener('popstate', function () {
    //   //   history.pushState(null, null, document.URL)
    //   // })
    //   next(false)
    // })
  } else if (to.path === '/auth' && from.path === '/ocr') {
    if (window.confirm('中途退出需重新进行认证')) {
      router.go(-1)
    } else {
      next(false)
    }
  } else {
    next()
  }
})

export default router
