import type { QueryClient } from "@tanstack/react-query";

import { lightningQueries } from "../queries";

import type { LightningMeeting, UserParticipationData } from "../types";

const emptyUserParticipationData = (): UserParticipationData => ({
  isOrganizer: false,
  participant: false,
  lightningMeeting: null,
  chatRoomUUID: null,
});

export const deleteUserParticipationStatusCache = (
  queryClient: QueryClient
): void => {
  queryClient.setQueryData(
    lightningQueries.participationStatus().queryKey,
    (): UserParticipationData => emptyUserParticipationData()
  );
};

export const updateUserParticipationStatusCache = (
  queryClient: QueryClient,
  meeting: LightningMeeting
): void => {
  queryClient.setQueryData(
    lightningQueries.participationStatus().queryKey,
    (prev: UserParticipationData | undefined): UserParticipationData => ({
      ...emptyUserParticipationData(),
      ...prev,
      lightningMeeting: meeting,
    })
  );
};
