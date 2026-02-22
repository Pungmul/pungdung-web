import type { Address } from "@/shared/types";

import { mapPromotionDraftQuestionToWire, mapPromotionDraftQuestionWireToClient } from "./map-promotion-draft-question";
import { mapPromotionPosterWireToClient } from "./map-promotion-poster";
import type {
  PromotionFormDraftWire,
  PromotionFormListItemWire,
  PromotionFormSaveAckWire,
  PromotionFormSaveBodyWire,
} from "../../api/client/dto.schema";
import type {
  PromotionFormDraft,
  PromotionFormDraftSnapshot,
  PromotionFormListItem,
  PromotionFormSaveAck,
  PromotionFormSavePayload,
} from "../../types/promotion-form.types";

function mapPromotionFormDraftSnapshotWireToClient(
  snap: PromotionFormDraftWire["snapshotDto"]
): PromotionFormDraftSnapshot {
  return {
    title: snap.title,
    description: snap.description,
    questions:
      snap.questions?.map(mapPromotionDraftQuestionWireToClient) ?? null,
    formType: snap.formType,
    startAt: snap.startAt,
    limitNum: snap.limitNum,
    address: snap.address as Address | null,
    performanceImageInfoList: snap.performanceImageInfoList
      ? snap.performanceImageInfoList.map(mapPromotionPosterWireToClient)
      : null,
  };
}

export function mapPromotionFormDraftWireToClient(
  wire: PromotionFormDraftWire
): PromotionFormDraft {
  return {
    version: wire.version,
    snapshot: mapPromotionFormDraftSnapshotWireToClient(wire.snapshotDto),
  };
}

export function mapPromotionFormListItemWireToClient(
  wire: PromotionFormListItemWire
): PromotionFormListItem {
  return {
    address: wire.address as Address | null,
    createdAt: wire.createdAt,
    description: wire.description,
    formType: wire.formType,
    id: wire.id,
    limitNum: wire.limitNum,
    ownerId: wire.ownerId,
    performanceImageInfoList: wire.performanceImageInfoList
      ? wire.performanceImageInfoList.map(mapPromotionPosterWireToClient)
      : null,
    publicKey: wire.publicKey,
    startAt: wire.startAt,
    status: wire.status,
    title: wire.title,
    updatedAt: wire.updatedAt,
  };
}

export function mapPromotionFormSaveAckWireToClient(
  wire: PromotionFormSaveAckWire
): PromotionFormSaveAck {
  return {
    formId: wire.formId,
    version: wire.version,
    autosavedAt: wire.autosavedAt,
  };
}

export function mapPromotionFormSavePayloadToWire(
  payload: PromotionFormSavePayload
): PromotionFormSaveBodyWire {
  return {
    expectedVersion: payload.expectedVersion,
    snapshot: {
      title: payload.snapshot.title,
      description: payload.snapshot.description,
      questions:
        payload.snapshot.questions?.map(mapPromotionDraftQuestionToWire) ??
        null,
      formType: payload.snapshot.formType,
      startAt: payload.snapshot.startAt,
      limitNum: payload.snapshot.limitNum,
      address: payload.snapshot.address,
      performanceImageIdList: payload.snapshot.performanceImageIdList,
    },
  };
}
