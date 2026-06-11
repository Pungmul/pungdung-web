import { mapLightningMeeting } from "./map-lightning-meeting";
import type { FetchNearLightningResponse } from "../../api/client/dto.schema";
import type { NearLightningType } from "../../types";

export function mapNearLightning(dto: FetchNearLightningResponse): {
  lightningMeetingList: NearLightningType[];
} {
  return {
    lightningMeetingList: dto.lightningMeetingList.map((item) => ({
      distanceInMeters: item.distanceInMeters,
      organizerName: item.organizerName,
      lightningMeeting: mapLightningMeeting(item.lightningMeeting),
    })),
  };
}
