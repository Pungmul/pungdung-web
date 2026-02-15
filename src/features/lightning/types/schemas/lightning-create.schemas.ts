import { z } from "zod";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../constants/lightning-create-form-fields";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;

export const lightningLocationPointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

/** 최종 저장·요청 검증 (.refine 전 객체 스키마 — 스텝별 pick에 사용) */
export const lightningCreateFieldsSchema = z.object({
  [FIELDS.TITLE]: z.string(),
  [FIELDS.MIN_PERSONNEL]: z
    .number()
    .min(4, "최소 인원은 4명 이상이어야 합니다")
    .max(99, "최소 인원은 최대 99명까지 가능합니다"),
  [FIELDS.MAX_PERSONNEL]: z
    .number()
    .min(5, "최대 인원은 5명 이상이어야 합니다")
    .max(100, "최대 인원은 최대 100명까지 가능합니다"),
  [FIELDS.LIGHTNING_TYPE]: z.enum(["일반 모임", "풍물 모임"]),
  [FIELDS.RECRUIT_END_TIME]: z.string().min(1, "모집 종료 시간을 선택해주세요"),
  [FIELDS.ADDRESS]: z.string().min(1, "주소를 선택해주세요"),
  [FIELDS.DETAIL_ADDRESS]: z.string().optional(),
  [FIELDS.LOCATION_POINT]: lightningLocationPointSchema
    .nullable()
    .refine((locationPoint) => locationPoint !== null, {
      message: "위치를 선택해주세요",
    }),
  [FIELDS.TARGET]: z.enum(["우리 학교만", "전체"]),
  [FIELDS.TAG_LIST]: z
    .array(z.string())
    .max(5, "태그는 최대 5개까지 가능합니다"),
});

/** 스텝 단위 버튼/에러 표시용 (폼 일부 필드만 검증) */
export const lightningSelectTypeStepSchema = lightningCreateFieldsSchema.pick({
  [FIELDS.LIGHTNING_TYPE]: true,
});

export const lightningSelectLocationStepSchema =
  lightningCreateFieldsSchema.pick({
    [FIELDS.ADDRESS]: true,
    [FIELDS.LOCATION_POINT]: true,
  });

export const lightningSelectTimeAndPersonnelStepSchema =
  lightningCreateFieldsSchema
    .pick({
      [FIELDS.RECRUIT_END_TIME]: true,
      [FIELDS.MIN_PERSONNEL]: true,
      [FIELDS.MAX_PERSONNEL]: true,
    })
    .refine((data) => data.minPersonnel < data.maxPersonnel, {
      message: "최소 인원은 최대 인원보다 작아야 합니다",
      path: [FIELDS.MIN_PERSONNEL],
    });

export const lightningSelectTargetStepSchema = lightningCreateFieldsSchema.pick(
  {
    [FIELDS.TARGET]: true,
  }
);

export const lightningSummaryTitleStepSchema = z.object({
  [FIELDS.TITLE]: z
    .string()
    .refine((t) => t === "" || t.trim().length > 0, {
      message: "공백만으로는 입력할 수 없습니다",
    }),
});

export const lightningBuildSchema = lightningCreateFieldsSchema.refine(
  (data) => data.minPersonnel < data.maxPersonnel,
  {
    message: "최소 인원은 최대 인원보다 작아야 합니다",
    path: [FIELDS.MIN_PERSONNEL],
  }
);

export const lightningCreateSchema = lightningBuildSchema;

export type LightningCreateFormData = z.infer<typeof lightningBuildSchema>;
