import { clientApiRequest } from "@/core/api/client";

import { friendMutationVoidResponseSchema } from "./dto.schema";

export async function rejectFriendRequest(
  friendRequestId: number
): Promise<void> {
  const params = new URLSearchParams({
    friendRequestId: String(friendRequestId),
  });
  await clientApiRequest({
    url: `/api/friends/decline?${params.toString()}`,
    method: "POST",
    responseSchema: friendMutationVoidResponseSchema,
  });
}
