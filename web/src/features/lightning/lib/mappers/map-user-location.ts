import type { FetchUserLocationResponse } from "../../api/client/dto.schema";
import type { GeoCoordinates } from "../../types";

/**
 * `looseObject` DTO → 좌표만 남긴 도메인 모델.
 */
export function mapUserLocation(dto: FetchUserLocationResponse): GeoCoordinates {
  return {
    latitude: dto.latitude,
    longitude: dto.longitude,
  };
}
