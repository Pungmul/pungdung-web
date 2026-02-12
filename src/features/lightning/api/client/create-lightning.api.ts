import { clientApiRequest } from "@/core/api/client";

import {
  type CreateLightningRequest,
  createLightningRequestSchema,
  createLightningResponseSchema,
} from "./dto.schema";

export const createLightning = (request: CreateLightningRequest) =>
  clientApiRequest({
    url: "/api/lightning/create",
    method: "POST",
    body: request,
    requestBodySchema: createLightningRequestSchema,
    responseSchema: createLightningResponseSchema,
  });
