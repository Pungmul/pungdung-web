"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient, useSuspenseQueries } from "@tanstack/react-query";

import type { PromotionSurveySubmitAnswer } from "@/features/promotion";
import {
  promotionQueries,
  PromotionSummaryCard,
  PromotionSurveyForm,
  submitPromotionSurvey,
} from "@/features/promotion";

import { AlertDialog, Header, Space } from "@/shared";

export function PromotionSurveyRoutePage({
  performaceId,
}: {
  performaceId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [{ data: promotionDetail }, { data: appliedList }] = useSuspenseQueries({
    queries: [
      promotionQueries.detail(performaceId),
      promotionQueries.upcomingList(),
    ],
  });
  const hasApplied = appliedList.some(
    (booking) => booking.publicKey === performaceId
  );
  const leaveToPromotionList = () => {
    router.replace("/board/promote/l");
  };

  const { mutate: submitAnswerMutation } = useMutation({
    mutationFn: (answerList: PromotionSurveySubmitAnswer[]) =>
      submitPromotionSurvey(performaceId, answerList),
  });

  useEffect(() => {
    document.title = `풍덩 | ${promotionDetail.title} 설문`;
  }, [promotionDetail.title]);

  if (hasApplied) {
    return (
      <AlertDialog
        isOpen
        title="알림"
        message="이미 신청한 공연입니다."
        onConfirm={leaveToPromotionList}
        onClose={leaveToPromotionList}
      />
    );
  }

  return (
    <div className="w-full flex flex-col gap-[12px] md:max-w-[768px] mx-auto min-h-screen bg-background">
      <Header
        title={promotionDetail.title}
        onLeftClick={() => {
          if (confirm("공연 신청을 중단할까요?")) {
            router.back();
          }
        }}
      />
      <main className="w-full min-h-0 flex flex-col bg-grey-100 flex-grow">
        <PromotionSummaryCard
          posterImage={
            promotionDetail.performanceImageInfoList?.[0]?.imageUrl || ""
          }
          title={promotionDetail.title}
          address={promotionDetail.address ?? null}
          startAt={promotionDetail.startAt}
        />
        <Space h={24} />
        <PromotionSurveyForm
          questions={promotionDetail.questions || []}
          onSubmit={(answers) => {
            const answerList: PromotionSurveySubmitAnswer[] =
              Object.entries(answers).map(([questionId, answer]) => ({
                questionId: Number(questionId),
                selectedOptionIds: answer.selectedOptionIds || [],
                answerText: answer.answerText || null,
              }));
            submitAnswerMutation(answerList, {
              onSuccess: async () => {
                await queryClient.invalidateQueries({
                  queryKey: promotionQueries.upcomingList().queryKey,
                });
                alert("설문이 성공적으로 제출되었습니다!");
                router.replace(`/board/promote/d/${performaceId}`);
              },
              onError: () => {
                alert("설문 제출 중 오류가 발생했습니다.");
              },
            });
          }}
        />
      </main>
    </div>
  );
}
