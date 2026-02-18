import { z } from "zod";

import { POST_REPORT_TYPES } from "../../constants";

const keys = Object.keys(POST_REPORT_TYPES) as [
  keyof typeof POST_REPORT_TYPES,
  ...(keyof typeof POST_REPORT_TYPES)[],
];

const reportReasonSelectableSchema = z.enum(keys);

/** 모달 제출 시 `reportPostRequestBodySchema`와 동일한 키로 본문을 만든다. */
export const reportPostModalFormSchema = z
  .object({
    reportReason: reportReasonSelectableSchema.optional(),
  })
  .refine((v) => v.reportReason !== undefined, {
    message: "사유를 선택하세요",
    path: ["reportReason"],
  });

export type ReportPostModalFormValues = z.infer<
  typeof reportPostModalFormSchema
>;
