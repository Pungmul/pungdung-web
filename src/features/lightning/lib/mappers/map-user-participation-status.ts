import { mapLightningMeeting } from "./map-lightning-meeting";
import type { fetchUserParticipationStatusResponse } from "../../api/client/dto.schema";
import type { UserParticipationData } from "../../types";

export function mapUserParticipationStatus(
  dto: fetchUserParticipationStatusResponse
): UserParticipationData {
  return {
    participant: dto.participant,
    isOrganizer: dto.isOrganizer,
    chatRoomUUID: dto.chatRoomUUID,
    lightningMeeting: dto.lightningMeeting
      ? mapLightningMeeting(dto.lightningMeeting)
      : null,
  };
}
