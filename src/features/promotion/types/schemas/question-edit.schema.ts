import { z } from "zod";

import { questionOptionSchema } from "./question-option.schema";
import type { PromotionQuestionKind } from "../promotion-question.types";

const textQuestionSchema = z.object({
  questionType: z.literal("TEXT"),
  label: z.string().trim().min(1, "질문을 입력해주세요."),
  required: z.boolean(),
  options: z.array(questionOptionSchema).max(0),
});

const choiceQuestionSchema = z.object({
  questionType: z.literal("CHOICE"),
  label: z.string().trim().min(1, "질문을 입력해주세요."),
  required: z.boolean(),
  options: z
    .array(questionOptionSchema)
    .min(1, "선택지를 1개 이상 입력해주세요."),
});

const checkboxQuestionSchema = z.object({
  questionType: z.literal("CHECKBOX"),
  label: z.string().trim().min(1, "질문을 입력해주세요."),
  required: z.boolean(),
  options: z
    .array(questionOptionSchema)
    .min(1, "선택지를 1개 이상 입력해주세요."),
});

export const questionItemEditSchema = z.discriminatedUnion("questionType", [
  textQuestionSchema,
  choiceQuestionSchema,
  checkboxQuestionSchema,
]);

export const getQuestionItemEditSchema = (
  questionType: PromotionQuestionKind
) => {
  switch (questionType) {
    case "TEXT":
      return textQuestionSchema;
    case "CHOICE":
      return choiceQuestionSchema;
    case "CHECKBOX":
      return checkboxQuestionSchema;
    default:
      return questionItemEditSchema;
  }
};

export type QuestionItemEditFormValues = z.infer<typeof questionItemEditSchema>;
