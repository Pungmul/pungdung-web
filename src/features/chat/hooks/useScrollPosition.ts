"use client";

import type { RefObject } from "react";
import { useCallback, useRef } from "react";

type UseScrollPositionOptions = {
  /** 스크롤 컨테이너(ref.current에 scrollTop이 있는 요소). 없으면 훅 내부 ref를 사용합니다. */
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
};

export const useScrollPosition = (opts?: UseScrollPositionOptions) => {
  const scrollRef = useRef<number>(0);
  const internalScrollContainerRef = useRef<HTMLDivElement>(null);
  const wholeRef = opts?.scrollContainerRef ?? internalScrollContainerRef;
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const saveScrollPosition = useCallback(() => {
    if (messageContainerRef.current) {
      scrollRef.current = messageContainerRef.current.scrollHeight;
    }
  }, []);

  const maintainScrollPosition = useCallback(() => {
    const scrollEl = wholeRef.current;
    if (scrollRef.current > 0 && scrollEl && messageContainerRef.current) {
      const newHeight = messageContainerRef.current.scrollHeight;
      const prevHeight = scrollRef.current;
      const delta = newHeight - prevHeight;

      scrollEl.scrollTo({
        top: scrollEl.scrollTop + delta,
      });

      scrollRef.current = newHeight;
    }
  }, [wholeRef]);

  const scrollToTop = useCallback(() => {
    const el = wholeRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: 0 });
      });
    });
  }, [wholeRef]);

  return {
    scrollRef,
    wholeRef,
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToTop,
  };
};
