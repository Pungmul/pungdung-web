"use server";

import { cookies } from "next/headers";

import {
  mapChatRoomListItemDtoToDomain,
} from "../../lib/mappers";
import { sortChatRoomByDate } from "../../lib/sort-chat-room-by-date";
import type { ChatRoomListItem } from "../../types/domain/chat-room.types";
import { chatRoomListResponseEnvelopeSchema } from "../client/dto.schema";

export const fetchRoomListApi = async (): Promise<ChatRoomListItem[]> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) throw new Error("Access token not found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chats/roomlist`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!response.ok) throw Error("서버 불안정" + response.status);

  const json: unknown = await response.json();
  const { list } = chatRoomListResponseEnvelopeSchema.parse(json);

  return sortChatRoomByDate(list.map(mapChatRoomListItemDtoToDomain));
};
