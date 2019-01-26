import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { MessageBox } from 'mint-ui'

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
    component: Face,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/video',
    component: Video
  },
  {
    path: '/detail',
    component: Detail,
    meta: {
      keepAlive: true
    }
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
  console.log('from.path:', from.path, from.fullPath)
  console.log('to.path:', to.path)
  console.log('isBlack:', isBlack)
  console.log('document.URL:', document.URL)
  console.log('window.history.length:', window.history.length)

  if (isBlack && to.path === '/list') {
    MessageBox.confirm('', {
      title: '',
      message: '中途退出需重新进行认证',
      closeOnClickModal: false
    }).then(_ => {
      store.dispatch('resetSignatoryStatus').then(_ => {
        next()
      })
    }).catch(_ => {
      // 防止页面后退
      history.pushState(null, null, document.URL)
      // window.addEventListener('popstate', function () {
      //   history.pushState(null, null, document.URL)
      // })
      next(false)
    })
    return
  }

  // if (isBlack && to.path === '/list') {
  //   if (window.confirm('中途退出需重新进行认证')) {
  //     store.dispatch('resetSignatoryStatus').then(_ => {
  //       next()
  //     })
  //   } else {
  //     next(false)
  //   }
  //   return
  // }

  // let appFromFace = sessionStorage.getItem('appFrom') === 'face'
  // console.log('appFromFace:', appFromFace)
  // if (from.path === '/' && to.path === '/face' && appFromFace) {
  //   if (window.confirm('中途退出需重新进行认证')) {
  //     store.dispatch('resetSignatoryStatus').then(_ => {
  //       if (appFromFace) sessionStorage.removeItem('appFrom')
  //       router.replace('/list')
  //     })
  //   } else {
  //     // 防止页面后退
  //     // history.pushState(null, null, document.URL)
  //     // window.location.href = window.location.href
  //     // next(false)
  //     // alert(router.currentRoute.fullPath)
  //     // alert(to.fullPath)
  //     // sessionStorage.setItem('faceFullPath', to.fullPath)
  //     // router.push('/middle')
  //     let needRefreshFaceCount = sessionStorage.getItem('needRefreshFaceCount') || 0
  //     needRefreshFaceCount++
  //     sessionStorage.setItem('needRefreshFaceCount', needRefreshFaceCount)
  //     console.log('needRefreshFaceCount:', needRefreshFaceCount)
  //     if (needRefreshFaceCount === 1) {
  //       setTimeout(_ => {
  //         window.location.reload()
  //         setTimeout(_ => {
  //           sessionStorage.setItem('needRefreshFaceCount', 0)
  //         }, 100)
  //       }, 1000)
  //     }
  //   }
  //   return
  // }

  if (from.path === '/ocr' && to.path === '/auth') {
    if (window.confirm('中途退出需重新进行认证')) {
      router.go(-1)
    } else {
      next(false)
    }
    return
  }

  next()
})

export default router
