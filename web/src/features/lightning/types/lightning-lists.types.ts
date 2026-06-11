import type { LightningMeeting } from "./meeting.types";

/**
 * 앱이 들고 다니는 “번개 목록 묶음”(검색·쿼리 캐시·소켓 반영)
 * DTO `FetchLightningDataResponse`를 매퍼로 변환한 뒤의 도메인 모델
 */
export type LightningListData = {
  normalLightningMeetings: LightningMeeting[];
  schoolLightningMeetings: LightningMeeting[];
};

/** 전체/학교 구간 STOMP로 목록 캐시를 갱신할 때 쓰는 범위 */
export type LightningListSocketScope = "whole" | "school";

/** `deriveDisplayLightningLists`로 `LightningData`에서 화면에 맞게 파생 */
export interface DisplayLightningLists {
  wholeLightningList: LightningMeeting[];
  schoolLightningList: LightningMeeting[];
}

export type NearLightningType = {
  distanceInMeters: number;
  lightningMeeting: LightningMeeting;
  organizerName: string;
};
