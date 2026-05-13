"use client";

import React, { useMemo } from "react";

import { ImageMessageItem } from "./ImageMessageItem";
import { LogMessageItem } from "./LogMessageItem";
import { areMessageItemPropsEqual } from "./message-item.memo";
import { TextMessageItem } from "./TextMessageItem";
import { deriveMessageItemLayout } from "../../../lib/message/derive-message-item-layout";
import type { MessageItemProps } from "../../../types/message-item.types";
import { MessageSideContent } from "../../ui/message/MessageSideContent";
import { MessageGroupReadReceiptSlot } from "../../ui/read-receipt/MessageGroupReadReceiptSlot";

function MessageItemComponent(props: MessageItemProps) {
  const { message } = props;

  const layout = useMemo(
    () =>
      deriveMessageItemLayout({
        message: props.message,
        prevMessage: props.prevMessage,
        nextMessage: props.nextMessage,
        currentUserId: props.currentUserId,
        isDirectChat: props.isDirectChat,
        readReceiptAvatars: props.readReceiptAvatars,
        onSenderProfileClick: props.onSenderProfileClick,
      }),
    [
      props.message,
      props.prevMessage,
      props.nextMessage,
      props.currentUserId,
      props.isDirectChat,
      props.readReceiptAvatars,
      props.onSenderProfileClick,
    ]
  );

  const sideContent = (
    <MessageSideContent
      layout={layout}
      showDirectReadLabel={props.showDirectReadLabel}
      messageCreatedAt={message.createdAt}
    />
  );

  const groupReadReceiptAvatarSlot = (
    <MessageGroupReadReceiptSlot
      isGroupChat={props.isGroupChat}
      layout={layout}
      readReceiptAvatars={props.readReceiptAvatars}
      onReadReceiptSlotClick={props.onReadReceiptSlotClick}
    />
  );

  const sharedVariantProps = {
    layout,
    displayDate: layout.displayDate,
    dateKey: layout.dateKey,
    onDateClick: props.onDateClick,
    dateRef: props.dateRef,
    sideContent,
    groupReadReceiptAvatarSlot,
    userImageUrl: props.userImageUrl,
    senderDisplayName: props.senderDisplayName,
    onRetryFailedText: props.onRetryFailedText,
    onRetryFailedImage: props.onRetryFailedImage,
    onDeletePending: props.onDeletePending,
  };

  if (message.chatType === "TEXT") {
    return <TextMessageItem message={message} {...sharedVariantProps} />;
  }

  if (message.chatType === "IMAGE") {
    return <ImageMessageItem message={message} {...sharedVariantProps} />;
  }

  if (message.chatType === "JOIN" || message.chatType === "LEAVE") {
    return (
      <LogMessageItem
        message={message}
        senderDisplayName={props.senderDisplayName}
        displayDate={layout.displayDate}
        dateKey={layout.dateKey}
        isSameDate={layout.isSameDate}
        onDateClick={props.onDateClick}
        dateRef={props.dateRef}
      />
    );
  }

  return null;
}

export const MessageItem = React.memo(
  MessageItemComponent,
  areMessageItemPropsEqual
);
