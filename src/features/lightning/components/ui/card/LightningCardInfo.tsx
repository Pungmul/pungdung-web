"use client";

import { memo } from "react";

import dayjs from "dayjs";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface LightningCardInfoProps {
  buildingName?: string;
  locationDetail?: string;
  startTime: string;
  endTime: string;
}

export const LightningCardInfo = memo(function LightningCardInfo({
  buildingName,
  locationDetail,
  startTime,
  endTime,
}: LightningCardInfoProps) {
  return (
    <div className="flex flex-col items-start px-[12px] gap-[8px]">
      <LightningCardLocation buildingName={buildingName ?? ""} locationDetail={locationDetail ?? ""} />
      <LightningCardTime startTime={startTime} endTime={endTime} />
    </div>
  );
});


function LightningCardLocation({ buildingName, locationDetail }: { buildingName?: string, locationDetail?: string }) {
  if (!buildingName || buildingName?.trim() === "") {
    return (
      <div className="flex flex-row items-end justify-between gap-[4px]">
        <span className="flex size-6 items-center justify-center">
          <MapPinIcon className="size-full text-primary" />
        </span>
        <h3 className="text-m1 font-normal text-grey-600 py-1">{locationDetail}</h3>
      </div>
    );
  }

  if (!locationDetail || locationDetail.trim() === "") {
    return (
      <div className="flex flex-row items-end justify-between gap-[4px]">
        <span className="flex size-6 items-center justify-center">
          <MapPinIcon className="size-full text-primary" />
        </span>
        <h3 className="text-m1 font-normal text-grey-600 py-1">{buildingName}</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-end justify-between gap-[4px]">
      <span className="flex size-6 items-center justify-center">
        <MapPinIcon className="size-full text-primary" />
      </span>
      <div className="flex flex-col items-start gap-4 py-1">
        <h3 className="text-m1 font-normal text-grey-600">{buildingName}</h3>
        <h3 className="text-m1 font-normal text-grey-600">{locationDetail}</h3>
      </div>
    </div>
  );
}

function LightningCardTime({ startTime, endTime }: { startTime: string, endTime: string }) {
  return (
    <div className="flex flex-row items-end justify-between gap-[4px]">
      <span className="flex size-6 items-center justify-center">
        <ClockIcon className="size-full text-primary" />
      </span>
      <h3 className="text-m1 font-normal text-grey-600">{dayjs(startTime).format("HH:mm")}~{dayjs(endTime).format("HH:mm")}</h3>
    </div>
  );
}
