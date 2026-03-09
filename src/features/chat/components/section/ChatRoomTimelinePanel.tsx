"use client";

import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Spinner } from "@/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

import { MessageList as ChatMessageList } from "./MessageList";
import {
  useChatRoomFetchOlderPageTrigger,
  useChatRoomMessageList,
  useChatRoomUserMaps,
  useMaintainScrollOnRoomMessageListChange,
  useScrollPosition,
} from "../../hooks";
import { chatMutationOptions } from "../../queries";

type SendFormHandlers = {
  onSendMessage: (message: string) => Promise<void>;
  onSendImage: (files: FileList) => Promise<void>;
};

type ChatRoomTimelinePanelProps = {
  roomId: string;
  myInfo?: { username: string };
  readSign: () => void;
  isConnected: boolean;
  renderSendForm: (handlers: SendFormHandlers) => React.ReactNode;
};

export function ChatRoomTimelinePanel({
  roomId,
  myInfo,
  readSign,
  isConnected,
  renderSendForm,
}: ChatRoomTimelinePanelProps) {
  const queryClient = useQueryClient();

  const sendTextMessageMutation = useMutation(
    chatMutationOptions.sendTextMessage(queryClient),
  );
  const sendImageMessageMutation = useMutation(
    chatMutationOptions.sendImageMessage(queryClient),
  );

  const {
    wholeRef,
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToTop,
  } = useScrollPosition();

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
      {blockMainArea ? (
        <div className="flex justify-center items-center h-full bg-background">
          <Spinner size={36} />
        </div>
      ) : (
        <div
          ref={wholeRef}
          className="h-full flex flex-col-reverse gap-2 flex-grow overflow-y-auto"
        >
          <div
            ref={messageContainerRef}
            className="flex-grow bg-background py-[24px] px-[16px]"
          >
            {Boolean(hasNextPage) && (
              <>
                <ObserveTrigger
                  trigger={onTrigger}
                  unmountCondition={!hasNextPage}
                  triggerCondition={{ rootMargin: "100px" }}
                />
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4 flex-col items-center">
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
        </div>
      )}
      {renderSendForm({ onSendMessage, onSendImage })}
    </>
  );
}
