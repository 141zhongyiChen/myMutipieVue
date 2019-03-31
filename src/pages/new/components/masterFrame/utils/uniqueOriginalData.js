//
let childNodes = new Map()
let filterCode = null
//
export function UniqueData (OriginalObj) {
  childNodes.clear()
  for (let attr in OriginalObj) {
    if (Array.isArray(OriginalObj[attr]) && OriginalObj[attr].length) {
      getUnique(OriginalObj[attr])
    }
  }
  return childNodes
}

function getUnique (tempArr) {
  if (!tempArr.length) {
    return
  }
  tempArr.forEach(item => {
    if (item.children && item.children.length) {
      getUnique(item.children)
    } else {
      if (!filterCode) {
        filterCode = recognizeFilter(item.objData.type)
      }
      childNodes.set(item.objData[filterCode], item)
    }
  })
}

function recognizeFilter (type) {
  switch (type) {
    case 'Master':
      return 'terminalCode'
    case 'EnergyMeter_ZL':
    case 'EnergyMeter_NS':
      return 'addressCode'
    case 'LightingRate':
      return 'runningCode'
    default:
      return 'terminalCode'
  }
}
