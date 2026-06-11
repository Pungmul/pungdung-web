import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Seoul");

export const dayConfig = {
  format: "YYYY년 M월 D일 (ddd)",
  formatWithTime: "YYYY년 M월 D일 dddd H시 m분",
};

export const getDateString= (date: string) => {
  return dayjs(date).format(dayConfig.format);
};

export const getDateStringWithTime = (date: string) => {
  return dayjs(date).format(dayConfig.formatWithTime);
};

/**
 * 현재 시간에서 1분 후의 시간 문자열 반환
 * @returns HH:mm 형식의 시간 문자열
 */
export const getNowTimeString = (): string => {
  return dayjs().add(1, "minute").format("HH:mm");
};

/**
 * 시간 문자열에 분을 더함
 * @param timeStr - HH:mm 또는 HH:mm:ss 형식의 시간 문자열
 * @param minutes - 더할 분
 * @returns HH:mm:ss 형식의 시간 문자열
 */
export const addMinutesToTime = (timeStr: string, minutes: number): string => {
  const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
  return dayjs(time).add(minutes, "minute").format("HH:mm:ss");
};

/**
 * 시간 문자열에서 분을 뺌
 * @param timeStr - HH:mm 또는 HH:mm:ss 형식의 시간 문자열
 * @param minutes - 뺄 분
 * @returns HH:mm:ss 형식의 시간 문자열
 */
export const subMinutesFromTime = (timeStr: string, minutes: number): string => {
  const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
  return dayjs(time).subtract(minutes, "minute").format("HH:mm:ss");
}; 