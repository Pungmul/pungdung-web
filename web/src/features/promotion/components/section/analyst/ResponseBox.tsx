"use client";
import React from "react";

import dayjs from "dayjs";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { usePromotionResponseBoxAccordion } from "../../../hooks/view-model/usePromotionResponseBoxAccordion";
import type {
  PromotionApplicantAnswer,
  PromotionApplicationDetail,
  PromotionPublishedQuestion,
} from "../../../types";
import { QuestionTypeBadge } from "../../ui/QuestionTypeBadge";

interface ResponseBoxProps {
  form: PromotionApplicationDetail;
  /** 카드 본문 질문 표시에만 사용 — 전체 공연 상세는 넘기지 않아도 됩니다. */
  questions: PromotionPublishedQuestion[];
}

function ResponseAnswerBody({
  question,
  answer,
}: {
  question: PromotionPublishedQuestion;
  answer: PromotionApplicantAnswer | undefined;
}) {
  if (!answer) {
    return <div className="text-grey-400 italic">(미응답)</div>;
  }
  if (question.questionType === "TEXT") {
    return <div>{answer.answerText || "(미응답)"}</div>;
  }
  if (answer.selectedOptions && answer.selectedOptions.length > 0) {
    return (
      <div>
        {answer.selectedOptions
          .map((option) => `${option.orderNo}. ${option.label}`)
          .join("\n")}
      </div>
    );
  }
  return <span className="text-grey-400 italic">(미응답)</span>;
}

export const ResponseBox = React.memo(
  ({ form, questions }: ResponseBoxProps) => {
    const { isOpen, contentHeight, contentRef, toggle, sortedQuestions } =
      usePromotionResponseBoxAccordion({
        answerList: form.answerList,
        questions,
      });

    return (
      <div className="flex flex-col w-full px-[12px] py-[16px] border border-grey-200 rounded-[8px] transition-all duration-300 ease-in">
        <div
          className="flex flex-row gap-[4px] items-center cursor-pointer px-[12px]"
          onClick={toggle}
        >
          <div className="flex flex-col gap-[4px] flex-grow">
            <div className="font-normal text-grey-500 text-[13px] lg:text-[15px]">
              {form.submitterUsername} ({form.submitterNickname})
            </div>
            <div className="font-normal text-grey-500 text-[13px] lg:text-[15px]">
              {dayjs(form.submittedAt).format("YYYY.MM.DD (ddd) A H:mm")}
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center justify-center px-1">
            <span
              className={`flex size-8 items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                }`}
            >
              <ChevronDownIcon className="size-full text-grey-500" />
            </span>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isOpen ? `${contentHeight}px` : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div ref={contentRef} className="flex flex-col gap-[12px] pt-[12px]">
            {sortedQuestions.map((question: PromotionPublishedQuestion) => {
              const answer = form.answerList.find(
                (a: PromotionApplicantAnswer) => a.questionId === question.id
              );

              return (
                <div
                  key={question.id}
                  className="flex flex-col gap-[8px] p-[12px] bg-grey-50 rounded-[6px]"
                >
                  <div className="flex flex-col gap-[6px]">
                    <div className="flex flex-row items-center gap-[4px]">
                      <h3 className="font-semibold text-grey-700 text-[13px] lg:text-[14px]">
                        Q{question.orderNo}.
                      </h3>
                      <span className="font-medium text-grey-400 text-[13px] lg:text-[14px]">
                        {question.label}
                      </span>
                      {question.required && (
                        <span className="text-red-500 ml-0.5 text-[12px]">*</span>
                      )}
                    </div>
                    <QuestionTypeBadge questionType={question.questionType} />
                  </div>
                  <div className="text-grey-800 text-[12px] lg:text-[13px] h-fit whitespace-pre-wrap leading-relaxed">
                    <ResponseAnswerBody question={question} answer={answer} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

ResponseBox.displayName = "ResponseBox";
