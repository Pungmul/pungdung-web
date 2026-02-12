import { clientApiRequest } from "@/core/api/client";

import {
  type JoinLightningMeetingRequest,
  joinLightningMeetingRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const joinLightningMeeting = async ({
  meetingId,
}: JoinLightningMeetingRequest) =>
  clientApiRequest({
    url: "/api/lightning/join",
    method: "POST",
    body: { meetingId },
    requestBodySchema: joinLightningMeetingRequestSchema,
    responseSchema: voidResponseSchema,
  });
