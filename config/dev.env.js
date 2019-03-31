'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_TREES: '"http://192.168.1.15/LmisZLJK/scada-vue/LInterface/DataHandler.ashx"'
  API_TREES: '"http://localhost:11190/LInterface/DataHandler.ashx"'
})
