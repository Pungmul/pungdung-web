import { clientApiRequest } from "@/core/api/client";

import type { Member } from "@/features/user";

import { memberMeResponseSchema } from "./dto.schema";

import { mapMemberMeDtoToMember } from "@/features/my-page/lib/mapper/map-member-me-dto-to-member";

export async function getMyPageInfo(): Promise<Member> {
  const dto = await clientApiRequest({
    url: "/api/users/me",
    responseSchema: memberMeResponseSchema,
  });

  return mapMemberMeDtoToMember(dto);
}
