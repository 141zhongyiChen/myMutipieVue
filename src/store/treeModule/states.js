const states = {

  // 记录 当前 终端码
  treeTerminal: null,

  // 记录 当前 操作 数据
  treeSelectedArr: [],

  // 记录 当前 勾选 的 数据
  treeCheckedArr: [],

  // 记录 初始页面请求数据（该数据已经过 指定参数 去重）
  respondData: null,

  // 记录 12位地址码[电能量相关]
  treeAddressCode: null,

  // 记录 当前运行编码[亮灯率相关]
  treeRunningCode: null,

  // 新增优化
  listTreeData: [],
  regionTreeData: [],
  typeTreeData: [],
  filterCode: null,
  oldCheckedArr: [],
  //
  respondMap: new Map(),
  //
  treeCheckedMap: new Map()
}

export default states
