import { test, expect, describe } from "vitest";
import { _deep_clone, deep_clone, super_deep_clone, modern_deep_clone } from "../deep_clone.js";

describe("all deep_clone function test", () => {
  test("_deep_clone function test", () => {
    const src = {
      num: 1,
      str: "s",
      obj: { a: 1, b: [2, 3] },
      arr: [1, { x: 2 }],
    };
    const cloned = _deep_clone(src);
    expect(cloned).toEqual(src);
    expect(cloned).not.toBe(src);
    expect(cloned.obj).not.toBe(src.obj);
    expect(cloned.arr).not.toBe(src.arr);
    expect(cloned.arr[1]).not.toBe(src.arr[1]);
  });

  test("deep_clone function test", () => {
    const src = {
      num: 1,
      str: "s",
      obj: { a: 1, b: [2, 3] },
      arr: [1, { x: 2 }],
      date: new Date("1988-10-01"),
      reg: /^[\d]+$/,
      fn: function () {},
    };
    const cloned = deep_clone(src);
    expect(cloned).toEqual(src);
    expect(cloned).not.toBe(src);
    expect(cloned.obj).not.toBe(src.obj);
    expect(cloned.arr).not.toBe(src.arr);
    expect(cloned.date).not.toBe(src.date);
    expect(cloned.reg).toBe(src.reg);
    expect(cloned.fn).toBe(src.fn);
  });

  test("super_deep_clone function test", () => {
    const src = {
      num: 1,
      str: "s",
      obj: { a: 1, b: [2, 3] },
      arr: [1, { x: 2 }],
      date: new Date("1988-10-01"),
      reg: /^[\d]+$/,
      fn: function () {},
      a: { name: "a" },
      b: { name: "b" },
    };
    src.a.b = src.b;
    src.b.a = src.a;

    const cloned = super_deep_clone(src);
    expect(cloned).toEqual(src);
    expect(cloned).not.toBe(src);
    expect(cloned.obj).not.toBe(src.obj);
    expect(cloned.arr).not.toBe(src.arr);
    expect(cloned.date).not.toBe(src.date);
    expect(cloned.reg).toBe(src.reg);
    expect(cloned.fn).toBe(src.fn);
    expect(cloned.a).not.toBe(src.a);
    expect(cloned.b).not.toBe(src.b);
		expect(cloned.a.b).toBe(cloned.b);
		expect(cloned.b.a).toBe(cloned.a);
  });

  if (typeof structuredClone === "function") {
    test("modern_deep_clone 使用 structuredClone 可拷贝 Map/Set 且引用不同", () => {
      const src = {
        m: new Map([[1, "a"]]),
        s: new Set([1, 2]),
      };
      const cloned = modern_deep_clone(src);
      expect(cloned).toEqual(src);
      expect(cloned).not.toBe(src);
      expect(cloned.m).not.toBe(src.m);
      expect(cloned.s).not.toBe(src.s);
      expect(cloned.m.get(1)).toBe("a");
      expect(cloned.s.has(2)).toBe(true);
    });
  } else {
    test.skip("modern_deep_clone (structuredClone) 在此环境不可用，跳过测试", () => {});
  }
});
