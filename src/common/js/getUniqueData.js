// 原始数据去重
export function getUniqueData (originalData) {
  let objArr = [] // 记录数组对象
  let temp = [] // 中间数组
  // { a:[],b:[],c:[]} => [{},{},{}]
  for (let attr in originalData) {
    objArr.push(originalData[attr])
  }
  objArr.map((oItem) => {
    oItem.map((item) => {
      if (item.children.length > 0) {
        item.children.map((itemChildren) => {
          temp.push(itemChildren)
        })
      } else {
        temp.push(item)
      }
    })
  })
  if (temp.length > 0) {
    return unique(temp)
  } else {
    return temp
  }
}

// 对象数组 去重 [{},{},{}...]
export function unique (temp) {
  let ret = [] // 记录目标数组对象
  let filter = recognizeFilter(temp[0].objData.type)
  console.log(`${filter}去重,输出 at line 27 in getUniqueData.js`)
  temp.map((tItem) => {
    let flag = true
    ret.map((retItem) => {
      if (tItem.objData[filter] === retItem.objData[filter]) {
        flag = false
      }
    })
    if (flag === true) {
      ret.push(tItem)
    }
  })
  // console.log(ret)
  return ret
}

function recognizeFilter (type) {
  switch (type) {
    case 'EnergyMeter_ZL':
    case 'EnergyMeter_NS':
      return 'addressCode'
    case 'LightingRate':
      return 'runningCode'
    default:
      return 'terminalCode'
  }
}
