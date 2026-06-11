import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyDigitUpdateWithFlash,
  computeRemainingParts,
  readDisplayedInt,
} from "./time-gap-panel-countdown";

describe("computeRemainingParts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-27T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("미래 시각의 분·초를 계산한다", () => {
    const target = new Date("2026-04-27T10:03:45Z").toISOString();
    const result = computeRemainingParts(target);
    expect(result.minutes).toBe(3);
    expect(result.seconds).toBe(45);
  });

  it("정확히 1분이면 minutes=1, seconds=0", () => {
    const target = new Date("2026-04-27T10:01:00Z").toISOString();
    const result = computeRemainingParts(target);
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(0);
  });

  it("과거 시각이면 음수를 반환한다", () => {
    const past = new Date("2026-04-27T09:59:00Z").toISOString();
    const result = computeRemainingParts(past);
    expect(result.minutes).toBeLessThan(0);
  });
});

describe("readDisplayedInt", () => {
  it("숫자 문자열을 파싱한다", () => {
    expect(readDisplayedInt("05")).toBe(5);
    expect(readDisplayedInt("42")).toBe(42);
  });

  it("null/undefined/빈 값은 0을 반환한다", () => {
    expect(readDisplayedInt(null)).toBe(0);
    expect(readDisplayedInt(undefined)).toBe(0);
    expect(readDisplayedInt("")).toBe(0);
  });

  it("숫자로 파싱 불가한 문자열은 0을 반환한다", () => {
    expect(readDisplayedInt("abc")).toBe(0);
  });
});

describe("applyDigitUpdateWithFlash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("el이 null이면 undefined를 반환한다", () => {
    const result = applyDigitUpdateWithFlash(null, 5, vi.fn());
    expect(result).toBeUndefined();
  });

  it("값이 같으면 업데이트하지 않고 undefined를 반환한다", () => {
    const el = document.createElement("div");
    el.textContent = "05";
    const result = applyDigitUpdateWithFlash(el, 5, vi.fn());
    expect(result).toBeUndefined();
  });

  it("값이 다르면 textContent를 두 자리로 갱신하고 id를 반환한다", () => {
    const el = document.createElement("div");
    el.textContent = "03";
    const onFlashComplete = vi.fn();
    const id = applyDigitUpdateWithFlash(el, 7, onFlashComplete);
    expect(el.textContent).toBe("07");
    expect(id).toBeDefined();
  });

  it("플래시 완료 후 onFlashComplete가 호출된다", () => {
    const el = document.createElement("div");
    el.textContent = "00";
    const onFlashComplete = vi.fn();
    applyDigitUpdateWithFlash(el, 9, onFlashComplete);
    vi.runAllTimers();
    expect(onFlashComplete).toHaveBeenCalledOnce();
  });
});
