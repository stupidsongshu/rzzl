import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { MessageBox } from 'mint-ui'

const Login = () => import('@/pages/login.vue')
const List = () => import('@/pages/list.vue')
const Auth = () => import('@/pages/auth.vue')
const Idcard = () => import('@/pages/idcard.vue')
const Sign = () => import('@/pages/sign.vue')
const Video = () => import('@/pages/video.vue')
const Detail = () => import('@/pages/detail.vue')
const PDF = () => import('@/pages/pdf.vue')
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
    component: PDF,
    name: 'PDF'
  },
  {
    path: '/vuePDF',
    component: VuePDF,
    name: 'VuePDF'
  }
]

const router = new Router({
  routes
})

let blackList = ['/idcard', '/sign', '/video']
router.beforeEach((to, from, next) => {
  let mobileNo = store.state.com.mobileNo
  if (!mobileNo && to.path !== '/login') {
    next({ path: '/login', replace: true })
    return
  }

  let isBlack = blackList.some(item => {
    return item === from.path
  })
  if (isBlack) {
    MessageBox.confirm('中途退出需重新进行认证', '').then(_ => {
      next()
    }).catch(_ => {
      next(false)
    })
  } else {
    next()
  }
})

export default router
