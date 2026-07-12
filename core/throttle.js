/**
 * 节流：n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效
 */

/**
 * 思路：
 * 等待时间 = 间隔 - (当前时间 - 开始时间)
 * if(等待时间 <= 0) {
 *  fn()
 *  开始时间 = 当前时间
 * }
 */

// 基础版
function baseThrottle(fn, interval) {
  let startTime = 0
  const _throttle = function () {
    const nowTime = new Date().getTime()
    const waitTime = interval - (nowTime - startTime)
    if (waitTime <= 0) {
      fn()
      startTime = nowTime
    }
  }
  return _throttle
}

// 标准版
function _throttle(fn, interval) {
  let startTime = 0
  const _throttle = function (...args) {
    const nowTime = new Date().getTime()
    const waitTime = interval - (nowTime - startTime)
    if (waitTime <= 0) {
      fn.apply(this, args)
      startTime = nowTime
    }
  }
  return _throttle
}

/** 扩展版节流函数
 * 1.对立即执行进行控制
 *  options.leading 为 false 时，第一次执行高频率事件不会触发fn函数，且才开始倒计时，倒计时完毕才会执行fn函数
 * 2.对尾部进行控制
 *  options.trailing 为 true 时，会在最后一次触发高频率事件触发fn函数，怎么判断用户是不是最后一次触发这个非常不好把握
 * 3.节流取消功能
 * 4.节流函数返回值
 */
function throttle(fn, interval, { leading = true, trailing = false } = {}) {
  let startTime = 0
  let timer = null
  let res = undefined
  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      try {
        const nowTime = new Date().getTime()
        // 对立即执行进行控制
        if (!leading && startTime === 0) {
          startTime = nowTime
        }
        const waitTime = interval - (nowTime - startTime)
        if (waitTime <= 0) {
          if (timer) clearTimeout(timer)
          res = fn.apply(this, args)
          startTime = nowTime
          resolve(res)
        }
        // 判断是否尾部执行
        if (trailing && !timer) {
          timer = setTimeout(() => {
            res = fn.apply(this, args)
            startTime = new Date().getTime()
            timer = null
            resolve(res)
          }, waitTime)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  // 取消功能
  _throttle.cancel = function () {
    if (timer) clearTimeout(timer)
    startTime = 0
    timer = null
  }
  return _throttle
}

module.exports = {
  baseThrottle,
  _throttle,
  throttle,
}
