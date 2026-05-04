"use client";

import { useCallback, useRef } from "react";

import type { RefObject } from "react";

import { CHAT_MESSAGE_ITEM_SELECTOR } from "../../constants/ui.constants";
import { measureScrollTopToShowElement } from "../../lib/measure-scroll-top-to-show-element";
import { measureScrollTopToShowNewMessagesDivider } from "../../lib/measure-scroll-top-to-show-new-messages-divider";

type UseScrollPositionOptions = {
  /** 스크롤 컨테이너(ref.current에 scrollTop이 있는 요소). 없으면 훅 내부 ref를 사용합니다. */
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
};

/**
 * - `immediate`: 사용자 탭 등 즉시 최신으로 이동
 * - `afterLayout`: 전송 직후 DOM·레이아웃 반영 뒤 최신으로 이동 (double rAF)
 */
export type ScrollToLatestMode = "immediate" | "afterLayout";

export const useScrollPosition = (opts?: UseScrollPositionOptions) => {
  /** 이전 메시지 컨테이너 scrollHeight — prepend 시 delta 보정용 (scrollTop 아님) */
  const prevMessageContainerHeightRef = useRef<number>(0);
  const internalScrollContainerRef = useRef<HTMLDivElement>(null);
  const wholeRef = opts?.scrollContainerRef ?? internalScrollContainerRef;
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const saveScrollPosition = useCallback(() => {
    if (messageContainerRef.current) {
      prevMessageContainerHeightRef.current =
        messageContainerRef.current.scrollHeight;
    }
  }, []);

  const maintainScrollPosition = useCallback(() => {
    const scrollEl = wholeRef.current;
    if (
      prevMessageContainerHeightRef.current > 0 &&
      scrollEl &&
      messageContainerRef.current
    ) {
      const newHeight = messageContainerRef.current.scrollHeight;
      const prevHeight = prevMessageContainerHeightRef.current;
      const delta = newHeight - prevHeight;

      scrollEl.scrollTo({
        top: scrollEl.scrollTop + delta,
      });

      prevMessageContainerHeightRef.current = newHeight;
    }
  }, [wholeRef]);

  const scrollToLatest = useCallback(
    (mode: ScrollToLatestMode = "afterLayout") => {
      const el = wholeRef.current;
      if (!el) return;

      const scroll = () => {
        el.scrollTo({ top: 0, behavior: "auto" });
      };

      if (mode === "immediate") {
        scroll();
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(scroll);
      });
    },
    [wholeRef]
  );

  const scrollAboveLatestByMessageCount = useCallback(
    (messageCount: number): boolean => {
      const scrollEl = wholeRef.current;
      const messageContainer = messageContainerRef.current;
      if (!scrollEl || !messageContainer || messageCount <= 0) {
        return false;
      }

      const items = messageContainer.querySelectorAll<HTMLElement>(
        CHAT_MESSAGE_ITEM_SELECTOR
      );
      if (items.length === 0) {
        return false;
      }

      const count = Math.min(messageCount, items.length);
      const targetItem = items[items.length - count];
      if (!targetItem) {
        return false;
      }

      const scrollTop = measureScrollTopToShowElement(scrollEl, targetItem, {
        align: "start",
      });

      scrollEl.scrollTo({ top: scrollTop, behavior: "auto" });
      return true;
    },
    [wholeRef]
  );

  const scrollToNewMessagesDivider = useCallback((): boolean => {
    const scrollEl = wholeRef.current;
    const messageContainer = messageContainerRef.current;
    if (!scrollEl || !messageContainer) {
      return false;
    }

    const scrollTop = measureScrollTopToShowNewMessagesDivider(
      scrollEl,
      messageContainer
    );
    if (scrollTop === null) {
      return false;
    }

    scrollEl.scrollTo({ top: scrollTop, behavior: "auto" });
    return true;
  }, [wholeRef]);

  return {
    wholeRef,
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToLatest,
    scrollAboveLatestByMessageCount,
    scrollToNewMessagesDivider,
  };
};
