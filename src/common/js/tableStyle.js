export const STYLE_CONFIG = {
  fontSize: '14px',
  fontWeight: 'bold'
}

// 根据树列表选中的终端(use by component components)
export function TextColor (strText) {
  if (strText === '---') {
    return 'black'
  }
  let mapArr = ['异常', '有', '存在异常', '开灯', '离线', '闭合', '打开']
  let flag = false
  mapArr.map((item) => {
    if (item === strText) {
      flag = true
    }
  })
  if (flag === true) {
    return 'red'
  } else {
    return 'green'
  }
}

// 左右侧字体大小
export function TextSize (size) {
  if (size === 'middle') {
    return '14px'
  } else if (size === 'large') {
    return '16px'
  } else {
    return '12px'
  }
}

// 终端是否使用,默认使用
export function IsUsed (flag) {
  if (flag === true || flag === undefined) {
    return 'green'
  } else {
    return 'gray'
  }
}
