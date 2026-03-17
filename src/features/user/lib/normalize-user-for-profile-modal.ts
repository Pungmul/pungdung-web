import type { ProfileImage } from "../types/profile-image.types";
import type { User } from "../types/user.types";

/**
 * 백엔드가 `profile`·`clubName`만 주고 `profileImage`·`name`이 비는 경우가 있어
 * 모달·친구 API에 넘기기 전에 `User` 형태로 맞춘다.
 */
export function normalizeUserForProfileModal(user: User): User {
  const u = user as User & { profile?: ProfileImage | null; clubName?: string };
  const profileImage = u.profileImage ?? u.profile;

  let name: string;
  if (typeof u.name === "string" && u.name.trim().length > 0) {
    name = u.name.trim();
  } else if (typeof u.clubName === "string" && u.clubName.trim().length > 0) {
    name = u.clubName.trim();
  } else {
    name = u.username;
  }

  return {
    userId: u.userId,
    username: u.username,
    name,
    clubName: u.clubName,
    groupName: u.groupName,
    profileImage: profileImage ?? u.profileImage,
  } as User;
}
