import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { chatRoomListResponseEnvelopeSchema } from "./dto.schema";
import { sortChatRoomByDate } from "../../lib";
import { mapChatRoomListItemDtoToDomain } from "../../lib/mappers";
import type { ChatRoomListItem } from "../../types/domain/chat-room.types";

export const loadChatRoomList = (): Promise<ChatRoomListItem[]> =>
  withResponseMapper({
    context: "loadChatRoomList",
    fetchDto: () =>
      clientApiRequest({
        url: "/api/chats/roomlist",
        method: "GET",
        responseSchema: chatRoomListResponseEnvelopeSchema,
      }),
    map: (dto) =>
      sortChatRoomByDate(dto.list.map(mapChatRoomListItemDtoToDomain)),
  });
