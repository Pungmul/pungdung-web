import type { LightningParticipantProfileDto } from "../../api/client/dto.schema";
import type { LightningParticipantProfile } from "../../types";

export function mapLightningParticipantProfile(
  dto: LightningParticipantProfileDto
): LightningParticipantProfile {
  const profile: LightningParticipantProfile = {
    userId: dto.userId,
    username: dto.username,
    name: dto.name,
    profileImage: dto.profileImage,
  };
  if (dto.clubName !== undefined) {
    return { ...profile, clubName: dto.clubName };
  }
  return profile;
}
