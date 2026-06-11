import { z } from "zod";

/** 와이어: null 또는 주소 객체(형태는 런타임에만 느슨히 검증) */
const addressWireSchema = z.custom(
  (val) => val === null || (typeof val === "object" && val !== null)
);

const addressRequiredWireSchema = z.custom(
  (val) => typeof val === "object" && val !== null
);

export const promotionPosterWireSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
});
export type PromotionPosterWire = z.infer<typeof promotionPosterWireSchema>;

const promotionPublishedOptionWireSchema = z.object({
  id: z.number(),
  label: z.string(),
  orderNo: z.number(),
});
export type PromotionPublishedOptionWire = z.infer<
  typeof promotionPublishedOptionWireSchema
>;

const promotionPublishedQuestionWireSchema = z.object({
  id: z.number(),
  questionType: z.enum(["TEXT", "CHOICE", "CHECKBOX"]),
  label: z.string(),
  required: z.boolean(),
  orderNo: z.number(),
  imageUrl: z.string().nullable().optional(),
  settingsJson: z.string(),
  options: z.array(promotionPublishedOptionWireSchema),
});
export type PromotionPublishedQuestionWire = z.infer<
  typeof promotionPublishedQuestionWireSchema
>;

export const promotionSchema = z.object({
  id: z.number(),
  ownerId: z.number(),
  title: z.string(),
  description: z.string(),
  publicKey: z.string(),
  status: z.string(),
  formType: z.string(),
  performanceImageInfoList: z.array(promotionPosterWireSchema).nullable(),
  startAt: z.string().nullable(),
  limitNum: z.number().nullable(),
  address: addressWireSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type PromotionListItemWire = z.infer<typeof promotionSchema>;

export const promotionPerformanceListResponseSchema = z.object({
  performanceList: z.array(promotionSchema),
});
export type PromotionPerformanceListWirePayload = z.infer<
  typeof promotionPerformanceListResponseSchema
>;

export const promotionDetailSchema = z.object({
  performanceId: z.number(),
  title: z.string(),
  description: z.string(),
  limitNum: z.number().nullable(),
  startAt: z.string(),
  publicKey: z.string(),
  performanceImageInfoList: z.array(promotionPosterWireSchema),
  address: addressWireSchema,
  questions: z.array(promotionPublishedQuestionWireSchema),
});
export type PromotionDetailWire = z.infer<typeof promotionDetailSchema>;

export const imageObjectSchema = z.object({
  id: z.number(),
  originalFilename: z.string(),
  convertedFileName: z.string(),
  fullFilePath: z.string(),
  fileType: z.string(),
  fileSize: z.number().nullable(),
  createdAt: z.string(),
});

export const promotionBookingRowWireSchema = z.object({
  address: addressRequiredWireSchema,
  formType: z.string(),
  performanceId: z.number(),
  performanceImageList: z.array(imageObjectSchema),
  publicKey: z.string(),
  startAt: z.string(),
  title: z.string(),
  status: z.string(),
  responseId: z.number(),
  updatedAt: z.string(),
  submittedAt: z.string(),
});
export type PromotionBookingRowWire = z.infer<
  typeof promotionBookingRowWireSchema
>;

/** 예약·다가오는 공연 목록 한 행 (와이어) — 구 스키마명 유지 */
export const promotionResponseDtoSchema = promotionBookingRowWireSchema;

export const promotionApplicantAnswerWireSchema = z.object({
  questionId: z.number(),
  selectedOptions: z.array(promotionPublishedOptionWireSchema),
  answerText: z.string().nullable(),
});
export type PromotionApplicantAnswerWire = z.infer<
  typeof promotionApplicantAnswerWireSchema
>;

export const answerDtoSchema = promotionApplicantAnswerWireSchema;

export const promotionApplicationDetailWireSchema = z.object({
  responseId: z.number(),
  formId: z.number(),
  submitterUsername: z.string(),
  submitterNickname: z.string(),
  submittedAt: z.string(),
  answerList: z.array(promotionApplicantAnswerWireSchema),
});
export type PromotionApplicationDetailWire = z.infer<
  typeof promotionApplicationDetailWireSchema
>;

export const promotionResponseDetailDtoSchema =
  promotionApplicationDetailWireSchema;

export const responseDtoSchema = promotionApplicationDetailWireSchema;

const promotionDraftOptionWireSchema = z.object({
  label: z.string(),
  orderNo: z.number(),
});
export type PromotionDraftOptionWire = z.infer<
  typeof promotionDraftOptionWireSchema
>;

export const promotionDraftQuestionWireSchema = z.object({
  clientTempId: z.string(),
  questionType: z.enum(["TEXT", "CHOICE", "CHECKBOX"]),
  label: z.string(),
  required: z.boolean(),
  orderNo: z.number(),
  imageUrl: z.string().nullable().optional(),
  settingsJson: z.string(),
  options: z.array(promotionDraftOptionWireSchema),
});
export type PromotionDraftQuestionWire = z.infer<
  typeof promotionDraftQuestionWireSchema
>;

export const formDetailDtoSchema = z.object({
  version: z.number(),
  snapshotDto: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    questions: z.array(promotionDraftQuestionWireSchema).nullable(),
    formType: z.string().nullable(),
    startAt: z.string().nullable(),
    limitNum: z.number().nullable(),
    address: addressWireSchema,
    performanceImageInfoList: z.array(promotionPosterWireSchema).nullable(),
  }),
});
export type PromotionFormDraftWire = z.infer<typeof formDetailDtoSchema>;

export const formDtoSchema = z.object({
  address: addressWireSchema,
  createdAt: z.string().nullable(),
  description: z.string().nullable(),
  formType: z.string().nullable(),
  id: z.number(),
  limitNum: z.number().nullable(),
  ownerId: z.number(),
  performanceImageInfoList: z.array(promotionPosterWireSchema).nullable(),
  publicKey: z.string().nullable(),
  startAt: z.string().nullable(),
  status: z.string().nullable(),
  title: z.string().nullable(),
  updatedAt: z.string().nullable(),
});
export type PromotionFormListItemWire = z.infer<typeof formDtoSchema>;

export const myPromotionFormListResponseSchema = z.object({
  formList: z.array(formDtoSchema),
});

export const createPromotionResponseSchema = z.object({
  formId: z.number(),
});

export const formSaveResponseSchema = z.object({
  formId: z.number(),
  version: z.number(),
  autosavedAt: z.string(),
});
export type PromotionFormSaveAckWire = z.infer<typeof formSaveResponseSchema>;

export const promotionFormSaveBodyWireSchema = z.object({
  expectedVersion: z.number(),
  snapshot: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    questions: z.array(promotionDraftQuestionWireSchema).nullable(),
    formType: z.string().nullable(),
    startAt: z.string().nullable(),
    limitNum: z.number().nullable(),
    address: addressWireSchema,
    performanceImageIdList: z.array(z.number()).nullable(),
  }),
});
export type PromotionFormSaveBodyWire = z.infer<
  typeof promotionFormSaveBodyWireSchema
>;

export const uploadPromotionImageResponseSchema = z.object({
  performanceImageList: z.array(
    z.object({
      id: z.number(),
      imageUrl: z.string(),
      originalFileName: z.string(),
    })
  ),
});

export const submitSurveyResponseSchema = z.unknown();

/** 요청 본문 형태(스키마 미검증) */
export type PromotionSurveySubmitBodyWire = {
  answers: Array<{
    questionId: number;
    selectedOptionIds: number[];
    answerText: string | null;
  }>;
};
