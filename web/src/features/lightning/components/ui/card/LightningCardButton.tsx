"use client";

import {
  memo,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";

import { Button, cn } from "@/shared";

const SINGLE_LIGHTNING_JOIN_TOOLTIP =
  "한번에 하나의 번개에만 참여할 수 있어요";

const participatedButtonClassName =
  "disabled:cursor-not-allowed disabled:border disabled:border-grey-400 disabled:bg-background disabled:text-grey-500";
const joinBlockedButtonClassName =
  "bg-primary text-background disabled:cursor-not-allowed disabled:bg-grey-200 disabled:text-grey-500";

interface LightningCardButtonProps {
  isJoinBlocked?: boolean;
  isParticipated: boolean;
  meetingId: number;
  onJoinLightning?: ({ meetingId }: { meetingId: number }) => void;
}

export const LightningCardButton = memo(function LightningCardButton({
  isJoinBlocked = false,
  isParticipated,
  meetingId,
  onJoinLightning,
}: LightningCardButtonProps) {
  const handleClick = useCallback(() => {
    onJoinLightning?.({ meetingId });
  }, [onJoinLightning, meetingId]);
  const isDisabled = isParticipated || isJoinBlocked;

  const button = (
    <Button
      className={cn(
        isParticipated
          ? participatedButtonClassName
          : isJoinBlocked
            ? joinBlockedButtonClassName
            : "bg-primary text-background"
      )}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {isParticipated ? "참여중인 번개" : "참가하기"}
    </Button>
  );

  return (
    <div className="px-[8px]">
      {isJoinBlocked ? (
        <JoinBlockedTooltip>{button}</JoinBlockedTooltip>
      ) : (
        button
      )}
    </div>
  );
});

function JoinBlockedTooltip({ children }: { children: ReactNode }) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        tabIndex={0}
        className="cursor-not-allowed"
        aria-label={SINGLE_LIGHTNING_JOIN_TOOLTIP}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
      >
        <div className="pointer-events-none">{children}</div>
      </div>
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-[calc(100%+8px)] left-1/2 z-20 w-max max-w-[240px] -translate-x-1/2 bg-[#222222]/80 px-3 py-2 text-center text-[12px] leading-5 text-white"
        >
          {SINGLE_LIGHTNING_JOIN_TOOLTIP}
        </span>
      ) : null}
    </div>
  );
}
