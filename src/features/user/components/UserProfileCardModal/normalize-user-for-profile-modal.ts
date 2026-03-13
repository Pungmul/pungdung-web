import type { ProfileImage, User } from "@/features/user";

/**
 * 백엔드가 `profile`·`clubName`만 주고 `profileImage`·`name`이 비는 경우가 있어
 * 모달·친구 API에 넘기기 전에 `User` 형태로 맞춘다.
 */
export function normalizeUserForProfileModal(user: User): User {
  const u = user as User & { profile?: ProfileImage | null; clubName?: string };
  const profileImage = u.profileImage ?? u.profile;
  const name =
    (typeof u.name === "string" && u.name.trim().length > 0
      ? u.name.trim()
      : typeof u.clubName === "string" && u.clubName.trim().length > 0
        ? u.clubName.trim()
        : u.username) || u.username;

  return {
    userId: u.userId,
    username: u.username,
    name,
    profileImage: profileImage ?? u.profileImage,
  } as User;
}
