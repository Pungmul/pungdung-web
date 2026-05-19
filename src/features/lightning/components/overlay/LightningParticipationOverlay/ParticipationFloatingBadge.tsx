"use client";

import { motion } from "framer-motion";

import { Button } from "@/shared";

import { ParticipationStatusTag } from "./ParticipationStatusTag";
import type { LightningParticipationBadgeStatus } from "../../../lib/get-lightning-participation-time-display";
import type { LightningMeeting } from "../../../types";

type ParticipationFloatingBadgeProps = {
  meeting: LightningMeeting;
  subText: string;
  statusLabel: LightningParticipationBadgeStatus;
  onDetailOpen: () => void;
};

export function ParticipationFloatingBadge({
  meeting,
  subText,
  statusLabel,
  onDetailOpen,
}: ParticipationFloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute left-0 top-[12px] z-20 w-full px-[12px] md:bottom-[24px] md:left-[24px] md:top-auto md:w-full md:max-w-[390px] md:px-0"
    >
      <div className="flex w-full items-center rounded-[8px] bg-black/90 px-[16px] py-[12px] shadow-md">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <span className="text-[10px] font-bold tracking-[0.5px] text-secondary">
            참여중인 번개
          </span>
          <div className="flex min-w-0 items-center gap-[4px]">
            <span className="truncate text-[14px] font-normal tracking-[0.5px] text-[#f7f7f8]">
              {meeting.meetingName}
            </span>
            <ParticipationStatusTag statusLabel={statusLabel} />
          </div>
          <span className="truncate text-[10px] font-normal tracking-[0.5px] text-[#a4a6aa]">
            {subText}
          </span>
        </div>
        <Button
          type="button"
          className="ml-[12px] h-auto w-auto shrink-0 rounded-[4px] bg-[#232424] px-[12px] py-[8px] text-[12px] font-normal tracking-[0.5px] text-[#f7f7f8]"
          onClick={onDetailOpen}
        >
          상세보기
        </Button>
      </div>
    </motion.div>
  );
}
