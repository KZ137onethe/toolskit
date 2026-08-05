import { expect, describe, vi, test } from "vitest";
import { base_throttle, _throttle, throttle } from "../throttle.js";

describe("all throttle function test", () => {
  const random_val = (min, max) => min + Math.floor(Math.random() * (max - min));

  // 推迟时间
  const delayed_time = ({ now, val, cb, args = [] }) => {
    if (Array.isArray(val) && val.length === 2 && val[1] > val[0]) {
      now = new Date(now + random_val(...val)).getTime();
    } else if (!Array.isArray(val)) {
      now = new Date(now + val).getTime();
    } else {
      throw new Error("params is error");
    }
    vi.setSystemTime(new Date(now));
    if (cb instanceof Function) {
      cb(...args);
    }

    return now;
  };

  test("base_throttle function test", async () => {
    vi.useFakeTimers({ toFake: ["Date"], shouldAdvanceTime: true });
    const spyFn = vi.fn(() => undefined);
    const fn = base_throttle(spyFn, 1000);
    let now_timestamp = new Date().getTime();
    fn();
    expect(spyFn).toHaveBeenCalledTimes(1);
    // 时间推迟0~600ms
    now_timestamp = delayed_time({ now: now_timestamp, val: [0, 600], cb: fn });
    expect(spyFn).toHaveBeenCalledTimes(1);
    // 时间推迟1000ms
    now_timestamp = delayed_time({ now: now_timestamp, val: 1000, cb: fn });
    expect(spyFn).toHaveBeenCalledTimes(2);
    // 3次触发总时长不超过 1000ms
    for (let i = 0; i < 3; i++) {
      now_timestamp = delayed_time({
        now: now_timestamp,
        val: [0, Math.floor(1000 / 3)],
        cb: fn,
        args: ["hello", "world"],
      });
    }
    // 时间推迟2000ms之后
    delayed_time({ now: now_timestamp, val: 2000, is_range: false, cb: fn });
    expect(spyFn).toHaveBeenCalledTimes(3);
  });

  test("_throttle function test", async () => {
    vi.useFakeTimers({ toFake: ["Date"], shouldAdvanceTime: true });
    const spyFn = vi.fn((a, b) => String(a) + " " + String(b));
    const fn = _throttle(spyFn, 1000);
    let now_timestamp = new Date().getTime();

    fn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(1);
    delayed_time({ now: now_timestamp, val: 500, cb: fn, args: ["hello", "world"] });
    expect(spyFn).toHaveBeenCalledTimes(1);
    delayed_time({ now: now_timestamp, val: 1000, cb: fn, args: ["hello", "world"] });
    expect(spyFn).toHaveBeenCalledTimes(2);
    // 3次触发总时长不超过 1000ms
    for (let i = 0; i < 3; i++) {
      now_timestamp = delayed_time({
        now: now_timestamp,
        val: [0, Math.floor(1000 / 3)],
        cb: fn,
        args: ["hello", "world"],
      });
    }
    // 时间推迟2000ms之后
    delayed_time({ now: now_timestamp, val: 2000, is_range: false, cb: fn });
    expect(spyFn).toHaveBeenCalledTimes(3);
  });

  test("throttle function test", async () => {
    // basic test
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"], shouldAdvanceTime: true });
    const spyFn = vi.fn((a, b) => [a, b].toString());
    const fn = throttle(spyFn, 1000);
    let now_timestamp = new Date().getTime();

    fn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(1);
    now_timestamp = delayed_time({
      now: now_timestamp,
      val: [100, 999],
      cb: fn,
      args: ["hello", "world"],
    });
    expect(spyFn).toHaveBeenCalledTimes(1);
    now_timestamp = delayed_time({
      now: now_timestamp,
      val: 1000,
      cb: fn,
      args: ["hello", "world"],
    });
    expect(spyFn).toHaveBeenCalledTimes(2);
    // 3次触发总时长不超过 1000ms
    for (let i = 0; i < 3; i++) {
      now_timestamp = delayed_time({
        now: now_timestamp,
        val: [0, Math.floor(1000 / 3)],
        cb: fn,
        args: ["hello", "world"],
      });
    }
    expect(spyFn).toHaveBeenCalledWith("hello", "world");
    now_timestamp = delayed_time({
      now: now_timestamp,
      val: 2000,
      cb: fn,
      args: ["hello", "world"],
    });
    expect(spyFn).toHaveBeenCalledTimes(3);
    expect(spyFn).toHaveNthReturnedWith(3, ["hello", "world"].toString());
    now_timestamp += 1000;
    vi.setSystemTime(new Date(now_timestamp));

    // test options.leading = false
    vi.resetAllMocks();
    const noLeadingFn = throttle(spyFn, 1000, { leading: false });
    // 进入冷却
    noLeadingFn("hi", "boy!");
    noLeadingFn("hello", "world");
    noLeadingFn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(0);
    now_timestamp += 1000;
    vi.setSystemTime(new Date(now_timestamp));
    // 冷却结束
    noLeadingFn("ha", "ha");
    expect(spyFn).toHaveBeenCalledTimes(1);
    expect(spyFn).toHaveNthReturnedWith(1, "ha,ha");
    now_timestamp += 1000;
    vi.setSystemTime(new Date(now_timestamp));

    // test options.trailing = true
    vi.resetAllMocks();
    const trailingFn = throttle(spyFn, 1000, { trailing: true });
    trailingFn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(1);
    now_timestamp += 1000;
    vi.setSystemTime(new Date(now_timestamp));
    expect(spyFn).toHaveBeenCalledTimes(1);
    trailingFn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(2);
    trailingFn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1000);
    expect(spyFn).toHaveBeenCalledTimes(3);
    now_timestamp += 1000;
    vi.setSystemTime(new Date(now_timestamp));

    // test cancel method
    // Only exists when trailing = true
    vi.resetAllMocks();
    const cancelThrottleFn = throttle(spyFn, 1000, { trailing: true });
    const cancelFn = cancelThrottleFn.cancel;
    cancelThrottleFn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(1);
    now_timestamp += 1000;
    vi.setSystemTime(new Date(now_timestamp));
    cancelThrottleFn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(2);
    cancelThrottleFn("hello", "world");
    expect(spyFn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(600);
    cancelFn();
    await vi.advanceTimersByTimeAsync(500);
    expect(spyFn).toHaveBeenCalledTimes(2);
  });
});
