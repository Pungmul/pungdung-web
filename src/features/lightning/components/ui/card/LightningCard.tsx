"use client";

import { memo } from "react";

import { cn } from "@/shared";

import { LightningCardButton } from "./LightningCardButton";
import { LightningCardInfo } from "./LightningCardInfo";
import { LightningRemainingTime } from "./LightningRemainingTime";
import { LIGHTNING_MEETING_TYPE } from "../../../constants";
import { useLightningCardState } from "../../../hooks/state";
import type { LightningCardRefType, LightningMeeting } from "../../../types";

interface LightningCardProps extends LightningMeeting {
  isParticipated?: boolean;
  organizerName?: string;
  /** 생성 완료 등 목록 밖 미리보기에서 참여 버튼을 숨길 때 */
  hideJoinButton?: boolean;
  onJoinLightning?: ({ meetingId }: { meetingId: number }) => void;
  onRefSet?: (ref: LightningCardRefType | null) => void;
}

export const LightningCard = memo(function LightningCard({
  hideJoinButton = false,
  isParticipated = false,
  onJoinLightning,
  onRefSet,
  ...lightningMeeting
}: LightningCardProps) {
  const { isFocused } = useLightningCardState(onRefSet);

  return (
    <div
      className={cn("w-full h-full bg-background overflow-hidden flex flex-col gap-[12px] border-[2px] rounded-[4px] py-[12px]",
        isFocused ? "border-primary" : "border-grey-200")}
    >
      <div className="flex flex-col flex-grow gap-[12px]">
        <div className="flex flex-row items-center justify-between px-[12px]">
          <div className="text-grey-500 text-[12px] font-normal p-[4px] bg-grey-200 rounded-[4px]">
            {lightningMeeting.meetingType === LIGHTNING_MEETING_TYPE.FREE
              ? "일반 모임"
              : "풍물 모임"}
          </div>
          <LightningRemainingTime
            recruitmentEndTime={lightningMeeting.recruitmentEndTime}
          />
        </div>
        <h1 className="text-grey-800 text-center font-semibold text-[16px] h-[36px]">
          {lightningMeeting.meetingName}
        </h1>
        <LightningCardInfo
          buildingName={lightningMeeting.buildingName}
          locationDetail={lightningMeeting.locationDetail}
          startTime={lightningMeeting.startTime}
          endTime={lightningMeeting.endTime}
        />
        <div className="flex flex-row items-center justify-between px-[12px]">
          <span className="text-grey-500 text-[12px] font-normal p-[4px] bg-grey-200 rounded-[4px]">
            {"# "}{lightningMeeting.visibilityScope === "ALL" ? "전체" : "우리학교"}
          </span>
        </div>
      </div>
      {!hideJoinButton && (
        <LightningCardButton
          isParticipated={isParticipated}
          meetingId={lightningMeeting.id}
          {...(onJoinLightning && { onJoinLightning })}
        />
      )}
    </div>
  );
});
