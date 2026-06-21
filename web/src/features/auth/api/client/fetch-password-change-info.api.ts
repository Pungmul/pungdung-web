import { clientApiRequest } from "@/core/api/client";

import {
  type PasswordChangeInfoDto,
  passwordChangeInfoResponseSchema,
} from "./dto.schema";

export async function fetchPasswordChangeInfo(): Promise<PasswordChangeInfoDto> {
  return clientApiRequest({
    url: "/api/auth/change-password/info",
    responseSchema: passwordChangeInfoResponseSchema,
  });
}
