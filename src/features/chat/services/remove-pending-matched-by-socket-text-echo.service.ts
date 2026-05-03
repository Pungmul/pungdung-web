import type { Message, PendingMessage } from "../types";

export function removePendingMatchedBySocketTextEcho(
  pending: PendingMessage[],
  socketMessage: Message,
  myUsername: string
): PendingMessage[] {
  if (socketMessage.senderUsername !== myUsername) return pending;
  if (socketMessage.clientId) {
    const byClientId = pending.findIndex(
      (msg) =>
        msg.state === "pending" && msg.clientId === socketMessage.clientId
    );
    if (byClientId === -1) return pending;
    return [...pending.slice(0, byClientId), ...pending.slice(byClientId + 1)];
  }
  if (socketMessage.chatType !== "TEXT") return pending;

  const text = socketMessage.content;
  const idx = pending.findIndex(
    (msg) =>
      msg.state === "pending" &&
      msg.senderUsername === myUsername &&
      msg.chatRoomUUID === socketMessage.chatRoomUUID &&
      msg.chatType === "TEXT" &&
      msg.content === text
  );
  if (idx === -1) return pending;
  return [...pending.slice(0, idx), ...pending.slice(idx + 1)];
}
