import { postJSON } from '@/ajax/http'
import { API_TREES } from './config'

/**
 *@functionName: setUserSetting
 *@desc save the user's setting
 *@return Promise
 *@date 2018/10/16 18:13:56
 */
export function setUserSetting (data = {}) {
  let url = API_TREES

  let params = Object.assign({}, data)

  return postJSON('POST', url, params)
}
