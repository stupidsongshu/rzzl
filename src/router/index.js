import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/pages/login.vue')
const List = () => import('@/pages/list.vue')
const Auth = () => import('@/pages/auth.vue')
const Idcard = () => import('@/pages/idcard.vue')
const Sign = () => import('@/pages/sign.vue')
const Video = () => import('@/pages/video.vue')
const Detail = () => import('@/pages/detail.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
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
})
