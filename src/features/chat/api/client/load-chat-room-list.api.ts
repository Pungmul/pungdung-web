import { chatRoomListResponseEnvelopeSchema } from "./dto.schema";
import { sortChatRoomByDate } from "../../lib";
import {
  mapChatRoomListItemDtoToDomain,
} from "../../lib/mappers";
import type { ChatRoomListItem } from "../../types/domain/chat-room.types";

export const loadChatRoomList = async (): Promise<ChatRoomListItem[]> => {
  try {
    const proxyUrl = `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chats/roomlist`;

    const response = await fetch(proxyUrl, {
      credentials: "include",
    });

    if (!response.ok) throw Error("서버 불안정" + response.status);

    const json: unknown = await response.json();
    const { list } = chatRoomListResponseEnvelopeSchema.parse(json);

    return sortChatRoomByDate(list.map(mapChatRoomListItemDtoToDomain));
  } catch (e) {
    throw e;
  }
};
