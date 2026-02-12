import type { DisplayLightningLists, LightningListData } from "../types";

/**
 * 서버 응답에서 화면에서 쓰는 두 리스트를 파생시킨다.
 *
 * - wholeLightningList: 일반 + 학교 번개 합산, 최신순 정렬
 * - schoolLightningList: 학교 번개만
 */
export function deriveDisplayLightningLists(
  data: LightningListData | undefined
): DisplayLightningLists {
  const wholeLightningList = [
    ...(data?.normalLightningMeetings ?? []),
    ...(data?.schoolLightningMeetings ?? []),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    wholeLightningList,
    schoolLightningList: data?.schoolLightningMeetings ?? [],
  };
}
