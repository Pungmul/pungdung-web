import { mutationOptions } from "@tanstack/react-query";

import { lightningQueryInternal } from "./lightning-query-internal";
import {
  deleteLightningMeeting,
  exitLightningMeeting,
  joinLightningMeeting,
  updateUserLocation,
} from "../api/client";

const root = lightningQueryInternal.all();

/** useMutation에 넘길 옵션. useMutation(lightningMutationOptions.joinMeeting()) */
export const lightningMutationOptions = {
  joinMeeting: () =>
    mutationOptions({
      mutationKey: [...root, "joinMeeting"],
      mutationFn: (variables: { meetingId: number }) =>
        joinLightningMeeting(variables),
    }),

  exitMeeting: () =>
    mutationOptions({
      mutationKey: [...root, "exitMeeting"],
      mutationFn: (variables: Parameters<typeof exitLightningMeeting>[0]) =>
        exitLightningMeeting(variables),
    }),

  deleteMeeting: () =>
    mutationOptions({
      mutationKey: [...root, "deleteMeeting"],
      mutationFn: (variables: Parameters<typeof deleteLightningMeeting>[0]) =>
        deleteLightningMeeting(variables),
    }),

  updateUserLocation: () =>
    mutationOptions({
      mutationKey: [...root, "updateUserLocation"],
      mutationFn: (variables: Parameters<typeof updateUserLocation>[0]) =>
        updateUserLocation(variables),
    }),
};
