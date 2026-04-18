import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toast, toastStore } from "./toastStore";

describe("toastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Toast.hide();
  });

  afterEach(() => {
    Toast.hide();
    vi.useRealTimers();
  });

  it("Toast.show는 토스트를 최대 5개까지만 유지한다", () => {
    Array.from({ length: 6 }, (_, index) => {
      Toast.show({
        message: `토스트 ${index + 1}`,
        type: "info",
        duration: 0,
      });
    });

    expect(toastStore.getState().toasts.map(({ message }) => message)).toEqual([
      "토스트 2",
      "토스트 3",
      "토스트 4",
      "토스트 5",
      "토스트 6",
    ]);
  });

  it("각 토스트는 자신의 duration이 지나면 제거된다", () => {
    Toast.show({ message: "짧은 토스트", duration: 1000 });
    Toast.show({ message: "긴 토스트", duration: 3000 });

    vi.advanceTimersByTime(1000);

    expect(toastStore.getState().toasts.map(({ message }) => message)).toEqual([
      "긴 토스트",
    ]);

    vi.advanceTimersByTime(2000);

    expect(toastStore.getState().toasts).toEqual([]);
  });

  it("Toast.hide는 개별 토스트 또는 전체 토스트를 제거한다", () => {
    Toast.show({ message: "첫 번째", duration: 0 });
    Toast.show({ message: "두 번째", duration: 0 });

    const [firstToast] = toastStore.getState().toasts;
    expect(firstToast).toBeDefined();

    Toast.hide(firstToast?.id);

    expect(toastStore.getState().toasts.map(({ message }) => message)).toEqual([
      "두 번째",
    ]);

    Toast.hide();

    expect(toastStore.getState().toasts).toEqual([]);
  });
});
