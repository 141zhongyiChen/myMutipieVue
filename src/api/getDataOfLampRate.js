import { postJSON } from '@/ajax/http'
import { API_TREES } from './serverURL.config'
import { getUrlParams } from 'common/js/getUrlParams'

// 获取 亮灯率 树节点数据
export function getDataOfLampRate (data = {}) {
  let treeTypeCode = 10
  let depCode = '003000000000000000000007'
  let { tree } = getUrlParams(window.location.href)
  if (tree !== undefined) {
    treeTypeCode = tree
  }
  if (window.developerCode) {
    depCode = window.developerCode
  }
  let url = API_TREES
  let params = Object.assign({}, {
    active: 'TreeData.GetTreeInitData',
    depCode,
    treeTypeCode
  }, data)
  return postJSON('POST', url, params)
}

// 获取树列表 勾选框 显示标志
export function getCheckBoxFlag (data) {
  let url = API_TREES
  return postJSON('POST', url, data)
}
