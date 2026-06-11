import { z } from "zod";

const publishedOptionSchema = z.object({
  id: z.number(),
  label: z.string(),
  orderNo: z.number(),
});

const surveyQuestionBaseInputSchema = z.object({
  id: z.number(),
  label: z.string(),
  required: z.boolean(),
  orderNo: z.number(),
  imageUrl: z.string().nullable().optional(),
  settingsJson: z.string(),
  options: z.array(publishedOptionSchema),
});

export function parsePromotionQuestionSettingsJson(
  raw: string
): Record<string, unknown> {
  if (!raw?.trim()) {
    return {};
  }
  try {
    const value: unknown = JSON.parse(raw);
    return typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

const promotionSurveyTextQuestionSchema = surveyQuestionBaseInputSchema
  .extend({
    questionType: z.literal("TEXT"),
  })
  .transform((data) => {
    const parsed = parsePromotionQuestionSettingsJson(data.settingsJson);
    const maxLengthRaw = parsed.maxLength;
    const placeholderRaw = parsed.placeholder;
    const maxLength =
      typeof maxLengthRaw === "number" &&
      Number.isFinite(maxLengthRaw) &&
      maxLengthRaw > 0
        ? Math.floor(maxLengthRaw)
        : 100;
    const placeholder =
      typeof placeholderRaw === "string" ? placeholderRaw : "답변을 입력해주세요.";

    return {
      questionType: "TEXT" as const,
      id: data.id,
      label: data.label,
      required: data.required,
      orderNo: data.orderNo,
      imageUrl: data.imageUrl,
      settings: {
        maxLength,
        placeholder,
      },
      options: data.options,
    };
  });

const promotionSurveyChoiceQuestionSchema = surveyQuestionBaseInputSchema
  .extend({
    questionType: z.literal("CHOICE"),
  })
  .refine((data) => data.options.length >= 1, {
    message: "선택형 질문은 선택지가 1개 이상이어야 합니다.",
    path: ["options"],
  })
  .transform((data) => ({
    questionType: "CHOICE" as const,
    id: data.id,
    label: data.label,
    required: data.required,
    orderNo: data.orderNo,
    imageUrl: data.imageUrl,
    options: data.options,
  }));

const promotionSurveyCheckboxQuestionSchema = surveyQuestionBaseInputSchema
  .extend({
    questionType: z.literal("CHECKBOX"),
  })
  .refine((data) => data.options.length >= 1, {
    message: "체크박스 질문은 선택지가 1개 이상이어야 합니다.",
    path: ["options"],
  })
  .transform((data) => {
    const parsed = parsePromotionQuestionSettingsJson(data.settingsJson);
    const minRaw = parsed.min;
    const maxRaw = parsed.max;
    const optionCount = data.options.length;

    let min =
      typeof minRaw === "number" && Number.isFinite(minRaw)
        ? Math.floor(minRaw)
        : 1;
    let max =
      typeof maxRaw === "number" && Number.isFinite(maxRaw)
        ? Math.floor(maxRaw)
        : optionCount;

    min = Math.max(1, Math.min(min, optionCount));
    max = Math.max(1, Math.min(max, optionCount));
    if (min > max) {
      min = 1;
      max = optionCount;
    }

    return {
      questionType: "CHECKBOX" as const,
      id: data.id,
      label: data.label,
      required: data.required,
      orderNo: data.orderNo,
      imageUrl: data.imageUrl,
      settings: { min, max },
      options: data.options,
    };
  });

/** 공개 문항 와이어 → 설문 응답 UI용 정규화 문항 */
export const promotionSurveyQuestionSchema = z.discriminatedUnion(
  "questionType",
  [
    promotionSurveyTextQuestionSchema,
    promotionSurveyChoiceQuestionSchema,
    promotionSurveyCheckboxQuestionSchema,
  ]
);

export type PromotionSurveyQuestion = z.infer<typeof promotionSurveyQuestionSchema>;

const surveyFieldAnswerSchema = z.object({
  answerText: z.string().nullable(),
  selectedOptionIds: z.array(z.number()),
});

/** 질문 목록에 맞춰 `required`, 선택지 id, 체크박스 min/max 를 검증한다. */
export function createPromotionSurveyFormValuesSchema(
  questions: PromotionSurveyQuestion[]
) {
  return z
    .object({
      answers: z.record(z.string(), surveyFieldAnswerSchema),
    })
    .superRefine((data, ctx) => {
      const answers = data.answers;

      for (const question of questions) {
        const key = String(question.id);
        const answer =
          answers[key] ??
          ({
            answerText: null,
            selectedOptionIds: [] as number[],
          } satisfies {
            answerText: string | null;
            selectedOptionIds: number[];
          });
        const optionIdSet = new Set(question.options.map((o) => o.id));

        if (question.questionType === "TEXT") {
          const text = answer.answerText?.trim() ?? "";
          if (question.required && text.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "이 질문은 필수 응답 항목입니다.",
              path: ["answers", key],
            });
          }
          if (text.length > question.settings.maxLength) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `답변은 ${question.settings.maxLength}자 이하여야 합니다.`,
              path: ["answers", key],
            });
          }
          continue;
        }

        if (question.questionType === "CHOICE") {
          const ids = answer.selectedOptionIds ?? [];
          if (question.required && ids.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "이 질문은 필수 응답 항목입니다.",
              path: ["answers", key],
            });
            continue;
          }
          if (ids.length > 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "객관식은 하나만 선택할 수 있습니다.",
              path: ["answers", key],
            });
          }
          for (const id of ids) {
            if (!optionIdSet.has(id)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "유효하지 않은 선택지입니다.",
                path: ["answers", key],
              });
              break;
            }
          }
          continue;
        }

        // CHECKBOX
        const ids = answer.selectedOptionIds ?? [];
        const uniqueIds = new Set(ids);
        if (uniqueIds.size !== ids.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "중복된 선택이 있습니다.",
            path: ["answers", key],
          });
        }
        for (const id of ids) {
          if (!optionIdSet.has(id)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "유효하지 않은 선택지입니다.",
              path: ["answers", key],
            });
            break;
          }
        }
        if (question.required && ids.length < question.settings.min) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "이 질문은 필수 응답 항목입니다.",
            path: ["answers", key],
          });
        }
        if (ids.length > question.settings.max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `최대 ${question.settings.max}개까지 선택할 수 있습니다.`,
            path: ["answers", key],
          });
        }
      }
    });
}

export type PromotionSurveyFormValues = {
  answers: Record<
    string,
    {
      answerText: string | null;
      selectedOptionIds: number[];
    }
  >;
};
