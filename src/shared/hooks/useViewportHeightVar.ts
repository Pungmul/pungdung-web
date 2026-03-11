"use client";

import { type RefObject, useEffect } from "react";

/**
 * 대상 요소에 현재 viewport height를 CSS 변수로 반영한다.
 * iOS 키보드/주소창 변화 시 채팅 컨테이너 높이를 줄이는 용도.
 */
export function useViewportHeightVar(targetRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const vv = window.visualViewport;

    const apply = () => {
      el.style.setProperty(
        "--app-height",
        `${vv?.height ?? window.innerHeight}px`
      );
    };

    apply();

    vv?.addEventListener("resize", apply);
    window.addEventListener("resize", apply);

    return () => {
      vv?.removeEventListener("resize", apply);
      window.removeEventListener("resize", apply);
      el.style.removeProperty("--app-height");
    };
  }, [targetRef]);
}
