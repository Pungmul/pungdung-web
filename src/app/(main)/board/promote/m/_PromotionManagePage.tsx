"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { PromotionProfile,promotionQueries, StatisticsTabs } from "@/features/promotion";

import { Header, Space, Spinner } from "@/shared";

export function PromotionManagePage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const performanceId = searchParams.get("performanceId");

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
  return (
    <div className="w-full bg-grey-100">
      <Header title="공연 관리" />
      <PromotionProfile
        posterUrl={
          promotionDetail.performanceImageInfoList?.[0]?.imageUrl || ""
        }
        title={promotionDetail.title}
        address={promotionDetail.address}
        startAt={promotionDetail.startAt}
      />
      <Space h={32} />
      <section
        className="w-full flex flex-col flex-grow bg-background"
        id="response-list"
      >
        <StatisticsTabs responses={form} promotionDetail={promotionDetail} />
      </section>
    </div>
  );
}
