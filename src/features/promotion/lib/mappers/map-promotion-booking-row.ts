import type { Address } from "@/shared/types";

import type { PromotionBookingRowWire } from "../../api/client/dto.schema";
import type { PromotionBookingSummary } from "../../types/promotion-response.types";

export function mapPromotionBookingRowWireToClient(
  wire: PromotionBookingRowWire
): PromotionBookingSummary {
  return {
    address: wire.address as Address,
    formType: wire.formType,
    performanceId: wire.performanceId,
    performanceImageList: wire.performanceImageList,
    publicKey: wire.publicKey,
    startAt: wire.startAt,
    title: wire.title,
    status: wire.status,
    responseId: wire.responseId,
    updatedAt: wire.updatedAt,
    submittedAt: wire.submittedAt,
  };
}
