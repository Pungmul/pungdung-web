import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import type { PendingMessage } from "../types";

interface CreatePendingImageMessageParams {
  senderUsername: string;
  files: FileList;
  chatRoomUUID: string;
}

export const createPendingImageMessage = ({
  senderUsername,
  files,
  chatRoomUUID,
}: CreatePendingImageMessageParams): PendingMessage => {
  const clientId = uuidv4();
  return {
    id: clientId,
    clientId,
    senderUsername,
    content: null,
    chatType: "IMAGE",
    imageUrlList: Array.from(files).map((file) => URL.createObjectURL(file)),
    chatRoomUUID,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    state: "pending",
  };
};
