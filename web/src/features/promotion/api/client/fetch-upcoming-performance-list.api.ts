import { z } from "zod";

import { clientApiRequest } from "@/core/api/client";

import { promotionResponseDtoSchema } from "./dto.schema";
import { mapPromotionBookingRowWireToClient } from "../../lib/mappers";
import type { PromotionBookingSummary } from "../../types";

const promotionResponseListSchema = z.array(promotionResponseDtoSchema);

export async function fetchUpcomingPerformanceList(): Promise<
  PromotionBookingSummary[]
> {
  const wireList = await clientApiRequest({
    url: "/api/promotions/responses/me",
    responseSchema: promotionResponseListSchema,
  });
  return wireList.map(mapPromotionBookingRowWireToClient);
}
