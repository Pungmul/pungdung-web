/**
 * 전화번호 포맷팅 헬퍼 함수
 * @param value - 포맷팅할 전화번호 문자열
 * @returns 포맷팅된 전화번호 문자열 (예: 010-1234-5678)
 */
export const formatPhoneNumber = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");

  if (numericValue.length <= 3) return numericValue;
  if (numericValue.length <= 7)
    return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
  if (numericValue.length <= 10)
    return `${numericValue.slice(0, 3)}-${numericValue.slice(
      3,
      6
    )}-${numericValue.slice(6)}`;
  if (numericValue.length <= 11)
    return `${numericValue.slice(0, 3)}-${numericValue.slice(
      3,
      7
    )}-${numericValue.slice(7)}`;
  return formatPhoneNumber(numericValue.slice(0, 11));
};
