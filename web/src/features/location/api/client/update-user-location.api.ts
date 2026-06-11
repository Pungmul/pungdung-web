import { clientApiRequest } from "@/core/api/client";

import {
  UpdateUserLocationRequest,
  updateUserLocationRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const updateUserLocation = async (
  payload: UpdateUserLocationRequest
): Promise<void> =>
  clientApiRequest({
    url: "/api/location",
    method: "POST",
    body: payload,
    requestBodySchema: updateUserLocationRequestSchema,
    responseSchema: voidResponseSchema,
  });
