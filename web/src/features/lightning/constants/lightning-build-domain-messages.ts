/**
 * 번개 생성(빌드) 완료 화면 등 비즈니스 문구
 */
export const LIGHTNING_BUILD_MESSAGE = {
  COMPLETE: {
    PENDING_TITLE: "번개를 만들고 있어요...",
    FAILURE_TITLE: "번개 생성에 실패했어요",
    GENERIC_ERROR: "다시 시도하거나, 입력 내용을 확인해 주세요.",
    /** 위치 업데이트(`updateLocation`)·GPS 거부 등 */
    ERROR_LOCATION_UNAVAILABLE:
      "위치를 확인할 수 없어요.\n기기에서 위치 권한을 허용했는지 확인해 주세요.",
    /** `buildLightningRequest` 및 마지막 이전 검증 우회 등 */
    ERROR_LOCATION_REQUIRED:
      "모임 장소 정보가 필요해요.\n이전 단계에서 위치를 선택해 주세요.",
    ERROR_NETWORK: "네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
    ERROR_CLIENT_REQUEST_SHAPE:
      "요청 형식 문제로 전송에 실패했어요.\n뒤로 가서 입력을 확인한 뒤 다시 시도해 주세요.",
    ERROR_INVALID_RESPONSE_ENVELOPE:
      "서버와 통신하는 중 형식 오류가 발생했어요.\n잠시 후 다시 시도해 주세요.",
    ERROR_INVALID_RESPONSE_DATA_SHAPE:
      "받아온 데이터 형식에 문제가 있어요.\n잠시 후 다시 시도해 주세요.",
    BACK_TO_EDIT: "뒤로 가서 다시 입력",
    RETRY: "다시 시도",
    SUCCESS_PAGE_TITLE: "번개 생성 완료!",
    SUCCESS_CONFIRM: "확인",
    GO_TO_LIGHTNING: "번개로 가기",
  },
} as const;
