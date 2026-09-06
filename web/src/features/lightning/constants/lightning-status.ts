// OPEN 모집중, READY 최소 인원 충족
// SUCCESS 모임 성사, END 모임 종료, CANCELLED 성사 실패로 취소
export const LIGHTNING_STATUS = {
  OPEN: "OPEN",
  SUCCESS: "SUCCESS",
  CANCELLED: "CANCELLED",
  READY: "READY",
  END: "END",
} as const;
