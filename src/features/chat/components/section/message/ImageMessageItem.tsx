"use client";

import React from "react";

import { MessageItemFrame } from "./MessageItemFrame";
import { isPendingMessage } from "../../../lib/message/message-item.guards";
import type { MessageItemLayoutContext } from "../../../lib/message/message-item-layout.types";
import type { Message, PendingMessage } from "../../../types";
import { ImageMessage } from "../../ui/message/ImageMessage";
import { MessagePendingSide } from "../../ui/message/MessagePendingSide";

type ImageMessageType = Extract<Message, { chatType: "IMAGE" }>;
type PendingImageMessage = PendingMessage & { chatType: "IMAGE" };

interface ImageMessageItemProps {
  message: ImageMessageType | PendingImageMessage;
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

export function ImageMessageItem({
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
}: ImageMessageItemProps) {
  if (isPendingMessage(message)) {
    return (
      <MessageItemFrame
        displayDate={displayDate}
        dateKey={dateKey}
        isSameDate={layout.isSameDate}
        onDateClick={onDateClick}
        dateRef={dateRef}
      >
        <ImageMessage
          imageList={message.imageUrlList || []}
          sideContent={
            <MessagePendingSide
              variant="image"
              message={message}
              onRetryFailedText={onRetryFailedText}
              onRetryFailedImage={onRetryFailedImage}
              onDeletePending={onDeletePending}
            />
          }
          isUser={true}
          userImageUrl={null}
          senderUsername=""
          // IMAGE pending item intentionally never reveals profile row.
          isProfileRevealed={false}
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
      <ImageMessage
        imageList={message.imageUrlList || []}
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
