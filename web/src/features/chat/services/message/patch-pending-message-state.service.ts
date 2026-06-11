import type { PendingMessage } from "../../types";

export const markMessageAsFailed = (
  message: PendingMessage
): PendingMessage => {
  return {
    ...message,
    state: "failed",
  };
};

export const updateMessageToFailed = (
  messages: PendingMessage[],
  messageId: string | number
): PendingMessage[] => {
  return messages.map((msg) =>
    msg.id === messageId ? markMessageAsFailed(msg) : msg
  );
};

export const removePendingMessage = (
  messages: PendingMessage[],
  messageId: string | number
): PendingMessage[] => {
  return messages.filter((msg) => msg.id !== messageId);
};
