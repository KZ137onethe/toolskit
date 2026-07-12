/**
 * ES5中的深度克隆
 * @param {Object.<string, any>} origin 原对象
 * @param {undefined | Object.<string, any>} target 原对象会被克隆到该对象中
 * @returns 克隆后的对象
 */
function _deepClone(origin, target) {
  var tar = target || {}
  var toStr = Object.prototype.toString
  var arrType = "[object Array]"

  for (let key in origin) {
    if (origin.hasOwnProperty(key)) {
      if (typeof origin[key] === "object" && origin[key] !== null) {
        tar[key] = toStr.call(origin[key]) === arrType ? [] : {}
        _deepClone(origin[key], tar[key])
      } else {
        tar[key] = origin[key]
      }
    }
  }
  return tar
}


/**
 * ES6普适型深度克隆
 * @param {Object.<string, any>} origin 原对象
 * @returns 克隆后的对象
 * @summary
 * * 缺点:
 *    1. 无法处理循环引用
 */
function deepClone(origin) {
  if (origin == undefined || typeof origin !== "object") {
    return origin
  }
  if (origin instanceof Date) {
    return origin
  }
  if (origin instanceof RegExp) {
    return origin
  }
  const target = new origin.constructor()
  for (let key in origin) {
    if (origin.hasOwnProperty(key)) {
      target[key] = deepClone(origin[key])
    }
  }
  return target
}

/**
 * ES6通用型深度克隆
 * @param {any} origin 原对象
 * @param {Map.<string, any>} hashMap 记录循环引用
 * @returns 克隆后的对象
 * @summary
 * * 解决:
 *    1. 处理循环引用
 */
function superDeepClone(origin, hashMap = new WeakMap()) {
  if (origin == undefined || typeof origin !== "object") {
    return origin
  }
  if (origin instanceof Date) {
    return origin
  }
  if (origin instanceof RegExp) {
    return origin
  }
  const hashKey = hashMap.get(origin)
  if (hashKey) {
    return hashKey
  }
  const target = new origin.constructor()
  hashMap.set(origin, target)
  for (let k in origin) {
    if (origin.hasOwnProperty(k)) {
      target[k] = superDeepClone(origin[k], hashMap)
    }
  }
  return target
}

/**
 * 现代化深度克隆(Node17以上支持)
 * @param {Object.<string, any>} origin 原对象
 * @returns 克隆后的对象
 * @summary
 *  * 优点:
 *    1. 可以替代 JSON.parse(JSON.stringify(obj))
 *    2. 可以处理循环引用
 *    3. 可以处理特殊的数据类型,如: Symbol,Date,undefined,RegExp,NaN,Infinity,Map,Set,WeakMap,WeakSet等
 * * 缺点:
 *    1. 不支持函数、DOM节点、原型链
 */
function modernDeepClone(origin) {
  return structuredClone(origin)
}

export { _deepClone, deepClone, superDeepClone, modernDeepClone }
