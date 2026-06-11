import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { friendsLoadResponseSchema } from "./dto.schema";
import { mapFriendsLoadDtoToDomain } from "../../lib";

export const fetchFriendsLoad = (keyword: string) => {
  const params = new URLSearchParams();
  if (keyword !== "") {
    params.set("keyword", keyword);
  }
  const qs = params.toString();
  const url = qs === "" ? "/api/friends/load" : `/api/friends/load?${qs}`;

  return withResponseMapper({
    context: "fetchFriendsLoad",
    fetchDto: () =>
      clientApiRequest({
        url,
        method: "GET",
        responseSchema: friendsLoadResponseSchema,
      }),
    map: mapFriendsLoadDtoToDomain,
  });
};
