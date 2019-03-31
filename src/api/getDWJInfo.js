import { postJSON } from '@/ajax/http'
import { API_TREES } from './serverURL.config'

export function getDWJInfo (data) {
  let url = API_TREES
  let params = Object.assign({}, {
    active: data.active,
    request: data.request
  })
  return postJSON('POST', url, params)
}
