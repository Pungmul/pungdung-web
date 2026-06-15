import { z } from "zod";

import { hasLightningSocketParticipantPayload } from "./has-lightning-socket-participant-payload";
import { lightningMeetingSchema } from "../api/client/dto.schema";
import { mapLightningMeeting } from "../lib/mappers/map-lightning-meeting";
import type {
  LightningListSocketSnapshotEntry,
  LightningMeeting,
} from "../types";

const lightningMeetingListMessageSchema = z.object({
  domainType: z.literal("LIGHTNING_MEETING"),
  content: z.array(lightningMeetingSchema),
});

/** STOMP 목록 payload → HTTP와 동일한 Zod·mapper 경계 */
export function parseLightningSocketSnapshotEntries(
  raw: unknown
): LightningListSocketSnapshotEntry[] | null {
  const parsed = lightningMeetingListMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return null;
  }

  return parsed.data.content.map((dto) => ({
    meeting: mapLightningMeeting(dto),
    hasParticipantPayload: hasLightningSocketParticipantPayload(dto),
  }));
}

export function parseLightningSocketMeetings(
  raw: unknown
): LightningMeeting[] | null {
  const entries = parseLightningSocketSnapshotEntries(raw);
  if (!entries) {
    return null;
  }

  return entries.map((entry) => entry.meeting);
}
