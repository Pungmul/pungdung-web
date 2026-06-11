import dayjs from "dayjs";

import type { CreateLightningRequest } from "../api/client/dto.schema";
import type { LightningCreateFormData } from "../types/schemas";
/**
 * LightningCreateFormData를 API 요청 형식으로 변환
 * @param formData - 번개 생성 폼 데이터
 * @returns API 요청 형식의 번개 생성 데이터
 * @throws {Error} 위치 정보가 없는 경우
 */
export const buildLightningRequest = (
  formData: LightningCreateFormData
): CreateLightningRequest => {
  const { locationPoint } = formData;

  if (!locationPoint) {
    throw new Error("위치 정보가 필요합니다");
  }

  const today = dayjs().format("YYYY-MM-DD");

  const baseRequest = {
    meetingName: formData.title,
    startTime: dayjs(today + "T" + formData.recruitEndTime)
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss"),
    endTime: dayjs(today + "T" + formData.recruitEndTime)
      .add(30, "minute")
      .format("YYYY-MM-DDTHH:mm:ss"),
    recruitmentEndTime: dayjs(today + "T" + formData.recruitEndTime).format(
      "YYYY-MM-DDTHH:mm:ss"
    ),
    minPersonNum: formData.minPersonnel,
    maxPersonNum: formData.maxPersonnel,
    latitude: Number(locationPoint.latitude),
    longitude: Number(locationPoint.longitude),
    buildingName: formData.address || "",
    locationDetail: formData.detailAddress || "",
    visibilityScope: formData.target === "전체" ? "ALL" : "SCHOOL_ONLY",
    tags: formData.tagList,
  } as const;

  if (formData.lightningType === "일반 모임") {
    return {
      ...baseRequest,
      meetingType: "FREE",
    };
  } else {
    return {
      ...baseRequest,
      meetingType: "PAN",
    };
  }
};
