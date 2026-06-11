export type Club =
  | "어흥"
  | "떼"
  | "하날다래"
  | "악반"
  | "푸른소래"
  | "산틀"
  | "없음";

export interface ClubInfo {
  clubId: number;
  school: string;
  groupName: string;
  description?: string;
  memberCount?: number;
}
