export function InitCheckedArr (dataList, checkedArr, filterCode = 'terminalCode') {
  let data = []
  let dirFlagCount = [] // 记录每一层的个数，下标为层数，值为该层个数
  dataList.map((item, index) => {
    let count = 0
    item.children.map((eachrow) => {
      data.push(eachrow)
      count++
    })
    dirFlagCount[index] = count
  })

  let pos = [] // 列表位置集合
  if (checkedArr.length > 0) {
    data.map((item, index) => {
      checkedArr.map((checkedItem) => {
        // if (item.objData.terminalCode === checkedItem.objData.terminalCode)
        if (item.objData[filterCode] === checkedItem.objData[filterCode]) {
          pos.push(index)
        }
      })
    })
  }
  // 计算数据具体位置坐标
  let checkedPos = []
  for (let i in pos) {
    let val = pos[i]
    for (let j in dirFlagCount) {
      if (val < dirFlagCount[j]) {
        let obj = {}
        obj[j] = val
        checkedPos.push(obj)
        break
      }
      val -= dirFlagCount[j]
    }
  }

  // update dataList
  checkedPos.map((item) => {
    for (let attr in item) {
      dataList[attr].children[item[attr]].checked = true
    }
  })
  return dataList
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
