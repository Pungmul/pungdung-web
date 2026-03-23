import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  scrollCommentIntoVisibleViewport,
  VISUAL_VIEWPORT_KEYBOARD_THRESHOLD_PX,
} from "./scroll-comment-into-visible-viewport";

function mockRect(partial: Partial<DOMRect>): DOMRect {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    toJSON: () => ({}),
    ...partial,
  } as DOMRect;
}

describe("scrollCommentIntoVisibleViewport", () => {
  beforeEach(() => {
    vi.stubGlobal("innerHeight", 800);
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        height: 500,
        offsetTop: 0,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("이미 safe band 안이면 스크롤하지 않는다", () => {
    const scrollRoot = document.createElement("div");
    const target = document.createElement("div");
    const composer = document.createElement("form");

    scrollRoot.scrollTo = vi.fn();
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 120, bottom: 180 })
    );
    vi.spyOn(composer, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 460 })
    );

    const result = scrollCommentIntoVisibleViewport({
      scrollRoot,
      target,
      composerEl: composer,
      headerEl: null,
      padding: 8,
    });

    expect(result).toEqual({ scrolled: false, delta: 0 });
    expect(scrollRoot.scrollTo).not.toHaveBeenCalled();
  });

  it("target이 safe band 위면 scrollTop을 줄인다", () => {
    const scrollRoot = document.createElement("div");
    const target = document.createElement("div");
    const composer = document.createElement("form");

    scrollRoot.scrollTop = 300;
    scrollRoot.scrollTo = vi.fn();

    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 4, bottom: 60 })
    );
    vi.spyOn(composer, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 460 })
    );

    const result = scrollCommentIntoVisibleViewport({
      scrollRoot,
      target,
      composerEl: composer,
    });

    expect(result.scrolled).toBe(true);
    expect(result.delta).toBe(-4);
    expect(scrollRoot.scrollTo).toHaveBeenCalledWith({
      top: 296,
      behavior: "smooth",
    });
  });

  it("target이 composer 아래로 가리면 scrollTop을 늘린다", () => {
    const scrollRoot = document.createElement("div");
    const target = document.createElement("div");
    const composer = document.createElement("form");

    scrollRoot.scrollTop = 100;
    scrollRoot.scrollTo = vi.fn();

    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 430, bottom: 490 })
    );
    vi.spyOn(composer, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 460 })
    );

    const result = scrollCommentIntoVisibleViewport({
      scrollRoot,
      target,
      composerEl: composer,
    });

    expect(result.scrolled).toBe(true);
    expect(result.delta).toBe(38);
    expect(scrollRoot.scrollTo).toHaveBeenCalledWith({
      top: 138,
      behavior: "smooth",
    });
  });

  it("extraScrollTopDelta만 있어도 스크롤한다 (moveToHash용)", () => {
    const scrollRoot = document.createElement("div");
    const target = document.createElement("div");
    const composer = document.createElement("form");

    scrollRoot.scrollTop = 200;
    scrollRoot.scrollTo = vi.fn();
    Object.defineProperty(target, "offsetHeight", { value: 120, configurable: true });

    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 120, bottom: 180 })
    );
    vi.spyOn(composer, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 460 })
    );

    const result = scrollCommentIntoVisibleViewport({
      scrollRoot,
      target,
      composerEl: composer,
      extraScrollTopDelta: -120,
    });

    expect(result).toEqual({ scrolled: true, delta: -120 });
    expect(scrollRoot.scrollTo).toHaveBeenCalledWith({
      top: 80,
      behavior: "smooth",
    });
  });
});

describe("VISUAL_VIEWPORT_KEYBOARD_THRESHOLD_PX", () => {
  it("iOS opacity fix와 동일한 키보드 임계값을 쓴다", () => {
    expect(VISUAL_VIEWPORT_KEYBOARD_THRESHOLD_PX).toBe(80);
  });
});
