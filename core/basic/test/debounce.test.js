import { test, expect, describe, vi } from "vitest";
import { baseDebounce, _debounce, debounce } from "../debounce.js";

describe("all debounce function test", () => {
  const testFn = {
    noReturnFn: vi.fn(() => undefined),
    returnFn: vi.fn((a, b) => a + b),
  };

  test("baseDebounce function test", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"], shouldAdvanceTime: true });
    const spyFn = vi.fn(() => undefined);
    const fn = baseDebounce(spyFn, 200);

    fn();
    expect(spyFn).toHaveBeenCalledTimes(0);
    await vi.advanceTimersToNextTimerAsync();
    expect(spyFn).toHaveBeenCalledTimes(1);
    fn();
    fn();
    fn();
    await vi.runAllTimersAsync();
    expect(spyFn).toHaveBeenCalledTimes(2);
  });

  test("_debounce function test", async () => {
    vi.useFakeTimers();
    const spyFn = vi.fn((a, b) => a + b);
    const fn = _debounce(spyFn, 200);

    fn(1, 2);
    expect(spyFn).toHaveBeenCalledTimes(0);
    await vi.advanceTimersToNextTimerAsync();
    expect(spyFn).toHaveBeenCalledTimes(1);
    expect(spyFn).toHaveBeenCalledWith(1, 2);
    fn(1, 2);
    fn(1, 2);
    fn(1, 2);
    await vi.runAllTimersAsync();
    expect(spyFn).toHaveBeenCalledTimes(2);
    expect(spyFn).toHaveNthReturnedWith(2, 3);
  });

  test("debounce function test", async () => {
    vi.useFakeTimers();
    const spyFn = vi.fn((a, b) => a + b);
    const fn = debounce(spyFn, 200);

    fn(1, 2);
    expect(spyFn).toHaveBeenCalledTimes(0);
    await vi.advanceTimersToNextTimerAsync();
    expect(spyFn).toHaveBeenCalledTimes(1);
    expect(spyFn).toHaveBeenCalledWith(1, 2);
    fn(1, 2);
    fn(1, 2);
    fn(1, 2);
    await vi.runAllTimersAsync();
    expect(spyFn).toHaveBeenCalledTimes(2);
    expect(spyFn).toHaveNthReturnedWith(2, 3);
    const promise = fn(1, 2);
    await vi.advanceTimersToNextTimerAsync();
    await expect(promise).resolves.toBe(3);

    // 测试取消
    vi.resetAllMocks();
    const cancelFn = fn.cancel;
    fn(1, 2);
    cancelFn();
    await vi.runAllTimersAsync();
    expect(spyFn).toHaveBeenCalledTimes(0);

    // 测试立即触发
    vi.resetAllMocks();
    const immediateFn = debounce(spyFn, 1000, true);
    immediateFn(1, 2);
    expect(spyFn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersToNextTimerAsync();
    expect(spyFn).toHaveBeenCalledTimes(2);
  });
});
