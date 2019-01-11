import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

const Login = () => import('@/pages/login.vue')
const List = () => import('@/pages/list.vue')
const Auth = () => import('@/pages/auth.vue')
const Idcard = () => import('@/pages/idcard.vue')
const Sign = () => import('@/pages/sign.vue')
const Video = () => import('@/pages/video.vue')
const Detail = () => import('@/pages/detail.vue')

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
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  let mobileNo = store.state.com.mobileNo
  if (!mobileNo && to.path !== '/login') {
    next({ path: '/login', replace: true })
  } else {
    next()
  }
})

export default router
