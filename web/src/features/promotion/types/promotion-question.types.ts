export type PromotionQuestionKind = "TEXT" | "CHOICE" | "CHECKBOX";

/** 등록/초안 편집기에서 쓰는 옵션 한 행 */
export interface PromotionDraftQuestionOption {
  label: string;
  orderNo: number;
}

/** 공개 설문·상세·응답 조회 등 서버에 저장된 옵션 */
export interface PromotionPublishedQuestionOption {
  id: number;
  label: string;
  orderNo: number;
}

/** 등록 화면 초안 질문 (임시 id = clientTempId) */
export interface PromotionDraftQuestion {
  clientTempId: string;
  questionType: PromotionQuestionKind;
  label: string;
  required: boolean;
  orderNo: number;
  imageUrl?: string | null;
  settingsJson: string;
  options: PromotionDraftQuestionOption[];
}

/** 공개된 공연 설문 문항 (서버 numeric id) */
export interface PromotionPublishedQuestion {
  id: number;
  questionType: PromotionQuestionKind;
  label: string;
  required: boolean;
  orderNo: number;
  imageUrl?: string | null;
  settingsJson: string;
  options: PromotionPublishedQuestionOption[];
}

/** 설문 제출 입력 폼 상태 */
export interface PromotionSurveyFieldValue {
  answerText?: string | null;
  selectedOptionIds?: number[];
}

export type {
  PromotionSurveyFormValues,
  PromotionSurveyQuestion,
} from "./schemas/promotion-survey-question.schema";

/** 신청·응답 상세에 포함된 한 문항 답변 */
export interface PromotionApplicantAnswer {
  questionId: number;
  selectedOptions: PromotionPublishedQuestionOption[];
  answerText: string | null;
}

export interface PromotionQuestionOptionStatistic {
  optionId: number;
  optionLabel: string;
  count: number;
  percentage: number;
}

export interface PromotionQuestionStatistics {
  questionId: number;
  questionLabel: string;
  required: boolean;
  questionType: PromotionQuestionKind;
  orderNo: number;
  textAnswers: string[];
  optionStatistics: PromotionQuestionOptionStatistic[];
  totalResponses: number;
}
