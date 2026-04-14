"use client";

import { memo, useCallback } from "react";

import { Button, cn } from "@/shared";

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
    <div className="px-[8px]">
      <Button
        className={
          cn(
            (isParticipated
              ? "disabled:cursor-not-allowed disabled:border disabled:border-grey-400 disabled:bg-background disabled:text-grey-500"
              : "bg-primary text-background")
          )
        }
        onClick={handleClick}
        disabled={isParticipated}
      >
        {isParticipated ? "참여중인 번개" : "참가하기"}
      </Button>
    </div>
  );
});
