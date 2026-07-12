/** 防抖
 * n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时
 */

// 简易版防抖函数
function baseDebounce(fn, delay) {
  let timer = null
  const _debounce = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
      timer = null
    }, delay)
  }
  return _debounce
}

// 标准版防抖函数
function _debounce(fn, delay) {
  let timer = null
  const _debounce = function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
  return _debounce
}

/** 扩展版防抖函数
 * 1. 支持取消防抖，在停止高频率事件后，在0 ~ delay ms内可以取消防抖操作
 * 2. 立即执行，在首次执行高频率事件时，立即执行一次，然后再执行防抖操作，然后随着执行高频率事件循环往复
 * 3. 返回值，在防抖函数执行完毕后返回fn函数的结果
 */
function debounce(fn, delay, immediate = false) {
  let timer = null
  let isInvoke = false
  const _debounce = function (...args) {
    let result = undefined
    return new Promise((resolve, reject) => {
      try {
        if (timer) clearTimeout(timer)
        if (immediate && !isInvoke) {
          result = fn.apply(this, args)
          isInvoke = true
          resolve(result)
        }
        timer = setTimeout(() => {
          result = fn.apply(this, args)
          timer = null
          isInvoke = false
          resolve(result)
        }, delay)
      } catch (e) {
        reject(e)
      }
    })
  }
  // 绑定一个取消的函数
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
  }
  return _debounce
}

export { baseDebounce, _debounce, debounce }
