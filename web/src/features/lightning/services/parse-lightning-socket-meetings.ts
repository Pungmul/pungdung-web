import { z } from "zod";

import { lightningMeetingSchema } from "../api/client/dto.schema";
import { mapLightningMeeting } from "../lib/mappers/map-lightning-meeting";
import type { LightningMeeting } from "../types";

const lightningMeetingListMessageSchema = z.object({
  domainType: z.literal("LIGHTNING_MEETING"),
  content: z.array(lightningMeetingSchema),
});

/** STOMP 목록 payload → HTTP와 동일한 Zod·mapper 경계 */
export function parseLightningSocketMeetings(
  raw: unknown
): LightningMeeting[] | null {
  const parsed = lightningMeetingListMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return null;
  }
  return parsed.data.content.map(mapLightningMeeting);
}
