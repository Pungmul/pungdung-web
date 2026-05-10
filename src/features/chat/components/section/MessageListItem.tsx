"use client";

import React, { useCallback, useMemo } from "react";

import type { User } from "@/features/user";

import { MessageItem } from "./MessageItem";
import { getMessageDateKey, isSameMessageDate } from "../../lib/message/message-date";
import type { ReadReceiptDisplayContext } from "../../services";
import {
  getReadReceiptAvatarsForMessage,
  shouldShowDirectReadLabel,
} from "../../services";
import type { Message, PendingMessage } from "../../types";
import type { ReadReceiptAvatar } from "../../types/read-receipt.types";

type UserImageMap = Record<string, string | null>;
type UserNameMap = Record<string, string | null>;
const EMPTY_READ_RECEIPT_AVATARS: readonly ReadReceiptAvatar[] = Object.freeze([]);

type MessageListItemProps = {
  message: Message | PendingMessage;
  prevMessage: (Message | PendingMessage) | undefined;
  nextMessage: (Message | PendingMessage) | undefined;
  currentUsername: string;
  isGroupChat: boolean;
  readReceiptDisplayContext: ReadReceiptDisplayContext;
  isLatestMessageFromOpponent: boolean;
  userByUsername: ReadonlyMap<string, User>;
  userImageMap: UserImageMap;
  userNameMap: UserNameMap;
  onReadReceiptSlotClick: (messageId: number) => void;
  onSenderProfileClick: (user: User) => void;
  onDateClick: (dateKey: string) => void;
  onDateRef: (dateKey: string, el: HTMLLIElement | null) => void;
  onRetryFailedText: (failed: PendingMessage) => void;
  onRetryFailedImage: (failed: PendingMessage) => void;
  onDeletePending: (message: PendingMessage) => void;
};

function MessageListItemComponent({
  message,
  prevMessage,
  nextMessage,
  currentUsername,
  isGroupChat,
  readReceiptDisplayContext,
  isLatestMessageFromOpponent,
  userByUsername,
  userImageMap,
  userNameMap,
  onReadReceiptSlotClick,
  onSenderProfileClick,
  onDateClick,
  onDateRef,
  onRetryFailedText,
  onRetryFailedImage,
  onDeletePending,
}: MessageListItemProps) {
  const isMyMessage = message.senderUsername === currentUsername;
  const numericMessageId = typeof message.id === "number" ? message.id : null;
  const isDirectChat = !isGroupChat;
  const showDirectReadLabel =
    numericMessageId !== null &&
    shouldShowDirectReadLabel({
      context: readReceiptDisplayContext,
      messageId: numericMessageId,
      isMyMessage,
      isLatestMessageFromOpponent,
    });
  const readReceiptAvatars =
    isGroupChat && numericMessageId !== null
      ? getReadReceiptAvatarsForMessage(
          readReceiptDisplayContext,
          numericMessageId,
          message.senderUsername
        )
      : EMPTY_READ_RECEIPT_AVATARS;
  const senderUser = userByUsername.get(message.senderUsername);
  const dateKey = getMessageDateKey(message);
  const isSameDate = isSameMessageDate(message, prevMessage);
  const handleReadReceiptSlotClick = useCallback(() => {
    if (numericMessageId === null) {
      return;
    }
    onReadReceiptSlotClick(numericMessageId);
  }, [numericMessageId, onReadReceiptSlotClick]);
  const handleSenderProfileClick = useCallback(() => {
    if (!senderUser) {
      return;
    }
    onSenderProfileClick(senderUser);
  }, [onSenderProfileClick, senderUser]);
  const dateRef = useMemo(() => {
    if (isSameDate) {
      return undefined;
    }

    return (el: HTMLLIElement | null) => {
      onDateRef(dateKey, el);
    };
  }, [dateKey, isSameDate, onDateRef]);

  return (
    <MessageItem
      message={message}
      prevMessage={prevMessage}
      nextMessage={nextMessage}
      currentUserId={currentUsername}
      isGroupChat={isGroupChat}
      isDirectChat={isDirectChat}
      showDirectReadLabel={showDirectReadLabel}
      readReceiptAvatars={readReceiptAvatars}
      {...(readReceiptAvatars.length > 0
        ? {
            onReadReceiptSlotClick: handleReadReceiptSlotClick,
          }
        : {})}
      {...(senderUser && !isMyMessage
        ? {
            onSenderProfileClick: handleSenderProfileClick,
          }
        : {})}
      userImageUrl={userImageMap[message.senderUsername] ?? null}
      senderDisplayName={userNameMap[message.senderUsername] ?? ""}
      onDateClick={onDateClick}
      onRetryFailedText={onRetryFailedText}
      onRetryFailedImage={onRetryFailedImage}
      onDeletePending={onDeletePending}
      dateRef={dateRef}
    />
  );
}

function readReceiptAvatarUserIdsKey(
  avatars: readonly ReadReceiptAvatar[]
): string {
  return avatars.map((avatar) => avatar.userId).join(",");
}

function areMessageListItemPropsEqual(
  prev: MessageListItemProps,
  next: MessageListItemProps
): boolean {
  const prevNumericMessageId =
    typeof prev.message.id === "number" ? prev.message.id : null;
  const nextNumericMessageId =
    typeof next.message.id === "number" ? next.message.id : null;
  const prevIsMyMessage = prev.message.senderUsername === prev.currentUsername;
  const nextIsMyMessage = next.message.senderUsername === next.currentUsername;
  const prevShowDirectReadLabel =
    prevNumericMessageId !== null &&
    shouldShowDirectReadLabel({
      context: prev.readReceiptDisplayContext,
      messageId: prevNumericMessageId,
      isMyMessage: prevIsMyMessage,
      isLatestMessageFromOpponent: prev.isLatestMessageFromOpponent,
    });
  const nextShowDirectReadLabel =
    nextNumericMessageId !== null &&
    shouldShowDirectReadLabel({
      context: next.readReceiptDisplayContext,
      messageId: nextNumericMessageId,
      isMyMessage: nextIsMyMessage,
      isLatestMessageFromOpponent: next.isLatestMessageFromOpponent,
    });
  const prevReadReceiptAvatars =
    prev.isGroupChat && prevNumericMessageId !== null
      ? getReadReceiptAvatarsForMessage(
          prev.readReceiptDisplayContext,
          prevNumericMessageId,
          prev.message.senderUsername
        )
      : EMPTY_READ_RECEIPT_AVATARS;
  const nextReadReceiptAvatars =
    next.isGroupChat && nextNumericMessageId !== null
      ? getReadReceiptAvatarsForMessage(
          next.readReceiptDisplayContext,
          nextNumericMessageId,
          next.message.senderUsername
        )
      : EMPTY_READ_RECEIPT_AVATARS;
  const prevReadReceiptKey = readReceiptAvatarUserIdsKey(prevReadReceiptAvatars);
  const nextReadReceiptKey = readReceiptAvatarUserIdsKey(nextReadReceiptAvatars);

  return (
    prev.message.id === next.message.id &&
    prev.message.senderUsername === next.message.senderUsername &&
    prev.message.chatType === next.message.chatType &&
    prev.message.createdAt === next.message.createdAt &&
    prev.message.content === next.message.content &&
    prev.prevMessage?.id === next.prevMessage?.id &&
    prev.nextMessage?.id === next.nextMessage?.id &&
    prev.currentUsername === next.currentUsername &&
    prev.isGroupChat === next.isGroupChat &&
    prev.isLatestMessageFromOpponent === next.isLatestMessageFromOpponent &&
    prevShowDirectReadLabel === nextShowDirectReadLabel &&
    prevReadReceiptKey === nextReadReceiptKey &&
    prev.userByUsername === next.userByUsername &&
    prev.userImageMap === next.userImageMap &&
    prev.userNameMap === next.userNameMap &&
    prev.onReadReceiptSlotClick === next.onReadReceiptSlotClick &&
    prev.onSenderProfileClick === next.onSenderProfileClick &&
    prev.onDateClick === next.onDateClick &&
    prev.onDateRef === next.onDateRef &&
    prev.onRetryFailedText === next.onRetryFailedText &&
    prev.onRetryFailedImage === next.onRetryFailedImage &&
    prev.onDeletePending === next.onDeletePending
  );
}

export const MessageListItem = React.memo(
  MessageListItemComponent,
  areMessageListItemPropsEqual
);
