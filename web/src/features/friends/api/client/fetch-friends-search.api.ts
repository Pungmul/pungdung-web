import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { friendsSearchResponseSchema } from "./dto.schema";
import { mapFriendsSearchResponseDtoToFriendStatuses } from "../../lib";

export const fetchFriendsSearch = (keyword: string) => {
  const params = new URLSearchParams({ keyword });
  return withResponseMapper({
    context: "fetchFriendsSearch",
    fetchDto: () =>
      clientApiRequest({
        url: `/api/friends/search?${params.toString()}`,
        method: "GET",
        responseSchema: friendsSearchResponseSchema,
      }),
    map: mapFriendsSearchResponseDtoToFriendStatuses,
  });
};
