import type { QueryClient } from "@tanstack/react-query";

import { lightningQueries } from "../queries";

import type { LightningListData, LightningMeeting } from "../types";

export const updateWholeLightningListCache = (
  queryClient: QueryClient,
  newMeetings: LightningMeeting[]
): void => {
  queryClient.setQueryData<LightningListData>(
    lightningQueries.lightningData().queryKey,
    (prev) => {
      if (prev) {
        return {
          ...prev,
          normalLightningMeetings: newMeetings,
        };
      }
      return {
        normalLightningMeetings: newMeetings,
        schoolLightningMeetings: [],
      };
    }
  );
};

export const updateSchoolLightningListCache = (
  queryClient: QueryClient,
  newMeetings: LightningMeeting[]
): void => {
  queryClient.setQueryData<LightningListData>(
    lightningQueries.lightningData().queryKey,
    (prev) => {
      if (prev) {
        return {
          ...prev,
          schoolLightningMeetings: newMeetings,
        };
      }
      return {
        normalLightningMeetings: [],
        schoolLightningMeetings: newMeetings,
      };
    }
  );
};
