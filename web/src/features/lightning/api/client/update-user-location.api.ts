import { clientApiRequest } from "@/core/api/client";

import {
  updateUserLocationRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const updateUserLocation = async (input: {
  latitude: number;
  longitude: number;
}) =>
  clientApiRequest({
    url: "/api/location",
    method: "POST",
    body: input,
    requestBodySchema: updateUserLocationRequestSchema,
    responseSchema: voidResponseSchema,
  });
