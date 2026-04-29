import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createForegroundVisibilityTracker } from "./foreground-visibility-tracker";

describe("createForegroundVisibilityTracker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("visibilitychange로 foreground 복귀 시 debounce 후 check를 호출한다", () => {
    const onForegroundCheck = vi.fn();
    const tracker = createForegroundVisibilityTracker(150, onForegroundCheck);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(onForegroundCheck).not.toHaveBeenCalled();

    vi.advanceTimersByTime(150);

    expect(onForegroundCheck).toHaveBeenCalledTimes(1);
    expect(onForegroundCheck).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Number)
    );

    tracker.dispose();
  });

  it("window focus/blur만으로는 check를 호출하지 않는다", () => {
    const onForegroundCheck = vi.fn();
    const tracker = createForegroundVisibilityTracker(150, onForegroundCheck);

    window.dispatchEvent(new Event("blur"));
    window.dispatchEvent(new Event("focus"));

    vi.advanceTimersByTime(150);

    expect(onForegroundCheck).not.toHaveBeenCalled();

    tracker.dispose();
  });

  it("visibilitychange와 pageshow가 연달아 발생해도 debounce로 한 번만 호출한다", () => {
    const onForegroundCheck = vi.fn();
    const tracker = createForegroundVisibilityTracker(150, onForegroundCheck);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("pageshow"));

    vi.advanceTimersByTime(150);

    expect(onForegroundCheck).toHaveBeenCalledTimes(1);

    tracker.dispose();
  });
});
