"use client";

import { useEffect } from "react";

import type { Message, PendingMessage } from "../../../types";

type UseMaintainScrollOnRoomMessageListChangeOptions = {
  /** false면 진입 스크롤 등 선행 작업이 끝날 때까지 prepend 보정을 보류한다. */
  enabled?: boolean;
};

/** 병합된 메시지 목록이 바뀐 뒤 스크롤 위치를 이전과 같게 유지합니다. */
export function useMaintainScrollOnRoomMessageListChange(
  messageList: readonly (Message | PendingMessage)[],
  maintainScrollPosition: () => void,
  options?: UseMaintainScrollOnRoomMessageListChangeOptions
) {
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    maintainScrollPosition();
  }, [enabled, messageList, maintainScrollPosition]);
}
