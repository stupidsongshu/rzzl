import { Indicator, Toast } from 'mint-ui'
import router from '../router'
import { baseURL } from '../config'

const http = (options) => {
  return new Promise((resolve, reject) => {
    let url = options.url
    let params = options.params
    console.log(url + ' req:', params)
    let loading = options.loading !== undefined ? options.loading : true
    let showError = options.showError !== undefined ? options.showError : true

    let xhr = new XMLHttpRequest()
    xhr.open('POST', baseURL + url, true)
    // xhr.setRequestHeader('content-type', 'multipart/form-data')
    xhr.withCredentials = true

    if (loading) {
      Indicator.open({
        text: '',
        spinnerType: 'fading-circle'
      })
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (loading) {
          Indicator.close()
        }
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          try {
            const resp = JSON.parse(xhr.responseText)
            console.log(url + ' res:', resp)
            if (resp.returnCode === '000002') {
              Toast({
                message: resp.returnMsg,
                duration: 2000
              })
              router.replace('/login')
            } else {
              resolve(resp)
            }
          } catch (error) {
            reject(error)
          }
        } else {
          if (showError) {
            Toast({
              message: '服务异常，请稍后再试',
              duration: 2000
            })
          }
        }
      }
    }
    xhr.send(params)
  })
}

export default http
