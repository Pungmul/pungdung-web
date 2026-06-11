"use client";

import { useApplyResetRoomUnreadCount } from "../../actions/chat-room-list/useApplyResetRoomUnreadCount";

export const useResetRoomUnreadCount = () => {
  const { applyResetRoomUnreadCount } = useApplyResetRoomUnreadCount();

  return { resetRoomUnreadCount: applyResetRoomUnreadCount };
};
