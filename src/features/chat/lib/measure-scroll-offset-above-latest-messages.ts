import {
  CHAT_MESSAGE_ITEM_SELECTOR,
  MESSAGE_LIST_GAP_PX,
} from "../constants/ui.constants";

/**
 * flex-col-reverse 채팅 스크롤에서 scrollTop 양수 offset을 계산한다.
 * 최신 메시지 N개 높이(+ gap)만큼 위로 올려 구분선·맥락이 보이게 한다.
 */
export function measureScrollOffsetAboveLatestMessages(
  container: HTMLElement,
  messageCount: number
): number {
  if (messageCount <= 0) {
    return 0;
  }

  const items = container.querySelectorAll<HTMLElement>(
    CHAT_MESSAGE_ITEM_SELECTOR
  );
  if (items.length === 0) {
    return 0;
  }

  const count = Math.min(messageCount, items.length);
  let offset = 0;

  for (let index = items.length - count; index < items.length; index += 1) {
    offset += items[index]!.offsetHeight;
  }

  if (count > 1) {
    offset += MESSAGE_LIST_GAP_PX * (count - 1);
  }

  return offset;
}
