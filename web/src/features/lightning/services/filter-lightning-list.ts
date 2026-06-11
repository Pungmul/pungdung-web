import type { LightningMeeting } from "../types";

/**
 * 타겟에 따라 번개 리스트 필터링
 * @param target - 필터 대상 ("전체" | "우리학교")
 * @param wholeLightningList - 전체 번개 목록
 * @param schoolLightningList - 학교 번개 목록
 * @returns 필터링된 번개 목록
 */
export const filterLightningList = (
  target: "전체" | "우리학교",
  wholeLightningList: LightningMeeting[],
  schoolLightningList: LightningMeeting[]
): LightningMeeting[] => {
  return target === "우리학교" ? schoolLightningList : wholeLightningList;
};
