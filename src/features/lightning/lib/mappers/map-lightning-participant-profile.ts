import type { LightningParticipantProfileDto } from "../../api/client/dto.schema";
import type { LightningParticipantProfile } from "../../types";

export function mapLightningParticipantProfile(
  dto: LightningParticipantProfileDto
): LightningParticipantProfile {
  return {
    userId: dto.userId,
    username: dto.username,
    name: dto.name,
    profileImage: dto.profileImage,
    ...(dto.clubName !== undefined ? { clubName: dto.clubName } : {}),
    ...(dto.groupName !== undefined ? { groupName: dto.groupName } : {}),
  };
}
