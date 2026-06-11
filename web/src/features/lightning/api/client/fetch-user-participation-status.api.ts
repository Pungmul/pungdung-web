import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { fetchUserParticipationStatusResponseSchema } from "./dto.schema";
import { mapUserParticipationStatus } from "../../lib";

export const fetchUserParticipationStatus = () =>
  withResponseMapper({
    context: "fetchUserParticipationStatus",
    fetchDto: () =>
      clientApiRequest({
        url: "/api/lightning/status",
        method: "GET",
        responseSchema: fetchUserParticipationStatusResponseSchema,
      }),
    map: mapUserParticipationStatus,
  });
