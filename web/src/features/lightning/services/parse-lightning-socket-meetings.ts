import { z } from "zod";

import { ClientMapperError } from "@/core/api/client/client-mapper-error";
import {
  createSocketContractError,
  reportAppError,
} from "@/core/config/report-app-error";

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

/** STOMP 목록 payload를 HTTP와 같은 Zod/mapper 경계로 변환. 실패 시 reportAppError */
export function parseLightningSocketSnapshotEntries(
  raw: unknown
): LightningListSocketSnapshotEntry[] | null {
  const parsed = lightningMeetingListMessageSchema.safeParse(raw);
  if (!parsed.success) {
    reportAppError(createSocketContractError(parsed.error.issues), {
      boundary: "api",
      feature: "lightning",
      endpoint: "LIGHTNING_MEETING",
    });
    return null;
  }

  try {
    return parsed.data.content.map((dto) => ({
      meeting: mapLightningMeeting(dto),
      hasParticipantPayload: hasLightningSocketParticipantPayload(dto),
    }));
  } catch (error) {
    const mapperError =
      error instanceof ClientMapperError
        ? error
        : new ClientMapperError({
            message: "소켓 응답을 앱 모델로 변환하는 데 실패했습니다.",
            context: "lightning-socket-snapshot",
            cause: error,
          });
    reportAppError(mapperError, {
      boundary: "api",
      feature: "lightning",
      endpoint: "LIGHTNING_MEETING",
    });
    throw mapperError;
  }
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
