import type { LightningParticipantProfile } from "../types";

export function getLightningParticipantDisplay({
  participantProfiles,
  currentPersonNum,
  maxVisible,
}: {
  participantProfiles: LightningParticipantProfile[];
  currentPersonNum: number;
  maxVisible: number;
}): {
  visibleProfiles: LightningParticipantProfile[];
  placeholderCount: number;
  overflowCount: number;
} {
  const cap = Math.max(maxVisible, 0);
  const total = Math.max(currentPersonNum, 0);
  const filledSlots = Math.min(total, cap);
  const visibleProfiles = participantProfiles.slice(0, filledSlots);
  const placeholderCount = Math.max(filledSlots - visibleProfiles.length, 0);
  const overflowCount = Math.max(total - cap, 0);

  return { visibleProfiles, placeholderCount, overflowCount };
}
