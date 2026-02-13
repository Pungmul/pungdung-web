import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import {
  LIGHTNING_MEETING_TYPE,
  LIGHTNING_STATUS,
  VISIBILITY_SCOPE,
} from "../constants";
import { lightningQueries } from "../queries";
import type { LightningListData, LightningMeeting } from "../types";

import {
  updateSchoolLightningListCache,
  updateWholeLightningListCache,
} from "./lightning-data-cache";

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

describe("updateWholeLightningListCache", () => {
  it("prev가 있으면 normalLightningMeetings만 갱신하고 school은 유지한다", () => {
    const queryClient = new QueryClient();
    const prev: LightningListData = {
      normalLightningMeetings: [makeLightningMeeting(1)],
      schoolLightningMeetings: [makeLightningMeeting(2)],
    };
    queryClient.setQueryData(lightningQueries.lightningData().queryKey, prev);

    updateWholeLightningListCache(queryClient, [makeLightningMeeting(10)]);

    const next = queryClient.getQueryData<LightningListData>(
      lightningQueries.lightningData().queryKey
    );
    expect(next?.normalLightningMeetings).toEqual([makeLightningMeeting(10)]);
    expect(next?.schoolLightningMeetings).toEqual([makeLightningMeeting(2)]);
  });

  it("prev가 없으면 normal만 채우고 school은 빈 배열이다", () => {
    const queryClient = new QueryClient();

    updateWholeLightningListCache(queryClient, [makeLightningMeeting(5)]);

    const next = queryClient.getQueryData<LightningListData>(
      lightningQueries.lightningData().queryKey
    );
    expect(next).toEqual({
      normalLightningMeetings: [makeLightningMeeting(5)],
      schoolLightningMeetings: [],
    });
  });
});

describe("updateSchoolLightningListCache", () => {
  it("prev가 있으면 schoolLightningMeetings만 갱신하고 normal은 유지한다", () => {
    const queryClient = new QueryClient();
    const prev: LightningListData = {
      normalLightningMeetings: [makeLightningMeeting(1)],
      schoolLightningMeetings: [makeLightningMeeting(2)],
    };
    queryClient.setQueryData(lightningQueries.lightningData().queryKey, prev);

    updateSchoolLightningListCache(queryClient, [makeLightningMeeting(20)]);

    const next = queryClient.getQueryData<LightningListData>(
      lightningQueries.lightningData().queryKey
    );
    expect(next?.normalLightningMeetings).toEqual([makeLightningMeeting(1)]);
    expect(next?.schoolLightningMeetings).toEqual([makeLightningMeeting(20)]);
  });

  it("prev가 없으면 school만 채우고 normal은 빈 배열이다", () => {
    const queryClient = new QueryClient();

    updateSchoolLightningListCache(queryClient, [makeLightningMeeting(7)]);

    const next = queryClient.getQueryData<LightningListData>(
      lightningQueries.lightningData().queryKey
    );
    expect(next).toEqual({
      normalLightningMeetings: [],
      schoolLightningMeetings: [makeLightningMeeting(7)],
    });
  });
});
