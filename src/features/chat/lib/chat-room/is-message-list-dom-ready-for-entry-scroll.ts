import {
  CHAT_MESSAGE_ITEM_SELECTOR,
  NEW_MESSAGES_DIVIDER_SELECTOR,
} from "../../constants/ui.constants";

type IsMessageListDomReadyForEntryScrollOptions = {
  hasNewMessagesDivider: boolean;
};

/** 진입 스크롤 전 MessageList DOM이 실제로 그려졌는지 확인한다. */
export function isMessageListDomReadyForEntryScroll(
  messageContainer: HTMLElement,
  { hasNewMessagesDivider }: IsMessageListDomReadyForEntryScrollOptions
): boolean {
  const messageItems = messageContainer.querySelectorAll(
    CHAT_MESSAGE_ITEM_SELECTOR
  );
  if (messageItems.length === 0) {
    return false;
  }

  if (hasNewMessagesDivider) {
    return (
      messageContainer.querySelector(NEW_MESSAGES_DIVIDER_SELECTOR) !== null
    );
  }

  return true;
}
