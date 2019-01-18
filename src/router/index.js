import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { MessageBox } from 'mint-ui'
// import http from '@/http/http'

const Login = () => import('@/pages/login.vue')
const List = () => import('@/pages/list.vue')
const Auth = () => import('@/pages/auth.vue')
const Idcard = () => import('@/pages/idcard.vue')
const Sign = () => import('@/pages/sign.vue')
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
    path: '/idcard',
    component: Idcard
  },
  {
    path: '/sign',
    component: Sign
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

let blackList = ['/idcard', '/sign', '/video']
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
  if (isBlack && (to.path === '/list' || appFromFace)) {
    console.log('to.path:', to.path)
    console.log('from.path:', from.path, from.fullPath)

    // window.addEventListener('popstate', function () {
    //   console.log('popstate')
    //   window.history.pushState('forward', null, location.href)
    //   window.history.forward(1)
    // })
    // window.history.pushState('forward', null, location.href) // 在IE中必须得有这两行
    // window.history.forward(1)

    MessageBox.confirm('', {
      title: '',
      message: '中途退出需重新进行认证',
      closeOnClickModal: false
    }).then(_ => {
      // resetSignatoryStatus().then(_ => {
      //   next()
      // })
      // next({ path: '/list', replace: true })

      store.dispatch('resetSignatoryStatus').then(_ => {
        if (appFromFace === 'face') {
          sessionStorage.removeItem('appFrom')
        }
        next({
          redirect: '/list',
          replace: true
        })
      })
    }).catch(_ => {
      // 防止页面后退
      history.pushState(null, null, document.URL)
      // window.addEventListener('popstate', function () {
      //   history.pushState(null, null, document.URL)
      // })
      next(false)
    })
  } else {
    next()
  }
})

export default router
