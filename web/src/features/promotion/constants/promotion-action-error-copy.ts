export const UNKNOWN_PROMOTION_ACTION_MESSAGE =
  "알 수 없는 오류가 발생했어요. 새로고침 이후 다시 시도해주세요.";

export const PROMOTION_ACTION_CODE_MESSAGE = {
  POST_022: "공연을 찾을 수 없어요. 목록에서 다시 열어주세요.",
  POST_009: "이 공연을 수정할 권한이 없어요.",
  POST_011: "이미 게시된 공연이라 다시 게시할 수 없어요.",
  POST_024: "저장된 초안을 찾지 못했어요. 목록에서 다시 열어주세요.",
  POST_025: "초안 정보를 확인하지 못했어요. 잠시 후 다시 시도해주세요.",
  POST_012: "저장된 초안을 읽지 못했어요. 내용을 다시 작성해주세요.",
} as const;

export const PROMOTION_VERSION_CONFLICT_MESSAGE = {
  save: "다른 곳에서 먼저 수정되어 반영하지 못했어요.",
  publish: "다른 곳에서 먼저 수정되어 게시하지 못했어요.",
} as const;

export const PROMOTION_PUBLISH_CONDITION_MESSAGE = {
  AT_LEAST_ONE_QUESTION_REQUIRED: "질문을 1개 이상 추가해주세요.",
  QUESTION_LABEL_REQUIRED: "질문을 입력해주세요.",
  QUESTION_ORDER_REQUIRED: "질문 순서가 비어 있어요. 질문을 다시 저장해주세요.",
  QUESTION_ORDER_DUPLICATED: "질문 순서가 겹쳐 있어요. 질문을 다시 저장해주세요.",
  TEXT_SHOULD_NOT_HAVE_OPTIONS: "단답형 질문에는 선택지를 넣을 수 없어요.",
  CHOICE_REQUIRES_OPTIONS: "객관식 질문에 선택지를 추가해주세요.",
  CHECKBOX_REQUIRES_OPTIONS: "체크박스 질문에 선택지를 추가해주세요.",
  OPTION_LABEL_REQUIRED: "선택지를 입력해주세요.",
  OPTION_ORDER_REQUIRED: "선택지 순서가 비어 있어요. 질문을 다시 저장해주세요.",
  OPTION_ORDER_DUPLICATED: "선택지 순서가 겹쳐 있어요. 질문을 다시 저장해주세요.",
  UNSUPPORTED_QUESTION_TYPE: "지원하지 않는 질문 유형이 있어요.",
  START_AT_REQUIRED: "공연 날짜와 시간을 입력해주세요.",
} as const;
