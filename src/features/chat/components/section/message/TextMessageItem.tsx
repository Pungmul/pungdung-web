"use client";

import React from "react";

import { MessageItemFrame } from "./MessageItemFrame";
import { isPendingMessage } from "../../../lib/message/message-item.guards";
import type { MessageItemLayoutContext } from "../../../lib/message/message-item-layout.types";
import type { Message, PendingMessage } from "../../../types";
import { ChatMessage } from "../../ui/message/ChatMessage";
import { MessagePendingSide } from "../../ui/message/MessagePendingSide";

type TextMessage = Extract<Message, { chatType: "TEXT" }>;
type PendingTextMessage = PendingMessage & { chatType: "TEXT" };

interface TextMessageItemProps {
  message: TextMessage | PendingTextMessage;
  layout: MessageItemLayoutContext;
  displayDate: string;
  dateKey: string;
  onDateClick: (dateKey: string) => void;
  dateRef: ((el: HTMLLIElement | null) => void) | undefined;
  sideContent: React.ReactNode;
  groupReadReceiptAvatarSlot: React.ReactNode;
  userImageUrl: string | null;
  senderDisplayName: string;
  onRetryFailedText: (failed: PendingMessage) => void;
  onRetryFailedImage: (failed: PendingMessage) => void;
  onDeletePending: (message: PendingMessage) => void;
}

export function TextMessageItem({
  message,
  layout,
  displayDate,
  dateKey,
  onDateClick,
  dateRef,
  sideContent,
  groupReadReceiptAvatarSlot,
  userImageUrl,
  senderDisplayName,
  onRetryFailedText,
  onRetryFailedImage,
  onDeletePending,
}: TextMessageItemProps) {
  if (isPendingMessage(message)) {
    return (
      <MessageItemFrame
        displayDate={displayDate}
        dateKey={dateKey}
        isSameDate={layout.isSameDate}
        onDateClick={onDateClick}
        dateRef={dateRef}
        className="flex flex-col gap-2"
      >
        <ChatMessage
          message={message.content}
          sideContent={
            <MessagePendingSide
              variant="text"
              message={message}
              onRetryFailedText={onRetryFailedText}
              onRetryFailedImage={onRetryFailedImage}
              onDeletePending={onDeletePending}
            />
          }
          isUser={true}
          userImageUrl={null}
          senderUsername=""
          isProfileRevealed={!layout.isSameTimeBefore}
        />
      </MessageItemFrame>
    );
  }

  return (
    <MessageItemFrame
      displayDate={displayDate}
      dateKey={dateKey}
      isSameDate={layout.isSameDate}
      onDateClick={onDateClick}
      dateRef={dateRef}
      className="relative flex flex-col gap-1"
    >
      <ChatMessage
        message={message.content as string}
        sideContent={sideContent}
        isUser={layout.isUser}
        userImageUrl={userImageUrl}
        senderUsername={senderDisplayName}
        isProfileRevealed={!layout.isSameTimeBefore}
        {...(layout.senderProfileClickHandler
          ? { onProfileClick: layout.senderProfileClickHandler }
          : {})}
      />
      {groupReadReceiptAvatarSlot}
    </MessageItemFrame>
  );
}
