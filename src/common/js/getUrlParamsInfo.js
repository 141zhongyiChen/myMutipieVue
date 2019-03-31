export function getUrlParams (url) {
  let theRequest = {}
  if (url.indexOf('?')) {
    let params = url.substring(url.indexOf('?') + 1)
    params = params.split('&')
    for (let i = 0; i < params.length; i++) {
      let arr = params[i].split('=')
      // theRequest[arr[0]] = arr[1]
      theRequest[toLowerCamelCase(arr[0])] = arr[1]
    }
  }
  // console.log(theRequest)
  return theRequest
}

function toLowerCamelCase (attr) {
  let upperCase = attr.toUpperCase()
  switch (upperCase) {
    case 'DEPCODE':
      return 'depCode'
    case 'USERCODE':
      return 'userCode'
    case 'UFCODE':
      return 'UFCode'
    case 'TREE':
      return 'tree'
    case 'STATUS':
      return 'status'
    case 'QTS':
      return 'qts'
    default:
      return attr
  }
}
