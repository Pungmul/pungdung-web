"use client";

import { memo } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import type { NearLightningType } from "../../types";
import "@/app/globals.css";
import { parseDistanceToString } from "../../lib/parseDistanceToString";
import { NearLightningCardInfo } from "@/features/lightning/components/element/NearLightningCardInfo";

const NearLightningCard: React.FC<NearLightningType> = ({
  lightningMeeting,
  distanceInMeters,
}) => {

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
            <MapPinIcon className="size-[20px] text-primary" /> <span className="text-grey-700 text-[12px]">{parseDistanceToString(distanceInMeters)}</span>
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
};

export default memo(NearLightningCard);
