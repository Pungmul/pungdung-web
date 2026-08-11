"use client";

import { useQuery } from "@tanstack/react-query";

import { EmptyList } from "./EmptyList";
import { promotionQueries } from "../../../../queries/promotion.query";
import { PromotionPostBox, PromotionPostBoxSkeleton } from "../../../ui";

export function PromotionList({ isGuest }: { isGuest: boolean }) {
  const { data: promotionList, isLoading } = useQuery({
    ...promotionQueries.list(),
  });

  if (isLoading || !promotionList) {
    return (
      <ul className="relative grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full bg-background px-[24px] md:px-0 list-none">
        <PromotionPostBoxSkeleton length={9} />
      </ul>
    );
  }

  if (promotionList.length === 0) {
    return <EmptyList isGuest={isGuest} />;
  }

  return (
    <ul className="relative grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full bg-background px-[24px] md:px-0 list-none">
      {promotionList.map((promotion) => (
        <PromotionPostBox promotion={promotion} key={promotion.publicKey} />
      ))}
    </ul>
  );
}
