export function getUrlParams (url) {
  let theRequest = {}
  if (url.indexOf('?')) {
    let params = url.substring(url.indexOf('?') + 1)
    params = params.split('&')
    for (let i = 0; i < params.length; i++) {
      let arr = params[i].split('=')
      theRequest[arr[0]] = arr[1]
    }
  }
  return theRequest
}
