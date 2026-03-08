export const isReadByLastReadMessageId = (messageId: number | null, lastReadMessageId: number | null) => {
  if (messageId === null || lastReadMessageId === null) return false;
  return messageId <= lastReadMessageId;
};