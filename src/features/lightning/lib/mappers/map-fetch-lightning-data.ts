import { mapLightningMeeting } from "./map-lightning-meeting";
import type { FetchLightningDataResponse } from "../../api/client/dto.schema";
import type { LightningListData } from "../../types";

export function mapFetchLightningData(
  dto: FetchLightningDataResponse
): LightningListData {
  return {
    normalLightningMeetings:
      dto.normalLightningMeetings.map(mapLightningMeeting),
    schoolLightningMeetings:
      dto.schoolLightningMeetings.map(mapLightningMeeting),
  };
}
