import { clientApiRequest } from "@/core/api/client";

import { friendMutationVoidResponseSchema } from "./dto.schema";

export async function requestFriend(friendId: string): Promise<void> {
  const params = new URLSearchParams({ friendId });
  await clientApiRequest({
    url: `/api/friends/add?${params.toString()}`,
    method: "POST",
    responseSchema: friendMutationVoidResponseSchema,
  });
}
