export function export2Excel(tHeader, filterVal, list, excelName = '导出表格') {
  require.ensure([], () => {
    const { export_json_to_excel } = require('../../vendor/Export2Excel')
    const data = formatJson(filterVal, list)
    // 记录下载时间
    let date = new Date()
    date.year = date.getFullYear()
    date.month = date.getMonth() + 1
    date.day = date.getDate()
    date.hours = date.getHours()
    date.mins = date.getMinutes()
    date.sec = date.getSeconds()
    let dateString = ''
    for (let attr in date) {
      if (date.hasOwnProperty(attr)) {
        if (date[attr].toString().length < 2) {
          date[attr] = '0' + date[attr]
        }
        dateString += date[attr]
      }
    }
    excelName = dateString + excelName
    export_json_to_excel(tHeader, data, excelName)
  })
}

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
