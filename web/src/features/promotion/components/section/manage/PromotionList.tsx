"use client";
import { useQuery } from "@tanstack/react-query";

import { promotionQueries } from "../../../queries/promotion.query";
import { PromotionPostBox, PromotionPostBoxSkeleton } from "../../ui";

export function PromotionList() {
  const { data: promotionList, isLoading } = useQuery({
    ...promotionQueries.list(),
  });

  return (
    <ul className="relative grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full bg-background px-[24px] md:px-0 list-none">
      {isLoading || !promotionList ? (
        <PromotionPostBoxSkeleton length={9} />
      ) : (
        promotionList.map((promotion) => (
          <PromotionPostBox promotion={promotion} key={promotion.publicKey} />
        ))
      )}
    </ul>
  );
}
