import { clientApiRequest } from "@/core/api/client";

import {
  EmailExistsRequest,
  emailExistsRequestSchema,
  EmailExistsResponse,
  emailExistsResponseSchema,
} from "./dto.schema";

export const fetchEmailExists = async (
  data: EmailExistsRequest
): Promise<EmailExistsResponse> =>
  clientApiRequest({
    url: "/api/auth/sign-up/check-email",
    method: "POST",
    body: data,
    requestBodySchema: emailExistsRequestSchema,
    responseSchema: emailExistsResponseSchema,
  });
