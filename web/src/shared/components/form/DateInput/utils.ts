// 날짜 입력 관련 유틸 함수들

export interface FieldConfig {
  length: number;
  max: number;
  min: number;
}

export const FIELD_CONFIGS: Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', FieldConfig> = {
  year: { length: 4, max: 9999, min: 1000 },
  month: { length: 2, max: 12, min: 10 },
  day: { length: 2, max: 31, min: 10 },
  hour: { length: 2, max: 23, min: 0 },
  minute: { length: 2, max: 59, min: 10 },
  second: { length: 2, max: 59, min: 10 },
};

export interface ParsedDate {
  year: string;
  month: string;
  day: string;
}

/**
 * 날짜 문자열을 파싱하여 각 필드별 값으로 분리
 */
export function parseDateString(dateString: string): ParsedDate {
  if (!dateString) return { year: "YYYY", month: "MM", day: "DD" };
  
  const parts = dateString.split("-");
  if (parts.length !== 3) return { year: "YYYY", month: "MM", day: "DD" };
  
  const [year, month, day] = parts;
  return {
    year: year || "YYYY",
    month: month || "MM",
    day: day || "DD",
  };
}

/**
 * 필드가 꽉 찬 상태인지 확인
 */
export function isFieldFull(
  type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second',
  prev: string,
  prevNum: number
): boolean {
  const config = FIELD_CONFIGS[type];
  
  if (type === "year") {
    return prev.length === 4 && prevNum >= config.min;
  }
  
  return prevNum >= config.min && !prev.startsWith("0");
}

/**
 * 필드 값에 범위 제한 적용
 */
export function clampFieldValue(
  type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second',
  value: string
): string {
  const config = FIELD_CONFIGS[type];
  const num = parseInt(value, 10);
  
  if (num === 0) {
    return "0".repeat(config.length);
  }
  
  if (num > config.max) {
    return (num % 10).toString().padStart(config.length, "0");
  }
  
  return value;
}

/**
 * 필드 포커스 이동 조건 확인
 */
export function shouldMoveToNextField(
  type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second',
  value: string
): boolean {
  const num = Number(value);
  
  if (type === "year") {
    return value.length === 4 && num > 999;
  }
  
  if (type === "month" || type === "day" || type === "hour" || type === "minute" || type === "second") {
    return value.length === 2 && num > 9;
  }
  
  return false;
}
