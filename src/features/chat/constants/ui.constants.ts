/**
 * UI 관련 상수
 */

/** 스크롤 감지 해제 딜레이 (ms) */
export const SCROLL_RELEASE_DELAY_MS = 1000;

/** 스크롤 쓰로틀 간격 (ms) */
export const SCROLL_THROTTLE_MS = 200;

/** 무한스크롤 디바운스 딜레이 (ms) */
export const INFINITE_SCROLL_DEBOUNCE_MS = 1000;

/**
 * "새로운 메시지입니다." 구분선은 이 개수 이상의 미읽음일 때만 표시한다.
 * 진입 스크롤 offset(`useEntryUnreadScrollOnMount`)은 미읽음 1건부터 적용한다.
 */
export const NEW_MESSAGES_DIVIDER_MIN_UNREAD_COUNT = 10;

/** 미읽음 진입 시 최신 메시지에서 위로 띄울 메시지 개수 (scrollTop 양수 offset) */
export const ENTRY_SCROLL_OFFSET_ABOVE_LATEST_MESSAGE_COUNT = 2;

/** 진입 스크롤이 끝나지 않을 때 maintain scroll을 풀어주는 최대 대기 (ms) */
export const ENTRY_SCROLL_SETTLE_TIMEOUT_MS = 3_000;

/** flex-col-reverse 타임라인에서 최신 이동 버튼을 보여줄 scrollTop 거리 (px) */
export const SHOW_SCROLL_TO_LATEST_BUTTON_THRESHOLD_PX = 160;

/** 최신 이동 버튼과 send form 사이 간격 (px) */
export const SCROLL_TO_LATEST_BUTTON_GAP_PX = 8;

/** 최신 이동 버튼 숨김 시 아래로 밀어낼 translate 비율 */
export const SCROLL_TO_LATEST_BUTTON_HIDE_TRANSLATE_CLASS =
  "translate-y-[140%]";

/** MessageList `ul` flex gap — 스크롤 offset·날짜 점프 보정에 사용 */
export const MESSAGE_LIST_GAP_PX = 12;

/** 타임라인 스크롤 offset 측정 — MessageList row `li` marker */
export const CHAT_MESSAGE_ITEM_DATA_ATTR = "data-chat-message-item" as const;

/** 타임라인 스크롤 offset 측정 — MessageList row querySelector */
export const CHAT_MESSAGE_ITEM_SELECTOR = `[${CHAT_MESSAGE_ITEM_DATA_ATTR}]`;

/** 타임라인 스크롤 offset 측정 — "새로운 메시지입니다." 구분선 `li` marker */
export const NEW_MESSAGES_DIVIDER_DATA_ATTR =
  "data-new-messages-divider" as const;

/** 타임라인 스크롤 offset 측정 — 구분선 querySelector */
export const NEW_MESSAGES_DIVIDER_SELECTOR = `[${NEW_MESSAGES_DIVIDER_DATA_ATTR}]`;

/** 날짜 헤더 클릭 시 스크롤 목표 위치 보정 — sticky header 높이 */
export const MESSAGE_LIST_HEADER_HEIGHT_PX = 50;

/** 날짜 헤더 클릭 시 스크롤 목표 위치 보정 — DateItem 높이 */
export const MESSAGE_LIST_DATE_ITEM_HEIGHT_PX = 24;

/** 날짜 점프 시 위쪽 smooth scroll 적용 최대 거리 (px) */
export const MESSAGE_LIST_DATE_JUMP_SMOOTH_SCROLL_MAX_DISTANCE_UP_PX = 400;

/** 날짜 점프 시 아래쪽 smooth scroll 적용 최대 거리 (px) */
export const MESSAGE_LIST_DATE_JUMP_SMOOTH_SCROLL_MAX_DISTANCE_DOWN_PX = 800;

/**
 * 채팅방 본문 z-index 서열
 * messageList < scrollToLatestButton < sendForm < drawerBackdrop < drawer
 */
export const CHAT_ROOM_Z_INDEX = {
  messageList: 0,
  stickyDate: 15,
  scrollToLatestButton: 10,
  sendForm: 20,
  drawerBackdrop: 55,
  drawer: 60,
} as const;
