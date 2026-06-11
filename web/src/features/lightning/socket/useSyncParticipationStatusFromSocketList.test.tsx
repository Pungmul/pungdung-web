import type { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSyncParticipationStatusFromSocketList } from "./useSyncParticipationStatusFromSocketList";

import { lightningQueries } from "../queries";

import type { LightningMeeting, UserParticipationData } from "../types";

const meeting = (
  overrides: Partial<LightningMeeting> & Pick<LightningMeeting, "id">
): LightningMeeting => {
  const { id, ...restOverrides } = overrides;

  return {
    id,
    meetingName: "test",
    recruitmentEndTime: "2026-04-28T10:00:00Z",
    startTime: "2026-04-28T11:00:00Z",
    endTime: "2026-04-28T12:00:00Z",
    minPersonNum: 2,
    maxPersonNum: 10,
    organizerId: 1,
    meetingType: "FREE",
    latitude: 0,
    longitude: 0,
    buildingName: "building",
    locationDetail: "detail",
    tags: [],
    currentPersonNum: 2,
    participantProfiles: [],
    lightningMeetingParticipantList: [],
    instrumentAssignmentList: [],
    status: "OPEN",
    notificationSent: false,
    visibilityScope: "ALL",
    createdAt: "2026-04-28T09:00:00Z",
    updatedAt: "2026-04-28T09:00:00Z",
    ...restOverrides,
  };
};

const participationStatus = (
  overrides: Partial<UserParticipationData> = {}
): UserParticipationData => ({
  participant: true,
  isOrganizer: false,
  chatRoomUUID: "chat-room",
  lightningMeeting: meeting({ id: 1 }),
  participantProfiles: [
    {
      userId: 10,
      username: "user10",
      name: "User 10",
      clubName: "club",
      profileImage: null,
    },
  ],
  ...overrides,
});

describe("useSyncParticipationStatusFromSocketList", () => {
  it("참여 중이고 스코프가 맞으면 소켓 이벤트마다 participationStatus를 invalidate한다", () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    queryClient.setQueryData(
      lightningQueries.participationStatus().queryKey,
      participationStatus()
    );

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useSyncParticipationStatusFromSocketList(),
      { wrapper }
    );

    act(() => {
      result.current("whole");
    });

    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: lightningQueries.participationStatus().queryKey,
      refetchType: "all",
    });
  });

  it("참여 중이 아니면 participationStatus를 건드리지 않는다", () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    queryClient.setQueryData(
      lightningQueries.participationStatus().queryKey,
      participationStatus({ participant: false, lightningMeeting: null })
    );

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useSyncParticipationStatusFromSocketList(),
      { wrapper }
    );

    act(() => {
      result.current("whole");
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  it("참여 모임 스코프가 다르면 participationStatus를 건드리지 않는다", () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    queryClient.setQueryData(
      lightningQueries.participationStatus().queryKey,
      participationStatus({
        lightningMeeting: meeting({ id: 1, visibilityScope: "SCHOOL_ONLY" }),
      })
    );

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useSyncParticipationStatusFromSocketList(),
      { wrapper }
    );

    act(() => {
      result.current("whole");
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
