import { normalizeUserForProfileModal, type User } from "@/features/user";

import type { LightningParticipantProfile } from "../../types";

export function mapLightningParticipantProfileToUser(
  profile: LightningParticipantProfile
): User {
  return normalizeUserForProfileModal({
    userId: profile.userId,
    username: profile.username,
    name: profile.name,
    clubName: profile.clubName,
    groupName: profile.groupName,
    profileImage: profile.profileImage,
  } as User);
}
