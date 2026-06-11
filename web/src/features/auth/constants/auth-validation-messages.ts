/**
 * Zod·클라이언트 폼 검증 메시지 — 스키마에서 공통으로 참조한다.
 */
export const AUTH_VALIDATION = {
  EMAIL: {
    INVALID_FORMAT: "이메일 형식이 올바르지 않습니다.",
    REQUIRED: "이메일을 입력해주세요.",
    ALREADY_REGISTERED: "이미 사용 중인 이메일입니다.",
  },
  EMAIL_CHECK: {
    NOT_REGISTERED: "가입되지 않은 이메일입니다.",
  },
  PASSWORD: {
    LENGTH_8_TO_12: "비밀번호는 8~12자로 이루어져야합니다.",
    ALLOWED_SPECIAL_CHARS: "특수 문자는 (!, @, #, $, %, ^, &, *)만 가능합니다.",
    MISMATCH: "비밀번호가 일치하지 않습니다.",
  },
  CHANGE_PASSWORD: {
    CURRENT_REQUIRED: "현재 비밀번호를 입력해주세요.",
    NEW_REQUIRED: "새로운 비밀번호를 입력해주세요.",
    CONFIRM_REQUIRED: "비밀번호 확인을 입력해주세요.",
  },
  PERSONAL: {
    INVITE_CODE_REQUIRED: "초대 코드를 입력해주세요.",
    INVITE_CODE_DIGITS: "초대 코드는 6자리 숫자여야 합니다.",
    NAME_REQUIRED: "이름을 입력해주세요.",
    NAME_KOREAN: "올바른 형식의 한글 이름을 입력하세요.",
    CLUB_AGE_TWO_DIGITS: "두 자릿 수 학번을 입력해주세요.",
    PHONE_REQUIRED: "전화번호를 입력해주세요.",
    PHONE_FORMAT: "올바른 형식의 전화번호를 입력하세요.",
    NICKNAME_KOREAN: "올바른 형식의 한글 패명을 입력하세요.",
    CLUB_REQUIRED: "소속패를 선택해주세요.",
  },
  TERMS: {
    ALL_REQUIRED: "모든 약관에 동의해주세요.",
  },
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
} as const;
