"use client";

import { useRef } from "react";

import { Spinner } from "@/shared/components";
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

type ChatRoomTimelinePanelProps = {
  roomId: string;
  myInfo?: { username: string };
  readSign: () => void;
  isConnected: boolean;
};

export function ChatRoomTimelinePanel({
  roomId,
  myInfo,
  readSign,
  isConnected,
}: ChatRoomTimelinePanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const blockMainArea = isInfiniteLoading || !isConnected;

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="
          flex min-h-0 flex-col-reverse overflow-y-auto overscroll-contain
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
      <ChatSendForm
        onSendMessage={onSendMessage}
        onSendImage={onSendImage}
      />
    </>
  );
}
