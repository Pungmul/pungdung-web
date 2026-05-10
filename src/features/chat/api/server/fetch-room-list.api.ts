"use server";

import { cookies } from "next/headers";

import { resolveClientApiBody } from "@/core/api/client";

import { sortChatRoomByDate } from "../../lib/chat-room/sort-chat-room-by-date";
import {
  mapChatRoomListItemDtoToDomain,
} from "../../lib/mappers";
import type { ChatRoomListItem } from "../../types/chat-room.types";
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

  const raw: unknown = await response.json();
  const { list } = resolveClientApiBody(
    raw,
    response.ok,
    response.status,
    chatRoomListResponseEnvelopeSchema
  );

  return sortChatRoomByDate(list.map(mapChatRoomListItemDtoToDomain));
};
