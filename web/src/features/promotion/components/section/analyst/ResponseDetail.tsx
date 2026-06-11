"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import dayjs from "dayjs";

import { Button, Header } from "@/shared";

import { usePromotionResponseCancelFlow } from "../../../hooks/actions";
import { promotionQueries } from "../../../queries";
import type {
  PromotionApplicantAnswer,
  PromotionApplicationDetail,
  PromotionDetail,
  PromotionPublishedQuestion,
} from "../../../types";
import { PromotionProfile } from "../manage/PromotionProfile";

export function ResponseDetail({ responseId }: { responseId: string }) {
  const targetPerformanceKey = useSearchParams().get("targetPerformanceKey");

  if (!targetPerformanceKey) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-grey-600">
        공연 정보가 없습니다. 목록에서 다시 열어주세요.
      </div>
    );
  }

  return (
    <ResponseDetailContent
      responseId={responseId}
      targetPerformanceKey={targetPerformanceKey}
    />
  );
}

function ResponseDetailContent({
  responseId,
  targetPerformanceKey,
}: {
  responseId: string;
  targetPerformanceKey: string;
}) {
  const { handleCancelResponse } = usePromotionResponseCancelFlow(responseId);

  const { data: promotionResponseDetail } = useSuspenseQuery({
    ...promotionQueries.responseDetail(responseId),
  });

  const { data: promotionDetail } = useSuspenseQuery({
    ...promotionQueries.detail(targetPerformanceKey),
  });

  return (
    <>
      <Header title={promotionDetail.title} />
      <PromotionProfile
        posterUrl={
          promotionDetail.performanceImageInfoList?.[0]?.imageUrl || ""
        }
        title={promotionDetail.title}
        address={promotionDetail.address}
        startAt={promotionDetail.startAt}
      />
      <section className="w-full flex flex-col gap-[16px] px-[24px] py-[24px] flex-grow bg-background">
        <h3>
          {dayjs(promotionResponseDetail.submittedAt).format(
            "YYYY.MM.DD (ddd)"
          )}
          에 작성한 나의 답변
        </h3>
        <ResponseBox
          form={promotionResponseDetail}
          promotionDetail={promotionDetail}
        />
      </section>
      <section className="w-full flex justify-center px-[24px] py-[24px] bg-background">
        <Button onClick={handleCancelResponse}>취소하기</Button>
      </section>
    </>
  );
}

const ResponseBox = React.memo(
  ({
    form,
    promotionDetail,
  }: {
    form: PromotionApplicationDetail;
    promotionDetail: PromotionDetail;
  }) => {
    return (
      <div className="flex flex-col w-full px-[12px] py-[16px] border border-grey-200 rounded-[8px]">
        <div className="flex flex-col gap-[12px] pt-[12px]">
          {form.answerList.map((answer: PromotionApplicantAnswer) => {
            if (!promotionDetail.questions) {
              return null;
            }
            const question = promotionDetail.questions.find(
              (question: PromotionPublishedQuestion) => question.id === answer.questionId
            );
            return (
              <div
                key={answer.questionId}
                className="flex flex-col gap-[8px] p-[12px] bg-grey-50 rounded-[6px]"
              >
                <h3 className="font-semibold text-grey-700 text-[14px] lg:text-[16px]">
                  Q{question?.orderNo}.
                </h3>
                <span className="font-medium text-grey-400 text-[14px] lg:text-[16px]">
                  {
                    promotionDetail.questions.find(
                      (question: PromotionPublishedQuestion) =>
                        question.id === answer.questionId
                    )?.label
                  }
                </span>
                <div className="text-grey-800 text-[13px] lg:text-[15px]">
                  {question?.questionType === "TEXT" ? (
                    <div>{answer.answerText}</div>
                  ) : (
                    <div>
                      {answer.selectedOptions
                        ?.map((option) => option.label)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ResponseBox.displayName = "ResponseBox";
