import { test, expect, describe } from "vitest"
import { _deepClone, deepClone, superDeepClone } from "../deepClone"

var obj1 = {
  a: 1,
  b: "hello",
  c: [{ c1: 123 }, [1, 2, 3, 4, 5], [[0], [1], [2]]],
  d: {
    d1: "d1 is string",
    d2: ["d2_1", "d2_2"],
    d3: null,
  },
}

const obj2 = {
  a: 1,
  b: "hello",
  c: [{ c1: 123 }, [1, 2, 3, 4, 5], [[0], [1], [2]]],
  d: {
    d1: "d1 is string",
    d2: ["d2_1", "d2_2"],
    d3: null,
  },
  e: {
    e1: new Date(),
    e2: function () {
      return "e2"
    },
    e3: new RegExp(),
  },
}

describe("深度克隆测试 _deepClone, deepClone, superDeepClone", () => {
  test("深度克隆测试 ES5", () => {
    /**
     * 1. 判断对象中值完全相等
     * 2. 判断对象不相等（内存地址不一样）
     */
    expect(obj1).toEqual(_deepClone(obj1))
    expect(_deepClone(obj1)).not.toBe(obj1)
  })

  test("深度克隆测试 ES6", () => {
    expect(obj2).toEqual(deepClone(obj2))
    expect(deepClone(obj2)).not.toBe(obj2)
  })

  test("深度克隆测试 ES6 对象相互引用", () => {
    const obj3 = {}
    const obj4 = {}
    obj3.t3 = obj4
    obj4.t4 = obj3
    expect(obj2).toEqual(superDeepClone(obj2))
    expect(obj2).not.toBe(superDeepClone(obj2))
    expect(obj3).toEqual(superDeepClone(obj3))
    expect(obj3).not.toBe(superDeepClone(obj3))
  })
})
