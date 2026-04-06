import { clientApiRequest } from "@/core/api/client";

import { invitationCodeResponseSchema } from "./dto.schema";

import type { InvitationCodeDto } from "./dto.schema";

export async function getMyInvitationCode(): Promise<InvitationCodeDto> {
  return clientApiRequest({
    url: "/api/member/invitation-code",
    responseSchema: invitationCodeResponseSchema,
  });
}
