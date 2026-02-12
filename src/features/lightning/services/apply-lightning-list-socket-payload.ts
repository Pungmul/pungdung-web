import type { QueryClient } from "@tanstack/react-query";

import {
  updateSchoolLightningListCache,
  updateWholeLightningListCache,
} from "./lightning-data-cache";
import {
  deleteUserParticipationStatusCache,
  updateUserParticipationStatusCache,
} from "./participation-status-cache";
import type {
  LightningListSocketScope,
  LightningMeeting,
  UserParticipationData,
} from "../types";

/**
 * STOMP로 수신한 번개 목록을 React Query 캐시에 반영하고, 참여 상태 캐시를 목록과 맞춘다.
 *
 * SSOT: 초기/리페치는 서버 쿼리 캐시, 실시간 목록은 마지막 소켓 payload가 덮어쓴 캐시.
 * 참여 캐시는 서버 조회가 기준이며, 여기서는 “현재 참여 모임 id가 새 목록에 남는지”만 동기화한다.
 */
export function applyLightningListSocketPayload(
  queryClient: QueryClient,
  meetings: LightningMeeting[],
  scope: LightningListSocketScope,
  userParticipation: UserParticipationData | undefined
): void {
  if (scope === "whole") {
    updateWholeLightningListCache(queryClient, meetings);
  } else {
    updateSchoolLightningListCache(queryClient, meetings);
  }

  if (!userParticipation?.participant) return;

  const updatedMeeting = meetings.find(
    (meeting) => userParticipation.lightningMeeting?.id === meeting.id
  );

  if (updatedMeeting) {
    updateUserParticipationStatusCache(queryClient, updatedMeeting);
  } else {
    deleteUserParticipationStatusCache(queryClient);
  }
}
