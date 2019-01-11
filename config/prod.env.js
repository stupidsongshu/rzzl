'use strict'
let proType = ''
if (process.argv[2] === '--dev') {
  proType = '"development-build"'
} else {
  proType = '"production"'
}
module.exports = {
  NODE_ENV: proType
}
