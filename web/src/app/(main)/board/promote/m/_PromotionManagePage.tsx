"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import {
  PromotionProfile,
  promotionQueries,
  StatisticsTabs,
  useClosePromotionFormAction,
} from "@/features/promotion";

import { BottomFixedButton, Header, Space, Spinner } from "@/shared";

export function PromotionManagePage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const performanceId = searchParams.get("performanceId");
  const { requestCloseForm, isPending: isClosePending } =
    useClosePromotionFormAction();

  const { data: promotionDetail, isLoading: isPromotionDetailLoading } =
    useQuery({
      ...promotionQueries.detail(performanceId ?? ""),
      enabled: Boolean(performanceId),
    });

  const { data: form, isLoading: isFormLoading } = useQuery({
    ...promotionQueries.formResponses(formId ?? ""),
    enabled: Boolean(formId),
  });

  useEffect(() => {
    if (promotionDetail) {
      document.title = `풍덩 | ${promotionDetail.title} 관리`;
    } else {
      document.title = "풍덩 | 공연 관리";
    }
  }, [promotionDetail]);
  if (!formId) return null;
  if (isFormLoading || isPromotionDetailLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  if (!form || !promotionDetail)
    return (
      <div className="flex items-center justify-center h-full w-full">
        폼을 찾을 수 없습니다.
      </div>
    );
  const formIdNumber = Number(formId);
  const showCloseRecruitment =
    promotionDetail.status !== "CLOSED" && Number.isInteger(formIdNumber);

  return (
    <div className="flex min-h-app w-full flex-col bg-background">
      <Header title="공연 관리" />
      <PromotionProfile
        posterUrl={
          promotionDetail.performanceImageInfoList?.[0]?.imageUrl || ""
        }
        title={promotionDetail.title}
        address={promotionDetail.address}
        startAt={promotionDetail.startAt}
      />
      <Space h={32} className="bg-grey-100" />
      <section
        className="flex w-full flex-1 flex-col bg-background"
        id="response-list"
      >
        <StatisticsTabs responses={form} promotionDetail={promotionDetail} />
      </section>
      {showCloseRecruitment ? (
        <BottomFixedButton
          type="button"
          disabled={isClosePending}
          onClick={() =>
            requestCloseForm({
              formId: formIdNumber,
              publicKey: promotionDetail.publicKey,
            })
          }
        >
          모집 중단
        </BottomFixedButton>
      ) : null}
    </div>
  );
}
