import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { fetchLightningDataResponseSchema } from "./dto.schema";
import { mapFetchLightningData } from "../../lib";

export const fetchLightningData = () =>
  withResponseMapper({
    context: "fetchLightningData",
    fetchDto: () =>
      clientApiRequest({
        url: "/api/lightning/search",
        responseSchema: fetchLightningDataResponseSchema,
      }),
    map: mapFetchLightningData,
  });
