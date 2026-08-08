/** 防抖
 * n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时
 */

/**
 * 基础版防抖函数（传递返回的函数参数无效！）
 * @param {Function} fn 控制防抖的函数
 * @param {number} delay 时间间隔
 * @returns {Function}
 */
function baseDebounce(fn, delay) {
  let timer = null;
  const _debounce = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
  return _debounce;
}

/**
 * 标准版防抖函数（传递返回的函数参数有效）
 * @param {Function} fn 控制防抖的函数
 * @param {number} delay 时间间隔
 * @returns {Function}
 */
function _debounce(fn, delay) {
  let timer = null;
  const _debounce = function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
  return _debounce;
}

/**
 * 扩展版防抖函数
 * @param {Function.<>} fn 控制防抖的函数
 * @param {number} delay 时间间隔
 * @param {boolean} immediate 首次是否立即执行防抖函数
 * @returns {Promise<Function> & { cancel: () => void }>}
 */
function debounce(fn, delay, immediate = false) {
  let timer = null;
  let isInvoke = false;
  const _debounce = function (...args) {
    let result = undefined;
    return new Promise((resolve, reject) => {
      try {
        if (timer) clearTimeout(timer);
        if (immediate && !isInvoke) {
          result = fn.apply(this, args);
          isInvoke = true;
          resolve(result);
        }
        timer = setTimeout(() => {
          result = fn.apply(this, args);
          timer = null;
          isInvoke = false;
          resolve(result);
        }, delay);
      } catch (e) {
        reject(e);
      }
    });
  };
  // 绑定一个取消的函数
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  return _debounce;
}

export { baseDebounce, _debounce, debounce };
