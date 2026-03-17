import type { ProfileImage } from "./profile-image.types";

export interface Member {
  loginId?: string;
  name: string;
  groupName?: string;
  clubName?: string;
  birth?: string;
  clubAge?: number;
  phoneNumber: string;
  email: string;
  area?: string;
  username: string;
  profile: ProfileImage;
}
