import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { lightningMeetingSchema } from "./dto.schema";
import { mapLightningMeeting } from "../../lib";

export const fetchLightningMeeting = (meetingId: number) =>
  withResponseMapper({
    context: "fetchLightningMeeting",
    fetchDto: () =>
      clientApiRequest({
        url: `/api/lightning/${meetingId}`,
        responseSchema: lightningMeetingSchema,
      }),
    map: mapLightningMeeting,
  });
