import Image from "next/image";

import dayjs from "dayjs";

import { Address } from "@/shared/types";

interface PromotionSummaryCardProps {
  title: string;
  posterImage?: string;
  address?: Address | null;
  startAt: string;
}

export const PromotionSummaryCard = ({
  title,
  posterImage,
  address,
  startAt,
}: PromotionSummaryCardProps) => {
  return (
    <div className="w-full flex flex-row gap-[12px] bg-background px-[24px] py-[16px]">
      <div className="relative h-[168px] lg:h-[192px]">
        <div className="relative h-full aspect-[2/3] flex items-center justify-center bg-grey-200 rounded-[4px] overflow-hidden border border-grey-200 ">
          {posterImage && (
            <Image
              src={posterImage ?? "/example/poster.jpg"}
              alt={title || ""}
              fill
              className="object-cover object-center w-full "
            />
          )}
        </div>
      </div>
      <div className="flex-grow w-full flex justify-between flex-col items-start py-[12px]">
        <div className="line-clamp-2 font-semibold text-[16px] lg:text-[23px] leading-[24px] text-grey-800">
          {title}
        </div>
        <div className="w-full flex flex-col gap-[4px] items-start">
          <div className="flex flex-row gap-[8px] lg:gap-[16px] items-start font-normal max-w-full line-clamp-1">
            <span className="font-normal text-grey-500 text-[13px] lg:text-[18px] flex-shrink-0">
              장소
            </span>
            <div className="flex-grow flex flex-col gap-[4px] items-start">
              <span className="font-normal text-grey-800 text-[13px] lg:text-[18px]">
                {address?.detail || "주소 없음"}
              </span>
              <span className="font-medium text-grey-500 text-[13px] lg:text-[18px]">
                {address?.buildingName || "주소 없음"}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-[8px] lg:gap-[16px] items-center font-normal max-w-full line-clamp-1">
            <span className="font-normal text-grey-500 text-[13px] lg:text-[18px]">
              날짜
            </span>
            <span className="font-medium text-grey-800 text-[13px] lg:text-[18px]">
              {(() => {
                const date = startAt
                  ? dayjs(new Date(startAt))
                  : dayjs(new Date("2025-09-11T17:00:00"));
                return `${date.format("YYYY.MM.DD(ddd)")}`;
              })()}
            </span>
          </div>
          <div className="flex flex-row gap-[8px] lg:gap-[16px] items-center font-normal max-w-full line-clamp-1">
            <span className="font-normal text-grey-500 text-[13px] lg:text-[18px]">
              시간
            </span>

            <span className="font-medium text-grey-800 text-[13px] lg:text-[18px]">
              {(() => {
                const date = startAt
                  ? dayjs(new Date(startAt))
                  : dayjs(new Date("2025-09-11T17:00:00"));
                const hour = date.hour();
                const timePrefix = hour < 12 ? "이른" : "늦은";
                const time12 = date.format("h시 mm분");
                return `${timePrefix} ${time12}`;
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
