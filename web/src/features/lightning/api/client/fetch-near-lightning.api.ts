import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { fetchNearLightningResponseSchema } from "./dto.schema";
import { mapNearLightning } from "../../lib";

export const fetchNearLightning = () =>
  withResponseMapper({
    context: "fetchNearLightning",
    fetchDto: () =>
      clientApiRequest({
        url: "/api/lightning/nearby",
        method: "GET",
        responseSchema: fetchNearLightningResponseSchema,
      }),
    map: mapNearLightning,
  });
