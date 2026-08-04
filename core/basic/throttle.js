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

/**
 * 基础版节流函数（传递返回的函数参数无效！）
 * @param {Function} fn 需要控制节流的函数
 * @param {number} interval 时间间隔
 * @returns {Function}
 */
function base_throttle(fn, interval) {
  let startTime = 0;
  const _throttle = function () {
    const nowTime = new Date().getTime();
    const waitTime = interval - (nowTime - startTime);
    if (waitTime <= 0) {
      fn();
      startTime = nowTime;
    }
  };
  return _throttle;
}

/**
 * 能用版节流函数（传递返回的函数参数有效）
 * @param {Function} fn 需要控制节流的函数
 * @param {number} interval 时间间隔
 * @returns {Function}
 */
function _throttle(fn, interval) {
  let startTime = 0;
  const _throttle = function (...args) {
    const nowTime = new Date().getTime();
    const waitTime = interval - (nowTime - startTime);
    if (waitTime <= 0) {
      fn.apply(this, args);
      startTime = nowTime;
    }
  };
  return _throttle;
}

/**
 * 扩展版节流函数
 * @param {Function} fn 需要控制节流的函数
 * @param {number} interval 时间间隔
 * @param {Object} args 控制参数
 * @param {boolean} args.leading 是否立即执行，不立即执行会被延迟到时间间隔末尾
 * @param {boolean} args.trailing 是否允许在最后一次触发后，等待间隔结束时再执行一次
 * @returns {Function & { cancel: () => void }} cancel方法用于取消执行函数
 */
function throttle(fn, interval, { leading = true, trailing = false } = {}) {
  let startTime = 0;
  let timer = null;
  let res = undefined;
  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      try {
        const nowTime = new Date().getTime();
        // 对立即执行进行控制
        if (!leading && startTime === 0) {
          startTime = nowTime;
        }
        const waitTime = interval - (nowTime - startTime);
        if (waitTime <= 0) {
          if (timer) clearTimeout(timer);
          res = fn.apply(this, args);
          startTime = nowTime;
          resolve(res);
        }
        // 判断是否尾部执行
        if (trailing && !timer) {
          timer = setTimeout(() => {
            res = fn.apply(this, args);
            startTime = new Date().getTime();
            timer = null;
            resolve(res);
          }, waitTime);
        }
      } catch (e) {
        reject(e);
      }
    });
  };
  // 取消功能
  _throttle.cancel = function () {
    if (timer) clearTimeout(timer);
    startTime = 0;
    timer = null;
  };
  return _throttle;
}

export { base_throttle, _throttle, throttle };
