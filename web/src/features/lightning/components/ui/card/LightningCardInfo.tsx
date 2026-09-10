"use client";

import { memo } from "react";

import {
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { formatLightningStartTimeLabel } from "../../../lib";
import { LIGHTNING_CARD_UNDECIDED_TIME_LABEL } from "../../../lib/format-lightning-start-time";

interface LightningCardInfoProps {
  buildingName?: string;
  locationDetail?: string;
  currentPersonNum: number;
  maxPersonNum: number;
  startTime: string | null;
}

export const LightningCardInfo = memo(function LightningCardInfo({
  buildingName,
  locationDetail,
  currentPersonNum,
  maxPersonNum,
  startTime,
}: LightningCardInfoProps) {
  return (
    <div className="flex flex-col items-start gap-[8px] px-[12px] py-[4px]">
      <LightningCardTime startTime={startTime} />
      <LightningCardLocation
        buildingName={buildingName ?? ""}
        locationDetail={locationDetail ?? ""}
      />
      <LightningCardParticipants
        currentPersonNum={currentPersonNum}
        maxPersonNum={maxPersonNum}
      />
    </div>
  );
});

function LightningCardLocation({ buildingName, locationDetail }: { buildingName?: string, locationDetail?: string }) {
  const locationText = [buildingName, locationDetail]
    .filter((value) => value && value.trim() !== "")
    .join(" ");

  if (!buildingName || buildingName?.trim() === "") {
    return (
      <div className="flex w-full min-w-0 flex-row items-center gap-[4px]">
        <span className="flex size-4 shrink-0 items-center justify-center">
          <MapPinIcon className="size-full text-primary stroke-[2px]" />
        </span>
        <h3 className="truncate text-[14px] font-normal tracking-[0.5px] text-grey-600">
          {locationDetail}
        </h3>
      </div>
    );
  }

  if (!locationDetail || locationDetail.trim() === "") {
    return (
      <div className="flex w-full min-w-0 flex-row items-center gap-[4px]">
        <span className="flex size-4 shrink-0 items-center justify-center">
          <MapPinIcon className="size-full text-primary stroke-[2px]" />
        </span>
        <h3 className="truncate text-[14px] font-normal tracking-[0.5px] text-grey-600">
          {buildingName}
        </h3>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-row items-center gap-[4px]">
      <span className="flex size-4 shrink-0 items-center justify-center">
        <MapPinIcon className="size-full text-primary stroke-[2px]" />
      </span>
      <h3 className="truncate text-[14px] font-normal tracking-[0.5px] text-grey-600">
        {locationText}
      </h3>
    </div>
  );
}

function LightningCardTime({ startTime }: { startTime: string | null }) {
  return (
    <div className="flex w-full min-w-0 flex-row items-center gap-[4px]">
      <span className="flex size-4 shrink-0 items-center justify-center">
        <ClockIcon className="size-full text-primary stroke-[2px]" />
      </span>
      <h3 className="truncate text-[14px] font-normal tracking-[0.5px] text-grey-600">
        {formatLightningStartTimeLabel(
          startTime,
          LIGHTNING_CARD_UNDECIDED_TIME_LABEL
        )}
      </h3>
    </div>
  );
}

function LightningCardParticipants({
  currentPersonNum,
  maxPersonNum,
}: {
  currentPersonNum: number;
  maxPersonNum: number;
}) {
  return (
    <div className="flex w-full min-w-0 flex-row items-center gap-[4px]">
      <span className="flex size-4 shrink-0 items-center justify-center">
        <UsersIcon className="size-full text-primary stroke-[2px]" />
      </span>
      <h3 className="truncate text-[14px] font-normal tracking-[0.5px] text-grey-600">
        {currentPersonNum}/{maxPersonNum} 명
      </h3>
    </div>
  );
}
