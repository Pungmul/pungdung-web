"use client";

import { memo } from "react";

import { MapPinIcon } from "@heroicons/react/24/outline";

import { NearLightningCardInfo } from "./NearLightningCardInfo";
import { parseDistanceToString } from "../../../lib/parse-distance-to-string";
import type { NearLightningType } from "../../../types";

import "@/app/globals.css";

export const NearLightningCard = memo(function NearLightningCard({
  lightningMeeting,
  distanceInMeters,
}: NearLightningType) {
  return (
    <div
      className={`w-full h-full bg-background overflow-hidden flex flex-col gap-[12px] border-[2px] rounded-[4px] py-[12px] border-grey-200`}
    >
      <div className="flex flex-col flex-grow gap-[12px]">
        <div className="flex flex-row items-center justify-between px-[12px]">
          <div className="text-grey-500 text-[12px] font-normal p-[4px] bg-grey-200 rounded-[4px]">
            {lightningMeeting.meetingType === "FREE" ? "일반 모임" : "풍물 모임"}
          </div>
          <span className="text-grey-500 flex flex-row items-center gap-[4px]">
            <span className="flex size-5 items-center justify-center">
              <MapPinIcon className="size-full text-primary" />
            </span>
            <span className="text-grey-700 text-[12px]">{parseDistanceToString(distanceInMeters)}</span>
          </span>
        </div>
        <h1 className="text-grey-800 text-center font-semibold text-[16px] h-[36px]">
          {lightningMeeting.meetingName}
        </h1>
        <NearLightningCardInfo
          buildingName={lightningMeeting.buildingName}
          locationDetail={lightningMeeting.locationDetail}
          startTime={lightningMeeting.startTime}
          endTime={lightningMeeting.endTime}
        />
      </div>
    </div>
  );
});

