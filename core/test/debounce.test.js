import { test, expect, describe, vi } from "vitest"
import { baseDebounce, _debounce, debounce } from "../debounce"

describe("防抖函数测试", () => {
  const testFn = {
    noReturnFn: vi.fn(() => undefined),
    returnFn: vi.fn((a, b) => a + b),
  }

  test("baseDebounce 测试", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"], shouldAdvanceTime: true })
    const spyFn = testFn.noReturnFn
    const fn = baseDebounce(spyFn, 1000)

    fn()
    expect(spyFn).toHaveBeenCalledTimes(0)
    await vi.advanceTimersToNextTimerAsync()
    expect(spyFn).toHaveBeenCalledTimes(1)
    fn()
    fn()
    fn()
    await vi.runAllTimersAsync()
    expect(spyFn).toHaveBeenCalledTimes(2)
  })

  test("_debounce 测试", async () => {
    vi.useFakeTimers()
    const spyFn = vi.spyOn(testFn, "returnFn")
    const fn = _debounce(spyFn, 1000)

    fn(1, 2)
    expect(spyFn).toHaveBeenCalledTimes(0)
    await vi.advanceTimersToNextTimerAsync()
    expect(spyFn).toHaveBeenCalledTimes(1)
    expect(spyFn).toHaveBeenCalledWith(1, 2)
    fn(1, 2)
    fn(1, 2)
    fn(1, 2)
    await vi.runAllTimersAsync()
    expect(spyFn).toHaveBeenCalledTimes(2)
    expect(spyFn).toHaveNthReturnedWith(2, 3)
  })

  test("debounce 测试", async () => {
    vi.useFakeTimers()
    const spyFn = vi.spyOn(testFn, "returnFn")
    const fn = debounce(spyFn, 1000)

    fn(1, 2)
    expect(spyFn).toHaveBeenCalledTimes(0)
    await vi.advanceTimersToNextTimerAsync()
    expect(spyFn).toHaveBeenCalledTimes(1)
    expect(spyFn).toHaveBeenCalledWith(1, 2)
    fn(1, 2)
    fn(1, 2)
    fn(1, 2)
    await vi.runAllTimersAsync()
    expect(spyFn).toHaveBeenCalledTimes(2)
    expect(spyFn).toHaveNthReturnedWith(2, 3)

    // 测试取消
    const cancelFn = fn.cancel
    fn(1, 2)
    cancelFn()
    await vi.runAllTimersAsync()
    expect(spyFn).toHaveBeenCalledTimes(2)

    // 测试立即触发
    const immediateFn = debounce(spyFn, 1000, true)
    immediateFn(1, 2)
    expect(spyFn).toHaveBeenCalledTimes(3)
    await vi.advanceTimersToNextTimerAsync()
    expect(spyFn).toHaveBeenCalledTimes(4)
  })
})
