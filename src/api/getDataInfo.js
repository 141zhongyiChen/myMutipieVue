import { postJSON } from '@/ajax/http'
import { API_TREES } from './config'

// 获取树列表 勾选框 显示标志
export function getDataInfo (data) {
  let url = API_TREES
  let params = Object.assign({}, data)
  return postJSON('POST', url, params)
}
