import { expect, describe, vi, test } from "vitest"
import { baseThrottle, _throttle, throttle } from "../throttle.js"

describe("节流函数测试", () => {
  test("baseThrottle 测试", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    const spyFn = vi.fn(() => undefined)
    const fn = baseThrottle(spyFn, 1000)

    fn()
    expect(spyFn).toHaveBeenCalledTimes(1)
    fn()
    expect(spyFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1000)
    expect(spyFn).toHaveBeenCalledTimes(1)
    fn()
    fn()
    fn()
    expect(spyFn).toHaveBeenCalledTimes(2)
  })

  test("_baseThrottle 测试", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    const spyFn = vi.fn((a, b) => String(a) + " " + String(b))
    const fn = _throttle(spyFn, 1000)

    fn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(1)
    fn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1000)
    expect(spyFn).toHaveBeenCalledTimes(1)
    fn("hello", "world")
    fn("hello", "world")
    fn("hello", "world")
    expect(spyFn).toHaveBeenCalledWith("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(2)
    expect(spyFn).toHaveNthReturnedWith(2, "hello world")
  })

  test("throttle 测试", () => {
    vi.useFakeTimers()
    const spyFn = vi.fn((a, b) => String(a) + " " + String(b))
    const fn = throttle(spyFn, 1000)

    fn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(1)
    fn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1000)
    expect(spyFn).toHaveBeenCalledTimes(1)
    fn("hello", "world")
    fn("hello", "world")
    fn("hello", "world")
    expect(spyFn).toHaveBeenCalledWith("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(2)
    expect(spyFn).toHaveNthReturnedWith(2, "hello world")

    // 测试options.leading为false
    const noLeadingFn = throttle(spyFn, 1000, { leading: false })
    noLeadingFn("hello", "world")
    noLeadingFn("hello", "world")
    noLeadingFn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(1000)
    fn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(3)

    // 测试options.trailing为true
    const trailingFn = throttle(spyFn, 1000, { trailing: true })
    trailingFn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(4)
    trailingFn("hello", "world")
    trailingFn("hello", "world")
    trailingFn("hello", "world")
    trailingFn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(4)
    vi.advanceTimersByTime(1000)
    // bug: 间谍函数spyFn 触发应是5次，而不是测试中的4次
    expect(spyFn).toHaveBeenCalledTimes(5)

    // 取消节流操作
    const cancelFn = trailingFn.cancel
    trailingFn("hello", "world")
    expect(spyFn).toHaveBeenCalledTimes(6)
    vi.advanceTimersByTime(400)
    trailingFn("hello", "world")
    cancelFn()
    vi.advanceTimersByTime(600)
    expect(spyFn).toHaveBeenCalledTimes(6)
  })
})
