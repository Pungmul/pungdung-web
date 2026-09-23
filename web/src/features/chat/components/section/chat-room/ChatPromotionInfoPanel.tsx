"use client";

import { useQuery } from "@tanstack/react-query";

import { ChatPerformanceChatNotice } from "./ChatPerformanceChatNotice";
import { ChatPromotionInfoPanelView } from "./ChatPromotionInfoPanelView";

import { formatPromotionDate, formatPromotionTime } from "@/features/promotion/lib";
import { promotionQueries } from "@/features/promotion/queries";

type ChatPromotionInfoPanelProps = {
  publicKey: string;
};

export function ChatPromotionInfoPanel({
  publicKey,
}: ChatPromotionInfoPanelProps) {
  const { data } = useQuery(promotionQueries.detail(publicKey));

  if (!data) return null;

  const scheduleLabel = data.startAt
    ? `${formatPromotionDate(data.startAt)} ${formatPromotionTime(data.startAt)}`
    : "미정";
  const location = data.address
    ? [data.address.buildingName, data.address.detail]
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .join(" ")
    : "";

  return (
    <>
      <ChatPromotionInfoPanelView
        href={`/board/promote/d/${publicKey}`}
        posterUrl={data.performanceImageInfoList[0]?.imageUrl ?? null}
        title={data.title}
        location={location || "주소 없음"}
        scheduleLabel={scheduleLabel}
      />
      <ChatPerformanceChatNotice />
    </>
  );
}
