/**
 * 화면 라벨·placeholder·흐름 버튼 등 UI 카피
 */
export const AUTH_UI_MESSAGE = {
  FLOW: {
    NEXT: "다음",
    BACK: "뒤로가기",
    FILL_ALL_FIELDS: "모든 필드를 입력해주세요",
    AGREE_TERMS_TO_CONTINUE: "약관에 동의해주세요",
  },
  TERMS_STEP: {
    AGREE_ALL: "모든 약관에 동의합니다",
    AGREE_SERVICE: "이용 약관에 동의합니다",
    AGREE_PRIVACY: "개인정보 이용에 동의합니다",
  },
  ACCOUNT_STEP: {
    EMAIL_LABEL: "이메일",
    EMAIL_PLACEHOLDER: "로그인에 사용할 이메일을 입력해주세요.",
    PASSWORD_LABEL: "비밀번호",
    PASSWORD_PLACEHOLDER: "비밀번호를 입력해주세요.",
    CONFIRM_PASSWORD_LABEL: "비밀번호 확인",
    CONFIRM_PASSWORD_PLACEHOLDER: "비밀번호를 다시 입력해주세요.",
  },
  PERSONAL_STEP: {
    NAME_LABEL: "이름",
    NAME_PLACEHOLDER: "이름을 입력해주세요.",
    NICKNAME_LABEL: "패명",
    NICKNAME_PLACEHOLDER: "패명을 입력해주세요.",
    CLUB_LABEL: "소속패",
    CLUB_PLACEHOLDER: "소속패를 선택해주세요.",
    CLUB_AGE_LABEL: "학번",
    CLUB_AGE_PLACEHOLDER: "학번을 입력해주세요.",
    PHONE_LABEL: "전화번호",
    PHONE_PLACEHOLDER: "전화번호를 입력해주세요.",
    INVITE_CODE_LABEL: "초대 코드",
    INVITE_CODE_PLACEHOLDER: "초대 코드를 입력해주세요.",
  },
  STEP_INDICATOR: {
    TERMS: "약관동의",
    ACCOUNT: "계정 정보 입력",
    PERSONAL: "개인 정보 입력",
  },
  EMAIL_CHECK: {
    LABEL: "이메일",
    PLACEHOLDER: "이메일을 입력해주세요.",
    SUBMIT: "이메일 전송",
  },
  RESET_PASSWORD: {
    INSTRUCTION:
      "비밀번호를 다시 설정할 수 있는 링크를 보내드릴게요.\n로그인하실 때 사용하시는 이메일 주소를 입력해주세요.",
    TITLE: "비밀번호 재설정",
    FORM: {
      NEW_PASSWORD_LABEL: "새 비밀번호",
      NEW_PASSWORD_PLACEHOLDER: "새 비밀번호를 입력해주세요.",
      CONFIRM_LABEL: "비밀번호 확인",
      CONFIRM_PLACEHOLDER: "비밀번호를 다시 입력해주세요.",
      SUBMIT: "비밀번호 재설정",
    },
  },
  CHANGE_PASSWORD: {
    FORM: {
      CURRENT_LABEL: "현재 비밀번호",
      NEW_LABEL: "신규 비밀번호",
      NEW_PLACEHOLDER: "새로운 비밀번호를 입력해주세요.",
      CONFIRM_LABEL: "비밀번호 확인",
      CONFIRM_PLACEHOLDER: "새로운 비밀번호를 다시 입력해주세요.",
      SUBMIT: "비밀번호 변경",
    },
  },
  LOGIN: {
    PASSWORD_LABEL: "비밀번호",
    SUBMIT: "로그인",
  },
  GO_TO_LOGIN_PAGE: "로그인 페이지로 이동",
} as const;
