"use client";

import { useEffect, useRef } from "react";

import type { RefObject } from "react";

import {
  ENTRY_SCROLL_OFFSET_ABOVE_LATEST_MESSAGE_COUNT,
  ENTRY_SCROLL_SETTLE_TIMEOUT_MS,
} from "../../constants/ui.constants";
import { isMessageListDomReadyForEntryScroll } from "../../lib/is-message-list-dom-ready-for-entry-scroll";

type UseEntryUnreadScrollOnMountParams = {
  roomId: string;
  messageContainerRef: RefObject<HTMLDivElement | null>;
  hadUnreadOnEntry: boolean;
  hasNewMessagesDivider: boolean;
  isEntrySnapshotCaptured: boolean;
  canAttemptEntryUnreadScroll: boolean;
  scrollAboveLatestByMessageCount: (messageCount: number) => boolean;
  scrollToNewMessagesDivider: () => boolean;
  onEntryScrollSettled: () => void;
};

/**
 * 미읽음 진입 1회 스크롤.
 * MessageList DOM이 실제로 그려진 뒤(layout 안정)에만 offset/divider 스크롤을 시도한다.
 */
export function useEntryUnreadScrollOnMount({
  roomId,
  messageContainerRef,
  hadUnreadOnEntry,
  hasNewMessagesDivider,
  isEntrySnapshotCaptured,
  canAttemptEntryUnreadScroll,
  scrollAboveLatestByMessageCount,
  scrollToNewMessagesDivider,
  onEntryScrollSettled,
}: UseEntryUnreadScrollOnMountParams) {
  const handledRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    handledRoomIdRef.current = null;
  }, [roomId]);

  useEffect(() => {
    if (!hadUnreadOnEntry) {
      if (isEntrySnapshotCaptured) {
        onEntryScrollSettled();
      }
      return;
    }

    if (!isEntrySnapshotCaptured || !canAttemptEntryUnreadScroll) {
      return;
    }

    if (handledRoomIdRef.current === roomId) {
      onEntryScrollSettled();
      return;
    }

    const messageContainer = messageContainerRef.current;
    if (!messageContainer) {
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let settleTimeoutId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const settleEntryScroll = (reason: "scrolled" | "timeout") => {
      if (cancelled || handledRoomIdRef.current === roomId) {
        return;
      }

      if (reason === "timeout" && process.env.NODE_ENV !== "production") {
        console.warn(
          "[chat] entry unread scroll settled by timeout without successful scroll"
        );
      }

      handledRoomIdRef.current = roomId;
      onEntryScrollSettled();
      resizeObserver?.disconnect();
      resizeObserver = null;
    };

    const tryScroll = () => {
      if (cancelled || handledRoomIdRef.current === roomId) {
        return;
      }

      const container = messageContainerRef.current;
      if (!container) {
        return;
      }

      if (
        !isMessageListDomReadyForEntryScroll(container, {
          hasNewMessagesDivider,
        })
      ) {
        return;
      }

      const didScroll = hasNewMessagesDivider
        ? scrollToNewMessagesDivider()
        : scrollAboveLatestByMessageCount(
            ENTRY_SCROLL_OFFSET_ABOVE_LATEST_MESSAGE_COUNT
          );

      if (didScroll) {
        settleEntryScroll("scrolled");
      }
    };

    const scheduleTryScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(tryScroll);
      });
    };

    resizeObserver = new ResizeObserver(scheduleTryScroll);
    resizeObserver.observe(messageContainer);
    scheduleTryScroll();

    // offset 측정 실패 시에도 maintain scroll을 풀기 위한 fallback — 최하단 유지 가능
    settleTimeoutId = window.setTimeout(() => {
      settleEntryScroll("timeout");
    }, ENTRY_SCROLL_SETTLE_TIMEOUT_MS);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimeoutId);
      resizeObserver?.disconnect();
    };
  }, [
    roomId,
    messageContainerRef,
    hadUnreadOnEntry,
    hasNewMessagesDivider,
    isEntrySnapshotCaptured,
    canAttemptEntryUnreadScroll,
    scrollAboveLatestByMessageCount,
    scrollToNewMessagesDivider,
    onEntryScrollSettled,
  ]);
}
