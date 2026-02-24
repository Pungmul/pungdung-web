"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

import { useSuspenseQuery } from "@tanstack/react-query";

import { PromotionProfile } from "@/features/promotion";
import { promotionQueries } from "@/features/promotion";

import { BottomFixedLinkButton, Header, Spinner } from "@/shared";

const Viewer = dynamic(
  () =>
    import("@/features/promotion/components/section/toast-ui").then((mod) => ({
      default: mod.ToastUIViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        key="viewer-loading"
        className="flex-1 flex items-center justify-center">
        <Spinner size={32} />
      </div>
    ),
  }
);

export function PromotionDetailPage({
  performaceId,
}: {
  performaceId: string;
}) {
  const { data: promotionDetail } = useSuspenseQuery({
    ...promotionQueries.detail(performaceId),
  });

  useEffect(() => {
    if (promotionDetail) {
      document.title = `풍덩 | ${promotionDetail.title}`;
    } else {
      document.title = "풍덩 | 공연";
    }
  }, [promotionDetail]);

  return (
    <div className="relative w-full md:max-w-[768px] mx-auto bg-background">
      <article className="relative w-full flex flex-col bg-background min-h-screen">
        <Header title={promotionDetail.title} />
        <section className="flex flex-col gap-[12px] flex-grow h-full">
          <PromotionProfile
            posterUrl={
              promotionDetail.performanceImageInfoList?.[0]?.imageUrl || ""
            }
            title={promotionDetail.title}
            address={promotionDetail.address ?? null}
            startAt={promotionDetail.startAt}
          />
          <PromotionTabs description={promotionDetail.description} />
        </section>
        <BottomFixedLinkButton href={`/board/promote/d/${performaceId}/survey`}>
          참가 신청하기
        </BottomFixedLinkButton>
      </article>
    </div>
  );
}

function PromotionTabs({ description }: { description?: string }) {
  return (
    <section className="relative w-full flex-grow h-full flex flex-col">
      <nav className="w-full" key="promotion-tabs-nav">
        <div className="flex flex-row w-full border-b border-grey-200 px-[24px]">
          <div
            className="relative w-[96px] text-center text-[15px] font-semibold py-[12px] cursor-pointer"
          >
            {"공연 소개"}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-grey-800"
            />
          </div>
        </div>
      </nav>
      <main className="w-full flex flex-col gap-[12px] py-[12px] min-h-[320px] px-[16px] flex-grow">
        <PromotionDescription description={description || ""} />
      </main>
    </section>
  );
}

function PromotionDescription({ description }: { description?: string }) {

  return (
    <section className="w-full flex flex-col gap-[12px] bg-background px-[16px] py-[16px] flex-grow">
      <div className="text-grey-500 text-[14px] font-normal max-w-full">
        <Viewer initialValue={description || ""} />
      </div>
    </section>
  );
}