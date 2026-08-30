"use client";

import { Controller, FormProvider, useFormContext } from "react-hook-form";

import type { FieldPath } from "react-hook-form";

import { Button, Spinner } from "@/shared";

import { JoinedFriendsSheet } from "./JoinedFriendsSheet";
import { QuestionAnswer } from "./QuestionAnswer";
import {
  type PromotionSurveySubmitState,
  usePromotionSurveyForm,
} from "../../../hooks/form";
import type {
  PromotionJoinedFriend,
  PromotionPublishedQuestion,
  PromotionSurveyFieldValue,
  PromotionSurveyFormValues,
  PromotionSurveyQuestion,
} from "../../../types";

interface PromotionSurveyFormProps {
  questions: PromotionPublishedQuestion[];
  joinedFriends?: PromotionJoinedFriend[];
  onSubmit?: (answers: Record<string, PromotionSurveyFieldValue>) => void;
}

function noop() { }

const REQUIRED_LABEL_LONG_THRESHOLD = 40;
const REQUIRED_COUNT_SHORT_FORM = 4;

function formatRequiredQuestionLabels(displayNumbers: number[]): string {
  if (displayNumbers.length === 0) {
    return "";
  }
  const longForm = displayNumbers.map((n) => `${n}번 질문`).join(", ");
  const useShortForm =
    displayNumbers.length > REQUIRED_COUNT_SHORT_FORM ||
    longForm.length > REQUIRED_LABEL_LONG_THRESHOLD;
  if (useShortForm) {
    return displayNumbers.map((n) => `${n}번`).join(", ");
  }
  return longForm;
}

function PromotionSurveyQuestionList({
  questions,
  showErrors,
}: {
  questions: PromotionSurveyQuestion[];
  showErrors: boolean;
}) {
  const { control } = useFormContext<PromotionSurveyFormValues>();

  return (
    <div className="space-y-[16px]">
      {questions.map((question, index) => {
        const name = `answers.${question.id}` as FieldPath<PromotionSurveyFormValues>;

        return (
          <Controller
            key={question.id}
            control={control}
            name={name}
            defaultValue={{
              answerText: null,
              selectedOptionIds: [],
            }}
            render={({ field, fieldState }) => (
              <QuestionAnswer
                question={question}
                questionIndex={index}
                field={field}
                fieldState={fieldState}
                showError={showErrors}
              />
            )}
          />
        );
      })}
    </div>
  );
}

function PromotionSurveySubmitButton({
  submit,
  joinedFriends,
}: {
  submit: PromotionSurveySubmitState;
  joinedFriends: PromotionJoinedFriend[];
}) {
  const isDisabled = submit.isSubmitting || !submit.canContinue;

  const invalidHint = (() => {
    if (submit.canContinue) {
      return null;
    }
    const labels = formatRequiredQuestionLabels(submit.requiredDisplayNumbers);
    if (labels) {
      return `필수 응답 항목을 모두 입력해주세요. (${labels})`;
    }
    return "입력 내용을 확인해주세요.";
  })();

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 w-full">
      <JoinedFriendsSheet friends={joinedFriends}>
        <div className="bg-gradient-to-t from-background via-background via-80% to-transparent px-[24px] pb-[32px] pt-[24px]">
          <Button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-[12px] rounded-md font-semibold ${isDisabled
              ? "!bg-grey-300 !text-grey-500 cursor-not-allowed"
              : "!bg-blue-600 hover:!bg-blue-700 !text-white"
              }`}
          >
            {invalidHint ? (
              invalidHint
            ) : submit.isSubmitting ? (
              <>
                <Spinner />
                <span className="ml-[8px]">제출 중...</span>
              </>
            ) : (
              "설문 제출하기"
            )}
          </Button>
        </div>
      </JoinedFriendsSheet>
    </div>
  );
}

export const PromotionSurveyForm = ({
  questions,
  joinedFriends = [],
  onSubmit = noop,
}: PromotionSurveyFormProps) => {
  const { form, normalizedQuestions, isInvalid, showErrors, submit } =
    usePromotionSurveyForm({
      questions,
      onSubmit,
    });

  if (isInvalid) {
    return (
      <div className="p-[16px] text-[14px] text-grey-700">
        설문 문항 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex h-full min-h-0 flex-1 flex-col bg-grey-200"
        onSubmit={(e) => {
          void submit.onSubmit(e);
        }}
      >
        <div className="flex-1 space-y-[24px] p-[16px]">
          <PromotionSurveyQuestionList
            questions={normalizedQuestions}
            showErrors={showErrors}
          />
        </div>
        <PromotionSurveySubmitButton
          submit={submit}
          joinedFriends={joinedFriends}
        />
      </form>
    </FormProvider>
  );
};
