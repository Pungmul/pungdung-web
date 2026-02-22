import type { Address } from "@/shared/types";

import type { PromotionPoster } from "./promotion.types";
import type { PromotionDraftQuestion } from "./promotion-question.types";

export interface PromotionFormDraftSnapshot {
  title: string | null;
  description: string | null;
  questions: PromotionDraftQuestion[] | null;
  formType: string | null;
  startAt: string | null;
  limitNum: number | null;
  address: Address | null;
  performanceImageInfoList: PromotionPoster[] | null;
}

export interface PromotionFormDraft {
  version: number;
  snapshot: PromotionFormDraftSnapshot;
}

export interface PromotionFormListItem {
  address: Address | null;
  createdAt: string | null;
  description: string | null;
  formType: string | null;
  id: number;
  limitNum: number | null;
  ownerId: number;
  performanceImageInfoList: PromotionPoster[] | null;
  publicKey: string | null;
  startAt: string | null;
  status: string | null;
  title: string | null;
  updatedAt: string | null;
}

export interface PromotionFormSavePayload {
  expectedVersion: number;
  snapshot: {
    title: string | null;
    description: string | null;
    questions: PromotionDraftQuestion[] | null;
    formType: string | null;
    startAt: string | null;
    limitNum: number | null;
    address: Address | null;
    performanceImageIdList: number[] | null;
  };
}

export interface PromotionFormSaveAck {
  formId: number;
  version: number;
  autosavedAt: string;
}
