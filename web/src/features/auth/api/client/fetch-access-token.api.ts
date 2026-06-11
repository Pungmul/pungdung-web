import { clientApiRequest } from "@/core/api/client";

import { AccessTokenResponse, accessTokenResponseSchema } from "./dto.schema";

/**
 * accessToken 조회 (GET /api/auth/token)
 * 사용처: useQuery(authQueries.token()) → app (main) SocketProvider, roomReadSocket
 */
export const fetchAccessToken = async (): Promise<AccessTokenResponse> =>
  clientApiRequest({
    url: "/api/auth/token",
    method: "GET",
    responseSchema: accessTokenResponseSchema,
    headers: {
      credentials: "include",
    },
  });
