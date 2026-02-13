import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import {
  LIGHTNING_MEETING_TYPE,
  LIGHTNING_STATUS,
  VISIBILITY_SCOPE,
} from "../constants";
import { lightningQueries } from "../queries";
import type { LightningMeeting, UserParticipationData } from "../types";

import {
  deleteUserParticipationStatusCache,
  updateUserParticipationStatusCache,
} from "./participation-status-cache";

function makeLightningMeeting(id: number): LightningMeeting {
  return {
    id,
    meetingName: "테스트 모임",
    recruitmentEndTime: "2026-04-28T12:00:00Z",
    startTime: "2026-04-28T13:00:00Z",
    endTime: "2026-04-28T15:00:00Z",
    minPersonNum: 2,
    maxPersonNum: 10,
    organizerId: 0,
    meetingType: LIGHTNING_MEETING_TYPE.FREE,
    latitude: 0,
    longitude: 0,
    buildingName: "",
    locationDetail: "",
    tags: [],
    lightningMeetingParticipantList: [],
    instrumentAssignmentList: [],
    status: LIGHTNING_STATUS.OPEN,
    notificationSent: false,
    visibilityScope: VISIBILITY_SCOPE.ALL,
    createdAt: "2026-04-28T10:00:00Z",
    updatedAt: "2026-04-28T10:00:00Z",
  };
}

const emptyState: UserParticipationData = {
  isOrganizer: false,
  participant: false,
  lightningMeeting: null,
  chatRoomUUID: null,
};

describe("deleteUserParticipationStatusCache", () => {
  it("참여 상태 캐시를 초기 빈 값으로 덮어쓴다", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData<UserParticipationData>(
      lightningQueries.participationStatus().queryKey,
      {
        participant: true,
        isOrganizer: true,
        chatRoomUUID: "room",
        lightningMeeting: makeLightningMeeting(1),
      }
    );

    deleteUserParticipationStatusCache(queryClient);

    expect(
      queryClient.getQueryData<UserParticipationData>(
        lightningQueries.participationStatus().queryKey
      )
    ).toEqual(emptyState);
  });
});

describe("updateUserParticipationStatusCache", () => {
  it("prev가 없으면 기본 필드에 lightningMeeting만 채운다", () => {
    const queryClient = new QueryClient();
    const meeting = makeLightningMeeting(99);

    updateUserParticipationStatusCache(queryClient, meeting);

    expect(
      queryClient.getQueryData<UserParticipationData>(
        lightningQueries.participationStatus().queryKey
      )
    ).toEqual({
      ...emptyState,
      lightningMeeting: meeting,
    });
  });

  it("prev가 있으면 participant 등은 유지하고 lightningMeeting만 교체한다", () => {
    const queryClient = new QueryClient();
    const prev: UserParticipationData = {
      participant: true,
      isOrganizer: null,
      chatRoomUUID: "abc",
      lightningMeeting: makeLightningMeeting(1),
    };
    queryClient.setQueryData(
      lightningQueries.participationStatus().queryKey,
      prev
    );

    const nextMeeting = makeLightningMeeting(2);
    updateUserParticipationStatusCache(queryClient, nextMeeting);

    expect(
      queryClient.getQueryData<UserParticipationData>(
        lightningQueries.participationStatus().queryKey
      )
    ).toEqual({
      participant: true,
      isOrganizer: null,
      chatRoomUUID: "abc",
      lightningMeeting: nextMeeting,
    });
  });
});
