import type { Address } from "@/shared/types";

import type { PromotionDraftQuestion } from "./promotion-question.types";

/** 포스터 필드 — `PromotionPoster`와 동일 형태 */
export type PromotionPostingPosterValue = {
  id: number;
  imageUrl: string;
};

/** 프로모션 등록 화면 상위 RHF 값 (`expectedVersion`은 쿼리 캐시가 truth) */
export interface PromotionPostingFormValues {
  title: string;
  address: Address | null;
  date: string;
  time: string;
  limitPersonnel: number;
  isUnlimitedPersonnel: boolean;
  poster: PromotionPostingPosterValue | null;
  questions: PromotionDraftQuestion[];
  /** 에디터 초기 시드 — 편집 중 본문은 에디터 인스턴스가 우선 */
  descriptionSeed: string;
}
