"use client";

import { memo, useCallback } from "react";

import { Button } from "@/shared";

interface LightningCardButtonProps {
  isParticipated: boolean;
  meetingId: number;
  onJoinLightning?: ({ meetingId }: { meetingId: number }) => void;
}

export const LightningCardButton = memo(function LightningCardButton({
  isParticipated,
  meetingId,
  onJoinLightning,
}: LightningCardButtonProps) {
  const handleClick = useCallback(() => {
    onJoinLightning?.({ meetingId });
  }, [onJoinLightning, meetingId]);

  return (
    <div className="px-[12px]">
      <Button
        className="!disabled:bg-grey-200 !disabled:text-grey-500 !disabled:cursor-not-allowed bg-primary text-background"
        onClick={handleClick}
        disabled={isParticipated}
      >
        {isParticipated ? "(번개 참여중)" : "번개 참여하기"}
      </Button>
    </div>
  );
});
