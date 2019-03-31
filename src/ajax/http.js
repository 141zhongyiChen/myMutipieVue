// Ajax post 封装
export function postJSON (type, url, data) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: url,
      type: type.toUpperCase(),
      data: data,
      success: function (res) {
        resolve(res) // 返回对象字符串
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}
