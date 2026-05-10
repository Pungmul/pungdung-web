"use client";

import { MessageItemFrame } from "./MessageItemFrame";
import { formatJoinLogMessage } from "../../../lib/message/format-join-log-message";
import type { Message } from "../../../types";
import { ChatLogMessage } from "../../ui/ChatLogMessage";

type LogMessageType = Extract<Message, { chatType: "JOIN" | "LEAVE" }>;

interface LogMessageItemProps {
  message: LogMessageType;
  senderDisplayName: string;
  displayDate: string;
  dateKey: string;
  isSameDate: boolean;
  onDateClick: (dateKey: string) => void;
  dateRef: ((el: HTMLLIElement | null) => void) | undefined;
}

export function LogMessageItem({
  message,
  senderDisplayName,
  displayDate,
  dateKey,
  isSameDate,
  onDateClick,
  dateRef,
}: LogMessageItemProps) {
  const content =
    message.chatType === "JOIN"
      ? formatJoinLogMessage(message.content, senderDisplayName)
      : (message.content ?? "");

  return (
    <MessageItemFrame
      displayDate={displayDate}
      dateKey={dateKey}
      isSameDate={isSameDate}
      onDateClick={onDateClick}
      dateRef={dateRef}
    >
      <ChatLogMessage>{content}</ChatLogMessage>
    </MessageItemFrame>
  );
}
