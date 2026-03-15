import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { sortChatRoomByDate } from "../../lib";
import {
  mapChatRoomListItemDtoToDomain,
} from "../../lib/mappers";
import type { ChatRoomListItem } from "../../types/domain/chat-room.types";
import { chatRoomListResponseEnvelopeSchema } from "./dto.schema";

export const loadChatRoomList = (): Promise<ChatRoomListItem[]> =>
  withResponseMapper({
    context: "loadChatRoomList",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chats/roomlist`,
        method: "GET",
        responseSchema: chatRoomListResponseEnvelopeSchema,
      }),
    map: (dto) =>
      sortChatRoomByDate(dto.list.map(mapChatRoomListItemDtoToDomain)),
  });
