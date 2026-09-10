"use client";

import { useEffect, useState } from "react";

import { LIGHTNING_PARTICIPATION_TIME_MESSAGE } from "../../constants";
import {
  getLightningParticipationTimeDisplay,
  type LightningParticipationTimeDisplay,
} from "../../lib/get-lightning-participation-time-display";
import type { LightningMeeting } from "../../types";

const TICK_MS = 1000;

const EMPTY_DISPLAY: LightningParticipationTimeDisplay = {
  statusLabel: LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE.RECRUITING,
  subText: "",
  detailRemainingText: "",
};

export function useLightningParticipationTimeDisplay(
  meeting: LightningMeeting | null | undefined
): LightningParticipationTimeDisplay {
  const [display, setDisplay] = useState<LightningParticipationTimeDisplay>(
    () =>
      meeting
        ? getLightningParticipationTimeDisplay(meeting)
        : EMPTY_DISPLAY
  );

  useEffect(() => {
    if (!meeting) {
      setDisplay(EMPTY_DISPLAY);
      return;
    }

    const tick = () => {
      setDisplay(getLightningParticipationTimeDisplay(meeting));
    };

    tick();
    const intervalId = window.setInterval(tick, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [meeting]);

  return display;
}
