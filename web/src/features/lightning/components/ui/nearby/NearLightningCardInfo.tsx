"use client";

import { memo } from "react";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

import { formatLightningStartTimeLabel } from "../../../lib";
import { LIGHTNING_CARD_UNDECIDED_TIME_LABEL } from "../../../lib/format-lightning-start-time";

interface NearLightningCardInfoProps {
  buildingName: string;
  locationDetail: string;
  startTime: string | null;
}

export const NearLightningCardInfo = memo(function NearLightningCardInfo({
  buildingName,
  locationDetail,
  startTime,
}: NearLightningCardInfoProps) {
  return (
    <div className="flex flex-col items-start px-[12px] gap-[8px]">
      <NearLightningLocation buildingName={buildingName} locationDetail={locationDetail} />
      <NearLightningTime startTime={startTime} />
    </div>
  );
});

function NearLightningLocation({ buildingName, locationDetail }: { buildingName: string, locationDetail: string }) {

  if (buildingName.trim() === "") {
    return (
      <div className="flex flex-row items-end justify-between gap-[4px]">
        <span className="size-5 flex items-center justify-center">
          <MapPinIcon className="size-full text-primary" />
        </span>
        <h3 className="text-m1 font-normal text-grey-500">{locationDetail}</h3>
      </div>
    );
  }

  if (locationDetail.trim() === "") {
    return (
      <div className="flex flex-row items-end justify-between gap-[4px]">
        <span className="size-5 flex items-center justify-center">
          <MapPinIcon className="size-full text-primary" />
        </span>
        <h3 className="text-m1 font-normal text-grey-500">{buildingName}</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-end justify-between gap-[4px]">
      <span className="size-5 flex items-center justify-center">
        <MapPinIcon className="size-full text-primary" />
      </span>
      <div className="flex flex-col items-start gap-4">
        <h3 className="text-m1 font-normal text-grey-500">{buildingName}</h3>
        <h3 className="text-m1 font-normal text-grey-500">{locationDetail}</h3>
      </div>
    </div>
  );
}

function NearLightningTime({ startTime }: { startTime: string | null }) {
  return (
    <div className="flex flex-row items-end justify-between gap-[4px]">
      <span className="size-5 flex items-center justify-center">
        <ClockIcon className="size-full text-primary" />
      </span>
      <h3 className="text-m1 font-normal text-grey-500">
        {formatLightningStartTimeLabel(
          startTime,
          LIGHTNING_CARD_UNDECIDED_TIME_LABEL
        )}
      </h3>
    </div>
  );
}
