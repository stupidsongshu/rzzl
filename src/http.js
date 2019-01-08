import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
import router from './router'

let baseURL = ''
const env = process.env.NODE_ENV
if (env === 'development') {
  baseURL = 'http://192.168.199.148:8085/'
} else if (env === 'production') {
  baseURL = ''
}

const http = (options) => {
  let url = options.url
  let params = options.params
  console.log('params:', params)
  let loading = options.loading !== undefined ? options.loading : true
  let showError = options.showError !== undefined ? options.showError : true
  return new Promise((resolve, reject) => {
    if (loading) {
      Indicator.open({
        text: '',
        spinnerType: 'fading-circle'
      })
    }
    axios({
      url: baseURL + url,
      method: 'post',
      data: params
    }).then(res => {
      if (loading) {
        Indicator.close()
      }
      if (res.data.returnCode === '000002') {
        Toast({
          message: res.data.returnMsg,
          duration: 2000
        })
        router.replace('/login')
      } else {
        resolve(res.data)
      }
    }).catch(err => {
      if (loading) {
        Indicator.close()
      }
      if (showError) {
        Toast({
          message: '服务异常，请稍后再试',
          duration: 2000
        })
      }
      reject(err)
    })
  })
}

export default http
