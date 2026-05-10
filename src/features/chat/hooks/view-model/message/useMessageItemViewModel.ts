"use client";

import { useMemo } from "react";

import type { MessageItemProps } from "../../../components/section/MessageItem/MessageItem.types";
import { deriveMessageItemLayout } from "../../../lib/message/derive-message-item-layout";

type UseMessageItemViewModelParams = {
  message: MessageItemProps["message"];
  prevMessage: MessageItemProps["prevMessage"];
  nextMessage: MessageItemProps["nextMessage"];
  currentUserId: MessageItemProps["currentUserId"];
  isDirectChat: MessageItemProps["isDirectChat"];
  readReceiptAvatars: MessageItemProps["readReceiptAvatars"];
  onSenderProfileClick?: MessageItemProps["onSenderProfileClick"];
};

export function useMessageItemViewModel({
  message,
  prevMessage,
  nextMessage,
  currentUserId,
  isDirectChat,
  readReceiptAvatars,
  onSenderProfileClick,
}: UseMessageItemViewModelParams) {
  return useMemo(
    () =>
      deriveMessageItemLayout({
        message,
        prevMessage,
        nextMessage,
        currentUserId,
        isDirectChat,
        readReceiptAvatars,
        onSenderProfileClick,
      }),
    [
      message,
      prevMessage,
      nextMessage,
      currentUserId,
      isDirectChat,
      readReceiptAvatars,
      onSenderProfileClick,
    ]
  );
}
