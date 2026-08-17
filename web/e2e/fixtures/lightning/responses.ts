import { okEnvelope } from "../envelope";

const now = "2027-12-01T00:00:00.000Z";
const later = "2027-12-01T03:00:00.000Z";

export const e2eLightningMeeting = {
  id: 1001,
  meetingName: "E2E 테스트 번개",
  recruitmentEndTime: later,
  startTime: later,
  endTime: "2026-08-10T05:00:00.000Z",
  minPersonNum: 2,
  maxPersonNum: 8,
  organizerId: 1,
  meetingType: "FREE" as const,
  latitude: 37.5665,
  longitude: 126.978,
  buildingName: "시청역",
  locationDetail: "1번 출구",
  tags: ["e2e"],
  currentPersonNum: 1,
  participantProfiles: [],
  lightningMeetingParticipantList: [],
  instrumentAssignmentList: [],
  status: "OPEN" as const,
  notificationSent: false,
  visibilityScope: "ALL" as const,
  createdAt: now,
  updatedAt: now,
};

export const lightningSearchEmpty = okEnvelope({
  normalLightningMeetings: [] as (typeof e2eLightningMeeting)[],
  schoolLightningMeetings: [] as (typeof e2eLightningMeeting)[],
});

export const lightningSearchWithMeeting = okEnvelope({
  normalLightningMeetings: [e2eLightningMeeting],
  schoolLightningMeetings: [] as (typeof e2eLightningMeeting)[],
});

export const lightningStatusNotParticipating = okEnvelope({
  participant: false,
  isOrganizer: null,
  chatRoomUUID: null,
  lightningMeeting: null,
  participantProfiles: [],
});

export const e2eSchoolLightningMeeting = {
  ...e2eLightningMeeting,
  id: 1002,
  meetingName: "E2E 학교 번개",
  visibilityScope: "SCHOOL_ONLY" as const,
};

export const e2eSocketLightningMeeting = {
  ...e2eLightningMeeting,
  id: 1003,
  meetingName: "E2E 소켓 번개",
};

export const e2eSchoolSocketLightningMeeting = {
  ...e2eSchoolLightningMeeting,
  id: 1006,
  meetingName: "E2E 소켓 학교 번개",
};

export const e2eSecondLightningMeeting = {
  ...e2eLightningMeeting,
  id: 1005,
  meetingName: "E2E 두번째 번개",
  latitude: 37.5701,
  longitude: 126.982,
};

export const e2eReconnectLightningMeeting = {
  ...e2eLightningMeeting,
  id: 1004,
  meetingName: "E2E 재연결 번개",
};

export const lightningSearchWithTwoMeetings = okEnvelope({
  normalLightningMeetings: [e2eLightningMeeting, e2eSecondLightningMeeting],
  schoolLightningMeetings: [] as (typeof e2eLightningMeeting)[],
});

export const lightningSearchAfterReconnect = okEnvelope({
  normalLightningMeetings: [e2eLightningMeeting, e2eReconnectLightningMeeting],
  schoolLightningMeetings: [] as (typeof e2eLightningMeeting)[],
});

export const e2eParticipantProfile = {
  userId: 1,
  username: "e2e-user",
  name: "E2E 참가자",
  clubName: "풍물패",
  groupName: "서울대학교",
  profileImage: null,
};

export const lightningSearchWithSchool = okEnvelope({
  normalLightningMeetings: [e2eLightningMeeting],
  schoolLightningMeetings: [e2eSchoolLightningMeeting],
});

export const lightningStatusParticipating = okEnvelope({
  participant: true,
  isOrganizer: false,
  chatRoomUUID: "e2e-chat-room",
  lightningMeeting: e2eLightningMeeting,
  participantProfiles: [e2eParticipantProfile],
});

export const lightningStatusOrganizing = okEnvelope({
  participant: true,
  isOrganizer: true,
  chatRoomUUID: "e2e-chat-room",
  lightningMeeting: e2eLightningMeeting,
  participantProfiles: [e2eParticipantProfile],
});

export const e2eCreatedLightningMeeting = {
  ...e2eLightningMeeting,
  id: 2001,
  meetingName: "E2E 생성 번개",
};

export const lightningSearchWithCreated = okEnvelope({
  normalLightningMeetings: [e2eCreatedLightningMeeting],
  schoolLightningMeetings: [] as (typeof e2eLightningMeeting)[],
});

export const lightningStatusOrganizingCreated = okEnvelope({
  participant: true,
  isOrganizer: true,
  chatRoomUUID: "e2e-created-chat-room",
  lightningMeeting: e2eCreatedLightningMeeting,
  participantProfiles: [e2eParticipantProfile],
});

export const nearbyLightningWithMeeting = okEnvelope({
  lightningMeetingList: [
    {
      distanceInMeters: 120,
      organizerName: "E2E 주최자",
      lightningMeeting: e2eLightningMeeting,
    },
  ],
});

export const nearbyLightningEmpty = okEnvelope({
  lightningMeetingList: [] as Array<{
    distanceInMeters: number;
    organizerName: string;
    lightningMeeting: typeof e2eLightningMeeting;
  }>,
});

export const myPageWithoutSchool = okEnvelope({
  name: "E2E User",
  phoneNumber: "01000000000",
  email: "e2e@example.com",
  username: "e2e-user",
  groupName: null,
  profile: {
    id: 1,
    originalFilename: "profile.png",
    convertedFileName: "profile.png",
    fullFilePath: "/favicon.ico",
    fileType: "image/png",
    fileSize: 1,
    createdAt: now,
  },
});

export const myPageWithSchool = okEnvelope({
  ...myPageWithoutSchool.response,
  groupName: "서울대학교",
  clubName: "풍물패",
});

export const userLocation = okEnvelope({
  latitude: 37.5665,
  longitude: 126.978,
});

export const lightningCreateSuccess = okEnvelope({
  lightningMeetingId: 2001,
  lightningMeetingName: "E2E 생성 번개",
  organizerName: "E2E User",
});

export function lightningSocketSnapshot(
  meetings: Array<typeof e2eLightningMeeting>
) {
  return {
    domainType: "LIGHTNING_MEETING" as const,
    content: meetings,
  };
}

export const authToken = okEnvelope({
  accessToken: "e2e-access-token",
});

export const chatRoomListEmpty = okEnvelope({
  list: [],
});

const clubInfoListEmpty = [] as Array<{
  clubId: number;
  school: string;
  groupName: string;
}>;

export const clubListEmpty = {
  ...okEnvelope({ clubInfoList: clubInfoListEmpty }),
  response: { clubInfoList: clubInfoListEmpty },
};

export const clubListWithSchool = {
  ...okEnvelope({
    clubInfoList: [
      {
        clubId: 1,
        school: "서울대학교",
        groupName: "서울대학교",
      },
    ],
  }),
  response: {
    clubInfoList: [
      {
        clubId: 1,
        school: "서울대학교",
        groupName: "서울대학교",
      },
    ],
  },
};
