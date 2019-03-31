import { getUrlParams } from '../common/js/getUrlParamsInfo'
export const commonParams = {
  active: 'TreeData.GetTreeInitData'
}
let { depCode, userCode } = getUrlParams(window.location.href)
export const API_TREES = process.env.API_TREES
window.dataURL = API_TREES
window.depCode = depCode
window.userCode = userCode
window.userName = ''
try {
  if (top._User !== undefined && top._User !== null) {
    window.userName = top._User.userName
  } else {
    console.log('当前运行环境下用户信息为空！')
  }
} catch (e) {
  console.log(e)
}

console.log(window.depCode + '*' + window.userCode)
