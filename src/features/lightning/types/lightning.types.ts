export interface LightningMeetingMessage {
  messageLogId: number;
  domainType: "LIGHTNING_MEETING";
  businessIdentifier: string;
  identifier: string | null;
  stompDest: string;
  content: LightningMeeting[];
}

export interface LightningMeeting {
  id: number;
  meetingName: string;
  recruitmentEndTime: string;
  startTime: string;
  endTime: string;
  minPersonNum: number;
  maxPersonNum: number;
  organizerId: number;
  meetingType: "FREE" | "PLAY" | "STUDY" | string;
  latitude: number;
  longitude: number;
  buildingName: string;
  locationDetail: string;
  tags: string[];
  lightningMeetingParticipantList: unknown[];
  instrumentAssignmentList: unknown[];
  status: "OPEN" | "CLOSED" | "CANCELLED" | "SUCCESS" | "READY";
  notificationSent: boolean;
  visibilityScope: "ALL" | "PRIVATE" | string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}

export type CreateLightningMeetingRequest =
  | {
      meetingName: string;
      recruitmentEndTime: string;
      startTime: string;
      endTime: string;
      minPersonNum: number;
      maxPersonNum: number;
      meetingType: "FREE";
      latitude: number;
      longitude: number;
      buildingName: string;
      locationDetail: string;
      visibilityScope: "ALL" | "SCHOOL_ONLY";
      tags: string[];
    }
  | {
      meetingName: string;
      recruitmentEndTime: string;
      startTime: string;
      endTime: string;
      minPersonNum: number;
      maxPersonNum: number;
      meetingType: "PAN";
      latitude: number;
      longitude: number;
      buildingName: string;
      locationDetail: string;
      visibilityScope: "ALL" | "SCHOOL_ONLY";
      tags: string[];
    };

export type NearLightningType = {
  distanceInMeters: number;
  lightningMeeting: LightningMeeting;
  organizerName: string;
};

export interface LightningCardRefType {
  focus: () => void;
  blur: () => void;
}

export interface LightningBottomSheetRefType {
  getLevel: () => number;
  onLevelChange: (
    callback: (oldLevel: number, newLevel: number) => void
  ) => void;
}

export interface UserParticipationData {
  isOrganizer: boolean;
  participant: boolean;
  lightningMeeting: LightningMeeting | null;
  chatRoomUUID: string | null;
}
