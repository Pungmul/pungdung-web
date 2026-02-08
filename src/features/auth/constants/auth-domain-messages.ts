/**
 * API·토스트·완료 화면 등 비즈니스/결과 문구 (API 응답 `message`는 런타임에 우선)
 */
export const AUTH_DOMAIN_MESSAGE = {
  RESET_PASSWORD: {
    SUCCESS: "비밀번호 재설정 이메일을 전송했습니다.",
    ERROR: "비밀번호 재설정 이메일 전송에 실패했습니다.",
    TOKEN_INVALID: "토큰이 유효하지 않습니다: 잘못된 접근입니다.",
  },
  LOGIN: {
    /** 요청 실패 Error에 `message`가 없을 때 (예: fetch 예외) */
    GENERIC_FAILURE: "로그인에 실패했습니다.",
  },
  /** 클라이언트 fetch·프록시 단에서 던지는 기본 오류 문구 */
  API: {
    REQUEST_SIGN_UP_FAILED: "회원가입 요청에 실패했습니다.",
    REQUEST_LOGIN_FAILED: "로그인 요청 처리에 실패했습니다.",
    PROXY_FAILURE: "프록시 처리 실패",
    KAKAO_SIGN_UP_FAILED: "카카오 회원가입 요청에 실패했습니다.",
    RESET_PASSWORD_SUBMIT_FAILED: "비밀번호 재설정 요청에 실패했습니다.",
    EMAIL_EXISTS_CHECK_FAILED: "이메일 중복 체크에 실패했습니다.",
    /** `response.status`와 이어붙여 사용 (`서버 불안정404` 등 기존과 동일) */
    SERVER_UNSTABLE: "서버 불안정",
  },
  SIGN_UP_COMPLETE: {
    PENDING_TITLE: "회원가입 신청서 보내는 중...",
    FAILURE_TITLE: "회원가입 실패",
    GENERIC_ERROR: "회원가입 중 오류가 발생했습니다.",
    BACK_TO_EDIT: "뒤로 가서 다시 입력",
    RETRY: "다시 시도",
    SUCCESS_TITLE: "회원가입이 완료되었어요!",
    SUCCESS_SUBTITLE: "즐거운 풍물 생활을 시작해봐요",
    GO_TO_LOGIN: "로그인 하러가기",
  },
  CHANGE_PASSWORD: {
    FAILURE_PREFIX: "비밀번호 변경 실패: ",
  },
} as const;
