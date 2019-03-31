import _ from 'lodash'

/* --- 自定义显示 处理方法 --- */
/**
 *@functionName: freeColorStyle
 *@desc 计算自定义显示方式(颜色)
 *@author yun
 *@date 2018/10/11 09:04:47
 */
export function freeColorStyle (obj, filterArr) {
  if (filterArr.length > 0) {
    for (let i = 0; i < filterArr.length; i++) {
      let exit = hasOwnProperty(obj, filterArr[i].attrName, filterArr[i].attrValue)
      // console.log(exit)
      if (exit && filterArr[i].attrColor.toString().length) {
        return filterArr[i].attrColor
      }
    }
  }
  return 'green'
}

/**
 *@functionName: hasOwnProperty
 * return boolean
 *@desc 判断对象是否符合条件, 不存在字段（或 存在字段但属性值不符），返回 false, 显示默认颜色值；存在字段，且属性值相符，显示 设定值；
 *@date 2018/10/11 09:12:53
 */
function hasOwnProperty (obj, field, value) {
  if (obj.hasOwnProperty(field) && obj[field].toString() === value.toString()) {
    return true
  }
  return false
}

/* --- 自定义筛选 处理方法 ---- */

/**
 *@functionName: groupByFilterAttr
 *@desc 依据字段分组,构造特定的数据结构
 *@date 2018/10/12 10:54:02
 */
export function groupByFilterAttr (dataList, filterArr) {
  let filterResult = []
  for (let i = 0; i < filterArr.length; i++) {
    // 过滤字段为 布尔类型
    if (filterArr[i].filterType.toString().toUpperCase() === 'BOOLEAN' && filterArr[i].filterValue.toString().length > 0) {
      let TFArr = filterArr[i].filterValue.split('/')
      let tempArr = []
      for (let j = 0; j < TFArr.length; j++) {
        let obj = {}
        obj.itemName = TFArr[j]
        obj.field = filterArr[i].filterAttr
        obj.checked = false
        switch (j) {
          case 1:
            obj.value = 'false'
            break
          default:
            obj.value = 'true'
        }
        tempArr.push(obj)
      }
      let filterItem = {
        groupName: filterArr[i].filterName,
        groupItems: tempArr
      }
      filterResult.push(filterItem)
    } else { // 过滤字段为 其他类型
      let tempArr = []
      let objDataArr = []
      // 获取 objData 数据
      for (let k = 0; k < dataList.length; k++) {
        objDataArr.push(dataList[k].objData)
      }

      // 按指定字段去重
      objDataArr = _.uniqBy(objDataArr, function (o) {
        return o[filterArr[i].filterAttr]
      })

      // 构造 特定 分组数据
      for (let n = 0; n < objDataArr.length; n++) {
        let obj = {}
        obj.itemName = objDataArr[n][filterArr[i].filterAttr]
        obj.field = filterArr[i].filterAttr
        obj.value = objDataArr[n][filterArr[i].filterAttr]
        obj.checked = false
        tempArr.push(obj)
      }

      // 组内分组 大于 1，返回 详细项；否则 不返回
      if (tempArr.length > 1) {
        let filterItem = {
          groupName: filterArr[i].filterName,
          groupItems: tempArr
        }
        filterResult.push(filterItem)
      }
    }
  }
  return filterResult
}

/**
 *@functionName: treeDataHandler
 *@params: objArr [{}], objArr [{}]
 *@desc dataSource: 待过滤数据源 数组; filterArr: 已选过滤 数组 [ { field: 'field_Name' , field_Name: 'field_Value' } ];
 *@date 2018/10/09 10:32:18
 */
export function treeDataHandler (dataSource, filterArr) {
  let dataList = JSON.parse(JSON.stringify(dataSource))
  // only when dataSource.length > 0
  if (dataList.length > 0) {
    let filterResult = dataList.filter(function f(o) {
      // 递归
      if (o.children && o.children.length) {
        return (o.children = o.children.filter(f)).length
      }
      // 满足条件，返回
      let flag = false
      for (let i = 0; i < filterArr.length; i++) {
        let obj = filterArr[i]
        if (obj.value.toString() === o.objData[obj.field].toString()) {
          flag = true
        }
        if (flag === true) {
          return true
        }
      }
    })
    return filterResult
  }
  return dataList
}

/**
 *@functionName: computedChecked
 *@desc 组内 复选框 为 全选状态， 不 加入 筛选数组；反之；
 *@return array
 *@date 2018/10/15 14:30:07
 */
export function computedChecked (dataList) {
  let retArr = []
  dataList.map(dItem => {
    let temp = []
    dItem.groupItems.map((gItem) => {
      if (gItem.checked) {
        temp.push(gItem)
      }
    })
    if (temp.length !== dItem.groupItems.length) {
      retArr = retArr.concat(temp)
    }
  })
  return retArr
}
