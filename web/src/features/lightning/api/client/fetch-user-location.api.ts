import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { fetchUserLocationResponseSchema } from "./dto.schema";
import { mapUserLocation } from "../../lib";

export const fetchUserLocation = () =>
  withResponseMapper({
    context: "fetchUserLocation",
    fetchDto: () =>
      clientApiRequest({
        url: "/api/location",
        method: "GET",
        responseSchema: fetchUserLocationResponseSchema,
      }),
    map: mapUserLocation,
  });
