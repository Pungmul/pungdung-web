import type { LightningParticipantProfile } from "../types";

/** 참여자 카드 2번째 줄: 동아리 있으면 `패명 · 동아리`, 없으면 이메일 */
export function formatLightningParticipantSubtitle(
  profile: LightningParticipantProfile
): string {
  const groupName = profile.groupName?.trim();
  if (groupName) {
    const nickname = profile.clubName?.trim();
    return nickname ? `${nickname} · ${groupName}` : groupName;
  }

  return profile.username;
}
