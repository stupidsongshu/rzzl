import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
import router from '../router'
import { baseURL } from '../config'

const http = (options) => {
  let url = options.url
  let params = options.params
  console.log(url + ' req:', params)
  let loading = options.loading !== undefined ? options.loading : true
  let showError = options.showError !== undefined ? options.showError : true

  return new Promise((resolve, reject) => {
    if (loading) {
      Indicator.open({
        text: options.loadingMsg || '',
        spinnerType: 'fading-circle'
      })
    }
    axios({
      url: baseURL + url,
      method: 'post',
      withCredentials: true,
      data: params
    }).then(res => {
      if (loading) {
        Indicator.close()
      }
      console.log(url + ' res:', res.data)
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
      console.error(url, ':', err.message)
      console.error(url, ':', err)
      reject(err)
    })
  })
}

export default http
