import type { User } from "@/features/user";

import type { ChatRoomUserDto } from "../../../api/client/dto.schema";

export function mapChatRoomUserDtoToDomain(dto: ChatRoomUserDto): User {
  const user: User = {
    userId: dto.userId,
    username: dto.username,
    name: dto.name,
    profileImage: dto.profileImage,
  };
  if (dto.clubName !== undefined) {
    user.clubName = dto.clubName;
  }
  if (dto.groupName !== undefined) {
    user.groupName = dto.groupName;
  }
  return user;
}
