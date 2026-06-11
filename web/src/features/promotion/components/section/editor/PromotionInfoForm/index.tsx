"use client";
import { PromotionBasicInfoBlock } from "./PromotionBasicInfoBlock";
import { PromotionPersonnelBlock } from "./PromotionPersonnelBlock";
import { PromotionScheduleBlock } from "./PromotionScheduleBlock";

export const PromotionInfoForm = () => {
  return (
    <div className="flex flex-col w-full max-w-[640px] min-w-[320px] mx-auto gap-5 md:gap-6">
      <PromotionBasicInfoBlock />
      <PromotionScheduleBlock />
      <PromotionPersonnelBlock />
    </div>
  );
};
