import { clientApiRequest } from "@/core/api/client";

import { createChatRoomSuccessDtoSchema } from "./dto.schema";

export async function createPersonalChatRoom(body: {
  receiverName: string;
}) {
  return clientApiRequest({
    url: "/api/chats/create/personal",
    method: "POST",
    body,
    responseSchema: createChatRoomSuccessDtoSchema,
  });
}

export async function createMultiChatRoom(body: {
  receiverNameList: string[];
}) {
  if (body.receiverNameList.length === 0) {
    throw new Error("친구를 선택해주세요");
  }

  return clientApiRequest({
    url: "/api/chats/create/multi",
    method: "POST",
    body,
    responseSchema: createChatRoomSuccessDtoSchema,
  });
}
