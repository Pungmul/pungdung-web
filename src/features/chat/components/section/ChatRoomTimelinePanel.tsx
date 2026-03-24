"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { FloatingButton, Spinner } from "@/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

import { ChatSendForm } from "./ChatSendForm";
import { MessageList as ChatMessageList } from "./MessageList";
import { useSendMessageAction } from "../../hooks/actions";
import {
  useChatRoomFetchOlderPageTrigger,
  useMaintainScrollOnRoomMessageListChange,
  useScrollPosition,
} from "../../hooks/state";
import {
  useChatRoomMessageList,
  useChatRoomUserMaps,
} from "../../hooks/view-model";
import { cn } from "@/shared";

type ChatRoomTimelinePanelProps = {
  roomId: string;
  myInfo?: { username: string };
  readSign: () => void;
  isConnected: boolean;
};

const SHOW_SCROLL_TO_LATEST_BUTTON_THRESHOLD = 160;

export function ChatRoomTimelinePanel({
  roomId,
  myInfo,
  readSign,
  isConnected,
}: ChatRoomTimelinePanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToLatestButton, setShowScrollToLatestButton] =
    useState(false);

  const {
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToTop,
  } = useScrollPosition({ scrollContainerRef });

  const {
    messageList,
    chatRoomData,
    isInfiniteLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    outgoingMessageHandlers,
    onDeleteMessage,
  } = useChatRoomMessageList({
    roomId,
    ...(myInfo !== undefined ? { myInfo } : {}),
    readSign,
  });

  const {
    onSendMessage,
    onSendImage,
    onRetryTextFailed,
    onRetryImageFailed,
  } = useSendMessageAction({
    roomId,
    readSign,
    outgoingMessageHandlers,
    onMessageSent: scrollToTop,
  });

  const { userLastReadMessageIdMap, userImageMap, userNameMap } =
    useChatRoomUserMaps({ chatRoomData });

  const { onTrigger } = useChatRoomFetchOlderPageTrigger({
    fetchNextPage,
    isFetchingNextPage,
    saveScrollPosition,
  });

  useMaintainScrollOnRoomMessageListChange(messageList, maintainScrollPosition);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    const syncScrollButtonVisibility = () => {
      setShowScrollToLatestButton(
        Math.abs(scrollElement.scrollTop) >
        SHOW_SCROLL_TO_LATEST_BUTTON_THRESHOLD
      );
    };

    syncScrollButtonVisibility();
    scrollElement.addEventListener("scroll", syncScrollButtonVisibility, {
      passive: true,
    });

    return () => {
      scrollElement.removeEventListener(
        "scroll",
        syncScrollButtonVisibility
      );
    };
  }, []);

  const handleScrollToLatestMessage = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const blockMainArea = isInfiniteLoading || !isConnected;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="
          flex min-h-0 flex-1 flex-col-reverse overflow-y-auto overscroll-contain
          [-webkit-overflow-scrolling:touch]
          [overflow-anchor:none]
        "
      >
        {blockMainArea ? (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-background">
            <Spinner size={36} />
          </div>
        ) : (
          <div
            ref={messageContainerRef}
            className="w-full flex flex-col shrink-0 grow-1 bg-background px-[16px] py-[24px]"
          >
            {Boolean(hasNextPage) && (
              <>
                <ObserveTrigger
                  trigger={onTrigger}
                  unmountCondition={!hasNextPage}
                  triggerCondition={{ rootMargin: "100px" }}
                />
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Spinner size={36} />
                  </div>
                )}
              </>
            )}
            <ChatMessageList
              messages={messageList}
              currentUserId={myInfo?.username ?? ""}
              userLastReadMessageIdMap={userLastReadMessageIdMap}
              userImageMap={userImageMap}
              userNameMap={userNameMap}
              onRetryFailedText={onRetryTextFailed}
              onRetryFailedImage={onRetryImageFailed}
              onDeletePending={onDeleteMessage}
            />
          </div>
        )}
      </div>
      <div
        className={cn(
          "pointer-events-none absolute bottom-[4.75rem] right-4 z-30",
          "transition-transform duration-300 will-change-transform",
          "max-md:bottom-[calc(env(safe-area-inset-bottom)+4.25rem)]",
          showScrollToLatestButton ? "translate-y-0" : "translate-y-[140%]"
        )}
      >
        <FloatingButton
          ariaLabel="최신 메시지로 이동"
          onClick={handleScrollToLatestMessage}
          innerElement={<ChevronDownIcon strokeWidth={2} className="size-full text-grey-500" />}
        />
      </div>
      <ChatSendForm
        onSendMessage={onSendMessage}
        onSendImage={onSendImage}
      />
    </div>
  );
}
