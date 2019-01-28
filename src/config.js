let baseURL = ''
const env = process.env.NODE_ENV
console.log('process.env.NODE_ENV:', env)
if (env === 'development' || env === 'development-build') {
  // baseURL = 'http://192.168.199.148:8085/'
  // baseURL = 'http://192.168.199.234:8085/'
  // baseURL = 'http://sc.ledaikuan.cn/'
  baseURL = 'http://rzzl.ledaikuan.cn/'
} else if (env === 'production') {
  baseURL = 'http://rzi.ledaikuan.cn/'
}

export {
  baseURL
}
