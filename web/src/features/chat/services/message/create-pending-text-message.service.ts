import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import type { PendingMessage } from "../../types";

interface CreatePendingTextMessageParams {
  senderUsername: string;
  content: string;
  chatRoomUUID: string;
}

export const createPendingTextMessage = ({
  senderUsername,
  content,
  chatRoomUUID,
}: CreatePendingTextMessageParams): PendingMessage => {
  const clientId = uuidv4();
  return {
    id: clientId,
    clientId,
    senderUsername,
    content,
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    state: "pending",
  };
};
