/**
 * 타임라인에 표시되는 확정 메시지(도메인).
 * REST 응답 형태는 `MessageDto` — 변환은 `mapMessageDtoToDomain`.
 */
export type Message =
  | {
      id: number | string;
      clientId?: string | null | undefined;
      senderUsername: string;
      content: string;
      chatType: "TEXT";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      clientId?: string | null | undefined;
      senderUsername: string;
      content: null;
      chatType: "IMAGE";
      imageUrlList: string[];
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      clientId?: string | null | undefined;
      senderUsername: string;
      content: string | null;
      chatType: "LEAVE";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      clientId?: string | null | undefined;
      senderUsername: string;
      content: string;
      chatType: "JOIN";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    };

/** 무한 스크롤(이전 메시지) 한 페이지 — REST `messages`/`hasMore`/`nextCursor` */
export interface ChatLogCursorPage {
  messages: Message[];
  hasMore: boolean;
  /** 다음 요청의 `beforeId`. 없으면 더 불러올 커서 없음 */
  nextCursor: number | null;
}

export interface MessageList {
  list: Message[];
  hasMore: boolean;
  nextCursor: number | null;
  // legacy fields(optional): 기존 참조/테스트 호환
  total?: number;
  pageNum?: number;
  pageSize?: number;
  size?: number;
  startRow?: number;
  endRow?: number;
  pages?: number;
  prePage?: number;
  nextPage?: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  navigatePages?: number;
  navigatepageNums?: number[];
  navigateFirstPage?: number;
  navigateLastPage?: number;
}
