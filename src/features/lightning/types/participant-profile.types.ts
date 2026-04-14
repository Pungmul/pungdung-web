export interface LightningProfileImage {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

/** 번개 모임 참여자 프로필 (업스트림 SimpleProfileDto) */
export interface LightningParticipantProfile {
  userId: number;
  username: string;
  name: string;
  clubName?: string | null;
  profileImage: LightningProfileImage | null;
}
