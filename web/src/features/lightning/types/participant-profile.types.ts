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
  /** 이메일 */
  username: string;
  name: string;
  /** 패명 */
  clubName?: string | null;
  /** 동아리 */
  groupName?: string | null;
  profileImage: LightningProfileImage | null;
}
