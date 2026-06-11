import type { Address } from "@/shared/types";

import { mapPromotionPosterWireToClient } from "./map-promotion-poster";
import { mapPromotionPublishedQuestionWireToClient } from "./map-promotion-published-question";
import type {
  PromotionDetailWire,
  PromotionListItemWire,
} from "../../api/client/dto.schema";
import type { Promotion, PromotionDetail } from "../../types/promotion.types";

export function mapPromotionListItemWireToClient(
  wire: PromotionListItemWire
): Promotion {
  return {
    id: wire.id,
    ownerId: wire.ownerId,
    title: wire.title,
    description: wire.description,
    publicKey: wire.publicKey,
    status: wire.status,
    formType: wire.formType,
    performanceImageInfoList: wire.performanceImageInfoList
      ? wire.performanceImageInfoList.map(mapPromotionPosterWireToClient)
      : null,
    startAt: wire.startAt,
    limitNum: wire.limitNum,
    address: wire.address as Address | null,
    createdAt: wire.createdAt,
    updatedAt: wire.updatedAt,
  };
}

export function mapPromotionDetailWireToClient(
  wire: PromotionDetailWire
): PromotionDetail {
  return {
    performanceId: wire.performanceId,
    title: wire.title,
    description: wire.description,
    limitNum: wire.limitNum,
    startAt: wire.startAt,
    publicKey: wire.publicKey,
    performanceImageInfoList: wire.performanceImageInfoList.map(
      mapPromotionPosterWireToClient
    ),
    address: wire.address as Address | null,
    questions: wire.questions.map(mapPromotionPublishedQuestionWireToClient),
  };
}
