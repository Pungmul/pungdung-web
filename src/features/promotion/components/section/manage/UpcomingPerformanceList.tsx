"use client";
import Image from "next/image";
import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";

import dayjs from "dayjs";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { LinkChipButton, ListEmptyView } from "@/shared/components";
import type { Address } from "@/shared/types";

import { promotionQueries } from "../../../queries/promotion.query";

const defaultUpcomingEmpty = (
  <ListEmptyView
    message="관람 예정인 공연이 없어요."
    action={
      <LinkChipButton
        href="/board/promote/l"
        filled
        className="inline-flex items-center gap-1"
      >
        지금 관람객을 모집중인 공연 확인하기
        <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
      </LinkChipButton>
    }
  />
);

interface UpcomingPerformanceListProps {
  ListEmptyComponent?: React.ReactNode;
}

export function UpcomingPerformanceList({
  ListEmptyComponent = defaultUpcomingEmpty,
}: UpcomingPerformanceListProps = {}) {
  const { data: upcomingPerformanceList } = useSuspenseQuery({
    ...promotionQueries.upcomingList(),
  });

  const isEmpty =
    !upcomingPerformanceList || upcomingPerformanceList.length === 0;

  if (isEmpty) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {ListEmptyComponent}
      </div>
    );
  }

  return (
    <div>
      {upcomingPerformanceList.map((performance) => (
        <UpcomingPerformanceItem
          key={performance.performanceId}
          {...performance}
          posterImage={performance.performanceImageList[0]?.fullFilePath ?? ""}
        />
      ))}
    </div>
  );
}

const UpcomingPerformanceItem = ({
  title,
  posterImage,
  address,
  startAt,
  submittedAt,
  responseId,
  publicKey,
}: {
  title: string;
  posterImage?: string;
  address?: Address | null;
  startAt: string;
  responseId: number;
  submittedAt: string;
  publicKey: string;
}) => {
  return (
    <Link
      href={`/board/r/${responseId}?targetPerformanceKey=${publicKey}`}
      className="w-full flex flex-row gap-[12px] bg-background px-[24px] py-[16px]"
    >
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
      <div className="flex-grow w-full flex justify-between flex-col items-start py-[8px] gap-[8px]">
        <div className="flex flex-row self-end gap-[8px] lg:gap-[16px] items-center font-normal max-w-full line-clamp-1 flex-shrink-0">
          <span className="font-normal text-grey-500 text-[12px] lg:text-[14px]">
            예약일
          </span>
          <span className="font-medium text-grey-800 text-[12px] lg:text-[14px]">
            {(() => {
              const date = submittedAt
                ? dayjs(new Date(submittedAt))
                : dayjs(new Date("2025-09-11T17:00:00"));
              return `${date.format("YYYY.MM.DD(ddd)")}`;
            })()}
          </span>
        </div>
        <div className="line-clamp-2 font-semibold text-[16px] lg:text-[18px] leading-[24px] text-grey-800">
          {title}
        </div>
        <div className="w-full flex flex-col gap-[4px] items-start">
          <div className="flex flex-row gap-[8px] lg:gap-[16px] items-start font-normal max-w-full line-clamp-1">
            <span className="font-normal text-grey-500 text-[12px] lg:text-[14px] flex-shrink-0">
              장소
            </span>
            <div className="flex-grow flex flex-col gap-[4px] items-start">
              <span className="font-normal text-grey-800 text-[12px] lg:text-[14px]">
                {address?.detail || "주소 없음"}
              </span>
              <span className="font-medium text-grey-500 text-[12px] lg:text-[14px]">
                {address?.buildingName || "주소 없음"}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-[8px] lg:gap-[16px] items-center font-normal max-w-full line-clamp-1">
            <span className="font-normal text-grey-500 text-[12px] lg:text-[14px]">
              날짜
            </span>
            <span className="font-medium text-grey-800 text-[12px] lg:text-[14px]">
              {(() => {
                const date = startAt
                  ? dayjs(new Date(startAt))
                  : dayjs(new Date("2025-09-11T17:00:00"));
                return `${date.format("YYYY.MM.DD(ddd)")}`;
              })()}
            </span>
          </div>
          <div className="flex flex-row gap-[8px] lg:gap-[16px] items-center font-normal max-w-full line-clamp-1">
            <span className="font-normal text-grey-500 text-[12px] lg:text-[14px]">
              시간
            </span>

            <span className="font-medium text-grey-800 text-[12px] lg:text-[14px]">
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
    </Link>
  );
};
