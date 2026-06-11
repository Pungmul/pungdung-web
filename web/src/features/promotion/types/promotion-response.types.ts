import type { Address } from "@/shared/types";

import type { PromotionApplicantAnswer } from "./promotion-question.types";

import type { ImageObject } from "@/shared";

/** 내가 신청한 공연 한 건(다가오는 공연 목록 등) */
export interface PromotionBookingSummary {
  address: Address;
  formType: string;
  performanceId: number;
  performanceImageList: ImageObject[];
  publicKey: string;
  startAt: string;
  title: string;
  status: string;
  responseId: number;
  updatedAt: string;
  submittedAt: string;
}

/**
 * 신청 상세·취소 응답·폼 관리 탭의 응답 한 행 등 동일한 응답 묶음 형태
 */
export interface PromotionApplicationDetail {
  responseId: number;
  formId: number;
  submitterUsername: string;
  submitterNickname: string;
  submittedAt: string;
  answerList: PromotionApplicantAnswer[];
}

/** 설문 제출 API 요청 본문의 답 한 개 */
export interface PromotionSurveySubmitAnswer {
  questionId: number;
  selectedOptionIds: number[];
  answerText: string | null;
}
