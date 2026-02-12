import { z } from "zod";

import {
  LIGHTNING_MEETING_TYPE,
  LIGHTNING_STATUS,
  VISIBILITY_SCOPE,
} from "../../constants";

export const lightningMeetingSchema = z.object({
  id: z.number(),
  meetingName: z.string(),
  recruitmentEndTime: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  minPersonNum: z.number(),
  maxPersonNum: z.number(),
  organizerId: z.number(),
  meetingType: z.enum(Object.values(LIGHTNING_MEETING_TYPE)),
  latitude: z.number(),
  longitude: z.number(),
  buildingName: z.string(),
  locationDetail: z.string(),
  tags: z.array(z.string()).nullable(),
  lightningMeetingParticipantList: z.array(z.unknown()),
  instrumentAssignmentList: z.array(z.unknown()),
  status: z.enum(Object.values(LIGHTNING_STATUS)),
  notificationSent: z.boolean(),
  visibilityScope: z.enum(Object.values(VISIBILITY_SCOPE)),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type LightningMeetingDto = z.infer<typeof lightningMeetingSchema>;

export const fetchLightningDataResponseSchema = z.object({
  normalLightningMeetings: z.array(lightningMeetingSchema),
  schoolLightningMeetings: z.array(lightningMeetingSchema),
});

export type FetchLightningDataResponse = z.infer<
  typeof fetchLightningDataResponseSchema
>;

export const fetchUserParticipationStatusResponseSchema = z.object({
  participant: z.boolean(),
  isOrganizer: z.boolean().nullable(),
  chatRoomUUID: z.string().nullable(),
  lightningMeeting: lightningMeetingSchema.nullable(),
});
export type fetchUserParticipationStatusResponse = z.infer<
  typeof fetchUserParticipationStatusResponseSchema
>;

export const nearLightningItemSchema = z.object({
  distanceInMeters: z.number(),
  lightningMeeting: lightningMeetingSchema,
  organizerName: z.string(),
});
export type NearLightningItemDto = z.infer<typeof nearLightningItemSchema>;

export const fetchNearLightningResponseSchema = z.object({
  lightningMeetingList: z.array(nearLightningItemSchema).default([]),
});
export type FetchNearLightningResponse = z.infer<
  typeof fetchNearLightningResponseSchema
>;

export const createLightningRequestSchema = z.discriminatedUnion(
  "meetingType",
  [
    z.object({
      meetingName: z.string(),
      recruitmentEndTime: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      minPersonNum: z.number(),
      maxPersonNum: z.number(),
      meetingType: z.literal("FREE"),
      latitude: z.number(),
      longitude: z.number(),
      buildingName: z.string(),
      locationDetail: z.string(),
      visibilityScope: z.enum(["ALL", "SCHOOL_ONLY"]),
      tags: z.array(z.string()),
    }),
    z.object({
      meetingName: z.string(),
      recruitmentEndTime: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      minPersonNum: z.number(),
      maxPersonNum: z.number(),
      meetingType: z.literal("PAN"),
      latitude: z.number(),
      longitude: z.number(),
      buildingName: z.string(),
      locationDetail: z.string(),
      visibilityScope: z.enum(["ALL", "SCHOOL_ONLY"]),
      tags: z.array(z.string()),
    }),
  ]
);
export type CreateLightningRequest = z.infer<
  typeof createLightningRequestSchema
>;

export const createLightningResponseSchema = z.object({
  lightningMeetingId: z.number(),
  lightningMeetingName: z.string(),
  organizerName: z.string(),
});
export type CreateLightningResponse = z.infer<
  typeof createLightningResponseSchema
>;

export const joinLightningMeetingRequestSchema = z.object({
  meetingId: z.number(),
});
export type JoinLightningMeetingRequest = z.infer<
  typeof joinLightningMeetingRequestSchema
>;

export const exitLightningMeetingRequestSchema = z.object({
  lightningMeetingId: z.number(),
});
export type ExitLightningMeetingRequest = z.infer<
  typeof exitLightningMeetingRequestSchema
>;

export const deleteLightningMeetingRequestSchema = z.object({
  lightningMeetingId: z.number(),
});
export type DeleteLightningMeetingRequest = z.infer<
  typeof deleteLightningMeetingRequestSchema
>;

export const cancelLightningMeetingBodySchema = z.object({
  meetingId: z.number(),
});

export const fetchUserLocationResponseSchema = z.looseObject({
  latitude: z.number(),
  longitude: z.number(),
});

export type FetchUserLocationResponse = z.infer<
  typeof fetchUserLocationResponseSchema
>;

export const updateUserLocationRequestSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type UpdateUserLocationRequest = z.infer<
  typeof updateUserLocationRequestSchema
>;

export const cancelLightningMeetingResponseSchema = z.object({
  message: z.string(),
});
export type CancelLightningMeetingResponse = z.infer<
  typeof cancelLightningMeetingResponseSchema
>;

export const voidResponseSchema = z.unknown().transform(() => undefined);
