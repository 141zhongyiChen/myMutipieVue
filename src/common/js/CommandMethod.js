import 'jquery'
export function SendCommand (tableName, DataDictionary) {
  return new Promise(function (resolve, reject) {
    if (DataDictionary.length > 10) {
      $.ajax({
        url: window.dataURL,
        type: 'POST',
        data: {
          active: 'CommandMethods.Main',
          method: 'SendCommand',
          tableName: tableName,
          DataDictionary: DataDictionary,
          depCode: window.depCode,
          userCode: window.userCode
        },
        error: function (e) {
          reject(e)
        },
        success: function (re) {
          resolve(re)
        }
      })
    }
  })
}
