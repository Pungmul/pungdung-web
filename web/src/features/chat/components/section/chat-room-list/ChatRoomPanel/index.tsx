"use client";

import ChatRoomPanelContent from "./ChatRoomPanelContent";
import { ChatRoomPanelErrorBoundary } from "./ChatRoomPanelErrorBoundary";
import {
  CHAT_ROOM_PANEL_CLASS_NAME,
  ChatRoomPanelSkeleton,
} from "./ChatRoomPanelSkeleton";

export function ChatRoomPanel() {
  return (
    <ChatRoomPanelErrorBoundary>
      <ChatRoomPanelContent />
    </ChatRoomPanelErrorBoundary>
  );
}

export default ChatRoomPanel;

export { CHAT_ROOM_PANEL_CLASS_NAME, ChatRoomPanelSkeleton };
