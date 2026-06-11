import type { ProfileImage } from "./profile-image.types";

export interface User {
  userId: number;
  username: string;
  name: string;
  /** 업스트림 simpleUserDTO.clubName — 없을 수 있음 */
  clubName?: string | null;
  /** 업스트림 simpleUserDTO.groupName — 없을 수 있음 */
  groupName?: string | null;
  profileImage: ProfileImage;
}
