import { clientApiRequest } from "@/core/api/client";

import { friendMutationVoidResponseSchema } from "./dto.schema";

export async function acceptFriendRequest(
  friendRequestId: number
): Promise<void> {
  const params = new URLSearchParams({
    friendRequestId: String(friendRequestId),
  });
  await clientApiRequest({
    url: `/api/friends/accept?${params.toString()}`,
    method: "POST",
    responseSchema: friendMutationVoidResponseSchema,
  });
}
