import { clientApiRequest } from "@/core/api/client";

import { fetchUserLocationResponseSchema } from "./dto.schema";

export const fetchUserLocation = async () =>
  clientApiRequest({
    url: "/api/location",
    method: "GET",
    responseSchema: fetchUserLocationResponseSchema,
  });
