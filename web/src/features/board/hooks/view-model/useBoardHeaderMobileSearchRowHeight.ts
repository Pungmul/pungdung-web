"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** 모바일 검색 줄이 붙은 행 높이(헤더 그라데이션 오프셋). 패널이 닫혀 있으면 0. */
export function useBoardHeaderMobileSearchRowHeight(isPanelOpen: boolean) {
  const mobileSearchRowRef = useRef<HTMLDivElement>(null);
  const [mobileSearchHeightPx, setMobileSearchHeightPx] = useState(0);

  useLayoutEffect(() => {
    if (!isPanelOpen) {
      setMobileSearchHeightPx(0);
      return;
    }

    const el = mobileSearchRowRef.current;
    if (!el) {
      return;
    }

    const measure = () => {
      setMobileSearchHeightPx(el.offsetHeight);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isPanelOpen]);

  return { mobileSearchRowRef, mobileSearchHeightPx };
}
