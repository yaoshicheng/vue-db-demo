'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG:"dev",
  // BASE_API: '"https://test-ads.deepblueai.com"',
  // BASE_API:'"http://192.168.23.104:4000"',
  BASE_API: '"https://dev-ads.deepblueai.com"',
})
