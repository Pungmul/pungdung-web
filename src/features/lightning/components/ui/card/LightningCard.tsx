"use client";

import { memo } from "react";

import { cn } from "@/shared";

import { LightningCardButton } from "./LightningCardButton";
import { LightningCardInfo } from "./LightningCardInfo";
import { LightningParticipantAvatarStack } from "./LightningParticipantAvatarStack";
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
  const { currentPersonNum, participantProfiles } = lightningMeeting;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-[16px] overflow-hidden rounded-[5px] border bg-background px-[8px] py-[16px]",
        isFocused ? "border-primary" : "border-grey-200"
      )}
    >
      <div className="flex flex-grow flex-col gap-[16px]">
        <div className="flex flex-row items-center justify-between px-[12px]">
          <div className="rounded-[4px] bg-grey-200 p-[4px] text-[12px] font-normal text-grey-500">
            {lightningMeeting.meetingType === LIGHTNING_MEETING_TYPE.FREE
              ? "일반 모임"
              : "풍물 모임"}
          </div>
          <LightningRemainingTime
            recruitmentEndTime={lightningMeeting.recruitmentEndTime}
          />
        </div>
        <h1 className="flex h-[36px] items-center justify-center truncate px-[12px] text-center text-[16px] font-semibold tracking-[0.5px] text-grey-800">
          {lightningMeeting.meetingName}
        </h1>
        <LightningCardInfo
          buildingName={lightningMeeting.buildingName}
          locationDetail={lightningMeeting.locationDetail}
          currentPersonNum={currentPersonNum}
          maxPersonNum={lightningMeeting.maxPersonNum}
          startTime={lightningMeeting.startTime}
          endTime={lightningMeeting.endTime}
        />
        <div className="flex flex-row items-center justify-between px-[12px]">
          <LightningParticipantAvatarStack
            participantProfiles={participantProfiles}
            currentPersonNum={currentPersonNum}
          />
          <span className="text-[14px] font-normal tracking-[0.5px] text-grey-500">
            {lightningMeeting.visibilityScope === "ALL" ? "전체" : "우리학교"}
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
