import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useBoardPullToRefresh } from "./useBoardPullToRefresh";

function touchEvent(type: string, x: number, y: number) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "touches", { value: type === "touchend" ? [] : [{ clientX: x, clientY: y }] });
  document.body.dispatchEvent(event);
}

beforeEach(() => {
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});
afterEach(() => { vi.restoreAllMocks(); });

describe("모바일 당겨서 새로고침", () => {
  it("화면 상단에서 충분히 아래로 당겨 놓으면 한 번 실행한다", () => {
    const refresh = vi.fn(async () => {});
    const { result } = renderHook(() => useBoardPullToRefresh(refresh, false));
    expect(result.current.progress).toBe(0);
    act(() => { touchEvent("touchstart", 20, 20); touchEvent("touchmove", 20, 92); });
    expect(result.current.progress).toBe(0.5);
    act(() => touchEvent("touchmove", 20, 180));
    expect(result.current.ready).toBe(true);
    expect(result.current.progress).toBe(1);
    act(() => touchEvent("touchend", 20, 180));
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("내부 스크롤 영역이 내려가 있으면 당기기를 가로채지 않는다", () => {
    const refresh = vi.fn(async () => {});
    renderHook(() => useBoardPullToRefresh(refresh, false));
    const inner = document.createElement("div");
    inner.style.overflowY = "auto";
    inner.scrollTop = 20;
    document.body.appendChild(inner);
    const event = new Event("touchstart", { bubbles: true });
    Object.defineProperty(event, "touches", { value: [{ clientX: 20, clientY: 20 }] });
    act(() => {
      inner.dispatchEvent(event);
      touchEvent("touchmove", 20, 180);
      touchEvent("touchend", 20, 180);
    });
    inner.remove();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("충분히 당긴 뒤 시작점으로 돌아와 놓으면 새로고침하지 않는다", () => {
    const refresh = vi.fn(async () => {});
    const { result } = renderHook(() => useBoardPullToRefresh(refresh, false));
    act(() => { touchEvent("touchstart", 20, 20); touchEvent("touchmove", 20, 180); });
    expect(result.current.ready).toBe(true);
    act(() => touchEvent("touchmove", 20, 20));
    expect(result.current.progress).toBe(0);
    act(() => touchEvent("touchend", 20, 20));
    expect(refresh).not.toHaveBeenCalled();
  });

  it("스크롤 중이거나 가로 방향 제스처는 무시한다", () => {
    const refresh = vi.fn(async () => {});
    renderHook(() => useBoardPullToRefresh(refresh, false));
    document.body.scrollTop = 10;
    act(() => { touchEvent("touchstart", 20, 20); touchEvent("touchmove", 20, 180); touchEvent("touchend", 20, 180); });
    document.body.scrollTop = 0;
    act(() => { touchEvent("touchstart", 20, 20); touchEvent("touchmove", 180, 40); touchEvent("touchend", 180, 40); });
    expect(refresh).not.toHaveBeenCalled();
  });
});
