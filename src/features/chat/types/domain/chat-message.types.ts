/**
 * 타임라인에 표시되는 확정 메시지(도메인).
 * REST 응답 형태는 `MessageDto` — 변환은 `mapMessageDtoToDomain`.
 */
export type Message =
  | {
      id: number | string;
      senderUsername: string;
      content: string;
      chatType: "TEXT";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      senderUsername: string;
      content: null;
      chatType: "IMAGE";
      imageUrlList: string[];
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      senderUsername: string;
      content: null;
      chatType: "LEAVE";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      senderUsername: string;
      content: string;
      chatType: "JOIN";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    };

export interface MessageList {
  total: number;
  list: Message[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  nextPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  navigatePages: number;
  navigatepageNums: number[];
  navigateFirstPage: number;
  navigateLastPage: number;
}
