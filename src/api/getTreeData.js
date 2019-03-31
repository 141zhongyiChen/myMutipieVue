import { postJSON } from '@/ajax/http'
import { API_TREES } from './serverURL.config'
import { commonParams } from './config'
import { getUrlParams } from 'common/js/getUrlParams'

export function getTreeData (data = {}) {
  let depCode = '003000000000000000000029'
  let treeTypeCode = 0
  let url = API_TREES
  if (window.developerCode) {
    depCode = window.developerCode
  }
  let { tree } = getUrlParams(window.location.href)
  if (tree !== undefined) {
    treeTypeCode = tree
  }
  let params = Object.assign({}, commonParams, {
    depCode,
    treeTypeCode
  }, data)
  return postJSON('POST', url, params)
}
