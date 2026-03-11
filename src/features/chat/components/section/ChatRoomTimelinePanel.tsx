"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

import { Spinner } from "@/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

import { MessageList as ChatMessageList } from "./MessageList";
import { ChatSendForm } from "./ChatSendForm";
import {
  useChatRoomFetchOlderPageTrigger,
  useChatRoomMessageList,
  useChatRoomUserMaps,
  useMaintainScrollOnRoomMessageListChange,
  useScrollPosition,
} from "../../hooks";
import { chatMutationOptions } from "../../queries";

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
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sendTextMessageMutation = useMutation(
    chatMutationOptions.sendTextMessage(queryClient),
  );
  const sendImageMessageMutation = useMutation(
    chatMutationOptions.sendImageMessage(queryClient),
  );

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
    onSendMessage,
    onSendImage,
    onDeleteMessage,
  } = useChatRoomMessageList({
    roomId,
    ...(myInfo !== undefined ? { myInfo } : {}),
    readSign,
    sendTextMessageMutation,
    sendImageMessageMutation,
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
              onResendText={onSendMessage}
              onResendImage={onSendImage}
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
