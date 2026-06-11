/**
 * 거리를 문자열로 변환하는 함수
 * @param distanceInMeters 거리(미터)
 * @returns 거리(미터 또는 킬로미터)
 * @example
 * parseDistanceToString(999.78) => "999m"
 * parseDistanceToString(10005) => "10.01km"
 * parseDistanceToString(11003) => "11.00km"
 */
export const parseDistanceToString = (distanceInMeters: number) => {
  if (distanceInMeters < 1000) {
    return Math.floor(distanceInMeters) + "m";
  } else {
    return (
      Math.floor(distanceInMeters / 1000) +
      "." +
      Math.round((distanceInMeters % 1000) / 10)
        .toString()
        .padStart(2, "0") +
      "km"
    );
  }
};
