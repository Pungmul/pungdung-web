"use client";

import React from "react";

import { ImageMessageItem } from "./ImageMessageItem";
import { LogMessageItem } from "./LogMessageItem";
import type { MessageItemProps } from "./MessageItem.types";
import { MessageItemGroupReadReceiptSlot } from "./MessageItemGroupReadReceiptSlot";
import { MessageItemSideContent } from "./MessageItemSideContent";
import { TextMessageItem } from "./TextMessageItem";
import { deriveMessageItemLayout } from "../../../lib/derive-message-item-layout";

export function MessageItemComponent(props: MessageItemProps) {
  const { message } = props;

  const layout = deriveMessageItemLayout({
    message: props.message,
    prevMessage: props.prevMessage,
    nextMessage: props.nextMessage,
    currentUserId: props.currentUserId,
    isDirectChat: props.isDirectChat,
    readReceiptAvatars: props.readReceiptAvatars,
    onSenderProfileClick: props.onSenderProfileClick,
  });

  const sideContent = (
    <MessageItemSideContent
      layout={layout}
      showDirectReadLabel={props.showDirectReadLabel}
      messageCreatedAt={message.createdAt}
    />
  );

  const groupReadReceiptAvatarSlot = (
    <MessageItemGroupReadReceiptSlot
      isGroupChat={props.isGroupChat}
      layout={layout}
      readReceiptAvatars={props.readReceiptAvatars}
      onReadReceiptSlotClick={props.onReadReceiptSlotClick}
    />
  );

  if (message.chatType === "TEXT") {
    return (
      <TextMessageItem
        message={message}
        layout={layout}
        displayDate={layout.displayDate}
        dateKey={layout.dateKey}
        onDateClick={props.onDateClick}
        dateRef={props.dateRef}
        sideContent={sideContent}
        groupReadReceiptAvatarSlot={groupReadReceiptAvatarSlot}
        userImageUrl={props.userImageUrl}
        senderDisplayName={props.senderDisplayName}
        onRetryFailedText={props.onRetryFailedText}
        onRetryFailedImage={props.onRetryFailedImage}
        onDeletePending={props.onDeletePending}
      />
    );
  }

  if (message.chatType === "IMAGE") {
    return (
      <ImageMessageItem
        message={message}
        layout={layout}
        displayDate={layout.displayDate}
        dateKey={layout.dateKey}
        onDateClick={props.onDateClick}
        dateRef={props.dateRef}
        sideContent={sideContent}
        groupReadReceiptAvatarSlot={groupReadReceiptAvatarSlot}
        userImageUrl={props.userImageUrl}
        senderDisplayName={props.senderDisplayName}
        onRetryFailedText={props.onRetryFailedText}
        onRetryFailedImage={props.onRetryFailedImage}
        onDeletePending={props.onDeletePending}
      />
    );
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
