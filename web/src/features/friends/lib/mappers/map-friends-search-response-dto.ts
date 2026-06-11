import type { z } from "zod";

import { mapUserDto } from "./map-user-dto";
import { friendsSearchResponseSchema } from "../../api/client/dto.schema";
import type { FriendStatus } from "../../types";

export type FriendsSearchResponseParsed = z.infer<
  typeof friendsSearchResponseSchema
>;

/** 검색 API 배열 응답 → `FriendStatus[]` */
export function mapFriendsSearchResponseDtoToFriendStatuses(
  rows: FriendsSearchResponseParsed
): FriendStatus[] {
  return rows.map((row) => ({
    user: mapUserDto(row.user),
    friendRequestInfo: row.friendRequestInfo,
  }));
}
