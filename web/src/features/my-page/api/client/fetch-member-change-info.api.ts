import { clientApiRequest } from "@/core/api/client";

import {
  type MemberChangeInfoDto,
  memberChangeInfoResponseSchema,
} from "./dto.schema";

export async function getMemberChangeInfo(): Promise<MemberChangeInfoDto> {
  return clientApiRequest({
    url: "/api/member/change-info",
    responseSchema: memberChangeInfoResponseSchema,
  });
}
