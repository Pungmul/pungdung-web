import type { ClubName } from "@/features/club";

export interface ProfileImage {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface Member {
  loginId: string;
  name: string;
  groupName?: ClubName;
  clubName?: string;
  birth: string;
  clubAge: number;
  phoneNumber: string;
  email: string;
  area?: string;
  username: string;
  profile: ProfileImage;
}

export interface User {
  userId: number;
  username: string;
  name: string;
  profileImage: ProfileImage;
}
