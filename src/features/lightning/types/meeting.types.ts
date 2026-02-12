import {
  LIGHTNING_MEETING_TYPE,
  LIGHTNING_STATUS,
  VISIBILITY_SCOPE,
} from "../constants";

export interface LightningMeeting {
  id: number;
  meetingName: string;
  recruitmentEndTime: string;
  startTime: string;
  endTime: string;
  minPersonNum: number;
  maxPersonNum: number;
  organizerId: number;
  meetingType: (typeof LIGHTNING_MEETING_TYPE)[keyof typeof LIGHTNING_MEETING_TYPE];
  latitude: number;
  longitude: number;
  buildingName: string;
  locationDetail: string;
  tags: string[];
  lightningMeetingParticipantList: unknown[];
  instrumentAssignmentList: unknown[];
  status: (typeof LIGHTNING_STATUS)[keyof typeof LIGHTNING_STATUS];
  notificationSent: boolean;
  visibilityScope: (typeof VISIBILITY_SCOPE)[keyof typeof VISIBILITY_SCOPE];
  createdAt: string;
  updatedAt: string;
}

export interface LightningMeetingMessage {
  messageLogId: number;
  domainType: "LIGHTNING_MEETING";
  businessIdentifier: string;
  identifier: string | null;
  stompDest: string;
  content: LightningMeeting[];
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}
