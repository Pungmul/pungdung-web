import { LightningMeetingMessage } from "../types";

export const isLightningMeetingMessage = (
  message: unknown
): message is LightningMeetingMessage => {
  if (typeof message !== "object" || message === null) {
    return false;
  }
  return (
    (message as Record<string, unknown>)?.domainType === "LIGHTNING_MEETING"
  );
};
