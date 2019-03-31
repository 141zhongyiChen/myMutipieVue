import { postJSON } from '@/ajax/http'
import { commonParams, API_TREES } from './config'
import { getUrlParams } from 'common/js/getUrlParamsInfo'

/**
 *@functionName: getInitTreeSetting
 *@desc get init setting conditions before init data tree
 *@author yun
 *@date 2018/10/09 09:54:13
 */
export function getInitTreeSetting (data = {}) {
  let { tree, depCode } = getUrlParams(window.location.href)

  let url = API_TREES
  // default setting
  let treeTypeCode = (tree === undefined) ? 0 : tree
  depCode = (depCode === undefined) ? '003000000000000000000029' : depCode
  // construct the request's params
  let params = Object.assign({}, {
    depCode: depCode,
    treeTypeCode: treeTypeCode,
    active: 'InitTreeSetting.InitSettingHandler'
  }, data)
  return postJSON('POST', url, params)
}

/**
 *@functionName: getInitTreeData
 *@desc get init tree data
 *@author yun
 *@date 2018/10/09 09:54:38
 */
export function getInitTreeData (data = {}) {
  // params setting
  let { tree, depCode } = getUrlParams(window.location.href)

  let url = API_TREES

  let treeTypeCode = (tree === undefined) ? 0 : tree

  depCode = (depCode === undefined) ? '003000000000000000000029' : depCode

  let params = Object.assign({}, commonParams, {
    depCode: depCode,
    treeTypeCode: treeTypeCode
  }, data)
  console.log(params)
  return postJSON('POST', url, params)
}
