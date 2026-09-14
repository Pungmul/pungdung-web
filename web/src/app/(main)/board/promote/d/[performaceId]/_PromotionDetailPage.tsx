"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useLoginRequiredConfirmAction } from "@/features/auth";
import {
  JoinedFriendsSheet,
  PromotionApplyButton,
  PromotionMenu,
  PromotionProfile,
  promotionQueries,
  PromotionShareButton,
} from "@/features/promotion";

import { Header, Spinner } from "@/shared";

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
  isGuest,
}: {
  performaceId: string;
  isGuest: boolean;
}) {
  const router = useRouter();
  const { requestLogin } = useLoginRequiredConfirmAction();
  const { data: promotionDetail } = useSuspenseQuery({
    ...promotionQueries.detail(performaceId),
  });
  const myFormListQuery = useQuery({
    ...promotionQueries.myFormList(),
    enabled: !isGuest,
  });
  const ownedForm = myFormListQuery.data?.find(
    (form) => form.publicKey === performaceId
  );
  const { data: appliedList, isPending: isAppliedListPending } = useQuery({
    ...promotionQueries.upcomingList(),
    enabled: !isGuest,
  });
  const hasApplied =
    appliedList?.some((booking) => booking.publicKey === performaceId) ?? false;
  const showKebab = isGuest || myFormListQuery.isSuccess;

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
        <Header
          title={promotionDetail.title}
          rightBtn={
            <div className="flex items-center gap-0.5">
              <PromotionShareButton />
              {showKebab && ownedForm != null ? (
                <PromotionMenu
                  isGuest={isGuest}
                  isWriter={Boolean(ownedForm)}
                  formId={ownedForm.id}
                  publicKey={promotionDetail.publicKey}
                />
              ) : null}
            </div>
          }
        />
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
        <div className="sticky bottom-0 left-0 right-0 z-50 w-full">
          <JoinedFriendsSheet friends={promotionDetail.joinedFriendList}>
            <div className="bg-gradient-to-t from-background via-background via-80% to-transparent px-[24px] pb-[32px] pt-[24px]">
              <PromotionApplyButton
                status={promotionDetail.status}
                closeAt={promotionDetail.closeAt}
                hasApplied={hasApplied}
                pending={!isGuest && isAppliedListPending}
                onApply={
                  isGuest
                    ? requestLogin
                    : () => router.push(`/board/promote/d/${performaceId}/survey`)
                }
              />
            </div>
          </JoinedFriendsSheet>
        </div>
      </article>
    </div>
  );
}

function PromotionTabs({ description }: { description?: string }) {
  return (
    <section className="relative w-full flex-grow h-full flex flex-col">
      <div className="w-full border-b border-grey-200 px-[24px]">
        <h2 className="relative w-[96px] py-[12px] text-center text-[15px] font-semibold text-grey-800">
          공연 소개
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-grey-800" />
        </h2>
      </div>
      <div className="w-full flex flex-col gap-[12px] py-[12px] min-h-[320px] px-[16px] flex-grow">
        <PromotionDescription description={description || ""} />
      </div>
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
