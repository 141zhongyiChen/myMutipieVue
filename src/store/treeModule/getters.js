const getters = {
  treeTerminal: states => states.treeTerminal,

  treeSelectedArr: states => states.treeSelectedArr,

  treeCheckedArr: states => states.treeCheckedArr,

  // 请求总数据
  respondData: states => states.respondData,

  // get addressCode
  treeAddressCode: states => states.treeAddressCode,

  // [亮灯率相关]
  treeRunningCode: states => states.treeRunningCode,

  // 新增优化
  listTreeData: states => states.listTreeData,

  regionTreeData: states => states.regionTreeData,

  typeTreeData: states => states.typeTreeData,

  filterCode: states => states.filterCode,

  oldCheckedArr: states => states.oldCheckedArr,

  respondMap: states => states.respondMap
}

export default getters
