"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { throttle } from "lodash";

import { useEntryUnreadScrollOnMount } from "./useEntryUnreadScrollOnMount";
import { useMaintainScrollOnRoomMessageListChange } from "./useMaintainScrollOnRoomMessageListChange";
import { useScrollPosition } from "./useScrollPosition";
import {
  ENTRY_SCROLL_SETTLE_TIMEOUT_MS,
  SCROLL_THROTTLE_MS,
  SCROLL_TO_LATEST_BUTTON_GAP_PX,
  SHOW_SCROLL_TO_LATEST_BUTTON_THRESHOLD_PX,
} from "../../../constants/ui.constants";
import type { Message, PendingMessage } from "../../../types";

type UseChatRoomTimelineScrollParams = {
  roomId: string;
  messageList: readonly (Message | PendingMessage)[];
  /** entry read-sign에서 생산 — 미읽음 진입 1회 스크롤 offset에 사용 */
  hadUnreadOnEntry: boolean;
  hasNewMessagesDivider: boolean;
  isEntrySnapshotCaptured: boolean;
  /** MessageList가 마운트되고 초기 로딩이 끝났는지 */
  canAttemptEntryUnreadScroll: boolean;
};

/**
 * 채팅 타임라인 scroll shell: DOM ref, 위치 유지, 진입 offset, 플로팅 버튼 UX.
 * 메시지 소스·read-sign·send action은 호출 측(ChatRoomTimelinePanel) 책임.
 */
export function useChatRoomTimelineScroll({
  roomId,
  messageList,
  hadUnreadOnEntry,
  hasNewMessagesDivider,
  isEntrySnapshotCaptured,
  canAttemptEntryUnreadScroll,
}: UseChatRoomTimelineScrollParams) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sendFormContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToLatestButton, setShowScrollToLatestButton] =
    useState(false);
  const [sendFormHeightPx, setSendFormHeightPx] = useState(0);
  const [isEntryScrollSettled, setIsEntryScrollSettled] = useState(false);

  const {
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToLatest,
    scrollAboveLatestByMessageCount,
    scrollToNewMessagesDivider,
  } = useScrollPosition({ scrollContainerRef });

  useEffect(() => {
    setIsEntryScrollSettled(false);
  }, [roomId]);

  const handleEntryScrollSettled = useCallback(() => {
    setIsEntryScrollSettled(true);
  }, []);

  useEntryUnreadScrollOnMount({
    roomId,
    messageContainerRef,
    hadUnreadOnEntry,
    hasNewMessagesDivider,
    isEntrySnapshotCaptured,
    canAttemptEntryUnreadScroll,
    scrollAboveLatestByMessageCount,
    scrollToNewMessagesDivider,
    onEntryScrollSettled: handleEntryScrollSettled,
  });

  useMaintainScrollOnRoomMessageListChange(
    messageList,
    maintainScrollPosition,
    { enabled: isEntryScrollSettled }
  );

  useEffect(() => {
    if (isEntryScrollSettled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsEntryScrollSettled(true);
    }, ENTRY_SCROLL_SETTLE_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [roomId, isEntryScrollSettled]);

  useLayoutEffect(() => {
    const sendFormContainer = sendFormContainerRef.current;
    if (!sendFormContainer) return;

    const measureSendFormHeight = () => {
      setSendFormHeightPx(sendFormContainer.offsetHeight);
    };

    measureSendFormHeight();

    const resizeObserver = new ResizeObserver(measureSendFormHeight);
    resizeObserver.observe(sendFormContainer);

    return () => resizeObserver.disconnect();
  }, []);

  const syncScrollButtonVisibility = useCallback(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    // flex-col-reverse: scrollTop 부호가 뒤집힐 수 있어 최신에서의 거리는 절댓값으로 본다.
    const distanceFromLatest = Math.abs(scrollElement.scrollTop);
    const shouldShow =
      distanceFromLatest > SHOW_SCROLL_TO_LATEST_BUTTON_THRESHOLD_PX;

    setShowScrollToLatestButton((prev) =>
      prev === shouldShow ? prev : shouldShow
    );
  }, []);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    syncScrollButtonVisibility();

    const throttledSyncScrollButtonVisibility = throttle(
      syncScrollButtonVisibility,
      SCROLL_THROTTLE_MS
    );

    scrollElement.addEventListener(
      "scroll",
      throttledSyncScrollButtonVisibility,
      { passive: true }
    );

    return () => {
      scrollElement.removeEventListener(
        "scroll",
        throttledSyncScrollButtonVisibility
      );
      throttledSyncScrollButtonVisibility.cancel();
    };
  }, [syncScrollButtonVisibility]);

  useEffect(() => {
    syncScrollButtonVisibility();
  }, [messageList.length, syncScrollButtonVisibility]);

  return {
    scrollContainerRef,
    sendFormContainerRef,
    messageContainerRef,
    saveScrollPosition,
    scrollToLatest,
    showScrollToLatestButton,
    sendFormBottomOffsetPx: sendFormHeightPx + SCROLL_TO_LATEST_BUTTON_GAP_PX,
  };
}
