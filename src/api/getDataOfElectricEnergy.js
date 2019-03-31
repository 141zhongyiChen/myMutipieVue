import { postJSON } from '@/ajax/http'
import { API_TREES } from './serverURL.config'

// 获取电能表 树节点数据
export function getTreeDataOfElectricEnergy (data = {}) {
  let depCode = '003000000000000000000029'
  if (window.developerCode) {
    depCode = window.developerCode
  }
  let url = API_TREES
  let params = Object.assign({}, {
    active: 'TreeData.GetTreeInitData',
    depCode
  }, data)
  return postJSON('POST', url, params)
}

// 获取树列表 勾选框 显示标志
export function getCheckBoxFlag (data) {
  let url = API_TREES
  return postJSON('POST', url, data)
}
