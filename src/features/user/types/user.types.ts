import type { ProfileImage } from "./profile-image.types";

export interface User {
  userId: number;
  username: string;
  name: string;
  profileImage: ProfileImage;
}
