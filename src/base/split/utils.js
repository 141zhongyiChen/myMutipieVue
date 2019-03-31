import Vue from 'vue'
const isServer = Vue.prototype.$isServer

/**
 *@functionName: on
 *@desc Add event listener
 *@return
 *@date 2018/11/08 14:04:42
 */
//
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 *@functionName: off
 *@desc Remove event listener
 *@return
 *@date 2018/11/08 14:05:26
 */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 *@functionName: oneOf
 *@desc Props 参数是否符合其中其中之一
 *@return
 *@date 2018/11/08 14:07:01
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}
