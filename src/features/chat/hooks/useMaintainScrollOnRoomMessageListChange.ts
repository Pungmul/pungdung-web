"use client";

import { useEffect } from "react";

import type { Message, PendingMessage } from "../types";

/** 병합된 메시지 목록이 바뀐 뒤 스크롤 위치를 이전과 같게 유지합니다. */
export function useMaintainScrollOnRoomMessageListChange(
  messageList: (Message | PendingMessage)[],
  maintainScrollPosition: () => void
) {
  useEffect(() => {
    maintainScrollPosition();
  }, [messageList, maintainScrollPosition]);
}
