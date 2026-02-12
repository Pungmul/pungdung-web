import type { LightningMeeting } from "./meeting.types";

/** 참가 중인지·해당 모임·채팅 식별자(매퍼로 DTO → 도메인) */
export type UserParticipationData = {
  participant: boolean;
  isOrganizer: boolean | null;
  chatRoomUUID: string | null;
  lightningMeeting: LightningMeeting | null;
};
