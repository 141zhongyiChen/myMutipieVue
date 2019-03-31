export function InitCheckedBox (dataList, checkedArr, filter) {
  let oldCheckedArr = []
  if (checkedArr.length > 0) {
    checkedArr.map(checkItem => {
      dataList.map(dataItem => {
        if (dataItem.children.length > 0) {
          dataItem.children.map(childItem => {
            if (childItem.objData[filter] === checkItem.objData[filter]) {
              childItem.checked = true
              oldCheckedArr.push(checkItem)
            }
          })
        } else {
          if (dataItem.objData[filter] === checkItem.objData[filter]) {
            dataItem.checked = true
            oldCheckedArr.push(dataItem)
          }
        }
      })
    })
  }
  let obj = {
    dataList,
    oldCheckedArr
  }
  return obj
}

// 找出两个数组不同的部分(取消勾选时调用)
export function findDifferent (array, array2, filterCode = 'terminalCode') {
  var arr3 = []
  for (let key in array) {
    var stra = array[key]
    var count = 0
    for (var j = 0; j < array2.length; j++) {
      var strb = array2[j]
      if (stra.objData[filterCode] === strb.objData[filterCode]) {
        count++
      }
    }
    if (count === 0) { // 表示数组1的这个值没有重复的，放到arr3列表中
      arr3.push(stra)
    }
  }
  return arr3
}
