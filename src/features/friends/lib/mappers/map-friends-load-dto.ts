import type { z } from "zod";

import { mapUserDto } from "./map-user-dto";
import { friendsLoadResponseSchema } from "../../api/client/dto.schema";
import type { FriendsLoadData } from "../../types";

type FriendsLoadParsed = z.infer<typeof friendsLoadResponseSchema>;

/** Zod로 검증된 친구 로드 응답 → 화면용 도메인 모델 */
export function mapFriendsLoadDtoToDomain(dto: FriendsLoadParsed): FriendsLoadData {
  const mapRow = (row: FriendsLoadParsed["acceptedFriendList"][number]) => ({
    friendRequestId: row.friendRequestId,
    user: mapUserDto(row.simpleUserDTO),
  });

  return {
    acceptedFriendList: dto.acceptedFriendList.map(mapRow),
    pendingSentList: dto.pendingSentList.map(mapRow),
    pendingReceivedList: dto.pendingReceivedList.map(mapRow),
  };
}
