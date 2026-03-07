import type { ProfileImage } from "./profile-image.types";

/** `GET /api/users/info` 등에서 내려오는 프로필 카드용 필드 (본명은 호스트의 `User.name`) */
export type UserProfileCardDetail = {
  /** 마이페이지 편집의 `nickname`과 동일 소스(`clubName`) */
  clubName?: string;
  /** `clubInfo.school` 등 */
  school?: string;
  groupName?: string;
  clubAge?: number;
  email?: string;
  profileImage: ProfileImage | null;
};
