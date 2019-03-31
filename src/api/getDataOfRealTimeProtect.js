import { postJSON } from '@/ajax/http'
import { API_TREES } from './serverURL.config'
import { getUrlParams } from 'common/js/getUrlParams'

// get table data
export function getDataOfRealTimeProtect (data = {}) {
  let url = API_TREES
  let params = Object.assign({}, {
    active: 'realTimeProtectionH.GetDataOfRealTimeProtection'
  }, data)
  return postJSON('POST', url, params)
}

// get header data
export function getDataOfRealTimeHeader(data = {}) {
  let depCode = '003000000000000000000029'
  if (process.env.NODE_ENV !== 'development') {
    let { DepCode } = getUrlParams(window.location.href)
    depCode = DepCode
  }
  let arr = []
  arr.push(depCode)
  let url = API_TREES
  let params = Object.assign({}, {
    active: 'realTimeProtectionH.GetDataOfHeader',
    depCode: JSON.stringify(arr)
  }, data)
  return postJSON('POST', url, params)
}

// reflashTerminalInformation
export function refreshTerminalInfo (data = {}) {
  let url = API_TREES
  let params = Object.assign({}, {
    active: 'realTimeProtectionH.refreshTerminalInfo'
  }, data)
  return postJSON('POST', url, params)
}
