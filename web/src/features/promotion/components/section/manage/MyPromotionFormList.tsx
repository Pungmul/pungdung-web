"use client";

import { useQuery } from "@tanstack/react-query";

import { ChipButton, Space } from "@/shared";

import { useMyPromotionFormListViewModel } from "../../../hooks/view-model";
import { promotionQueries } from "../../../queries";
import {
  AddNewPromotionPostBox,
  MyPromotionPostBox,
  PromotionPostBoxSkeleton,
} from "../../ui";

export function MyPromotionFormList() {
  const { data: promotionFormList, isPending, isError, refetch } = useQuery({
    ...promotionQueries.myFormList(),
  });

  const {
    selectedTab,
    setSelectedTab,
    selectedPromotionFormList,
  } = useMyPromotionFormListViewModel({ promotionFormList: promotionFormList ?? [] });

  return (
    <>
      <div className="flex flex-row gap-2 w-full px-2 sticky top-16 h-9 z-10 bg-background">
        <ChipButton
          filled={selectedTab === "OPEN"}
          onClick={() => setSelectedTab("OPEN")}
        >
          모집중인 공연
        </ChipButton>
        <ChipButton
          filled={selectedTab === "DRAFT"}
          onClick={() => setSelectedTab("DRAFT")}
        >
          작성중
        </ChipButton>
      </div>
      <Space className="bg-background h-4 sticky top-[6.25rem] z-10" />
      <ul className="relative grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full bg-background px-[24px] md:px-0 list-none">
        {isPending ? (
          <PromotionPostBoxSkeleton length={3} />
        ) : isError ? (
          <li className="col-span-full flex flex-col items-center gap-3 py-10 px-6 text-center text-muted-foreground text-sm">
            <p>내 홍보 목록을 불러오지 못했어요.</p>
            <button
              type="button"
              className="text-primary underline underline-offset-2"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </li>
        ) : (
          <>
            <AddNewPromotionPostBox />
            {selectedPromotionFormList.map((form) => (
              <MyPromotionPostBox form={form} key={form.id} />
            ))}
          </>
        )}
      </ul>
    </>
  );
}
