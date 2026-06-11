import { clientApiRequest } from "@/core/api/client";

import {
  type ExitLightningMeetingRequest,
  exitLightningMeetingRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const exitLightningMeeting = async ({
  lightningMeetingId,
}: ExitLightningMeetingRequest) =>
  clientApiRequest({
    url: "/api/lightning/exit",
    method: "POST",
    body: { lightningMeetingId },
    requestBodySchema: exitLightningMeetingRequestSchema,
    responseSchema: voidResponseSchema,
  });
