import { clientApiRequest } from "@/core/api/client";

import {
  cancelLightningMeetingBodySchema,
  cancelLightningMeetingResponseSchema,
  type DeleteLightningMeetingRequest,
} from "./dto.schema";

export const deleteLightningMeeting = ({
  lightningMeetingId,
}: DeleteLightningMeetingRequest) =>
  clientApiRequest({
    url: "/api/lightning/cancel",
    method: "POST",
    body: { meetingId: lightningMeetingId },
    requestBodySchema: cancelLightningMeetingBodySchema,
    responseSchema: cancelLightningMeetingResponseSchema,
  });
