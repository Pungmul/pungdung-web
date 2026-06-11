"use client";

import { ChatLogMessage } from "./ChatLogMessage";
import { NEW_MESSAGES_DIVIDER_DATA_ATTR } from "../../../constants/ui.constants";

export function NewMessagesDivider() {
  return (
    <li
      {...{ [NEW_MESSAGES_DIVIDER_DATA_ATTR]: true }}
      aria-label="새로운 메시지 구분선"
    >
      <ChatLogMessage>새로운 메시지입니다.</ChatLogMessage>
    </li>
  );
}
