"use client";
import React, { useCallback, useMemo, useRef } from "react";

import getScrollableParent from "@/shared/lib/getScrollableParent";

import { MessageItem } from "./MessageItem";
import { isReadByLastReadMessageId } from "../../services";
import type { Message, PendingMessage } from "../../types";

interface UserLastReadMessageIdMap {
  [key: string]: number | null;
}

interface UserImageMap {
  [key: string]: string | null;
}

interface UserNameMap {
  [key: string]: string | null;
}

interface MessageListProps {
  messages: (Message | PendingMessage)[];
  currentUserId: string;
  userLastReadMessageIdMap: UserLastReadMessageIdMap;
  userImageMap: UserImageMap;
  userNameMap: UserNameMap;
  onResendText: (message: string) => void;
  onResendImage: (files: FileList) => void;
  onDeletePending: (message: PendingMessage) => void;
}

const HEADER_HEIGHT = 50;
const DATE_ITEM_HEIGHT = 24;
const MESSAGE_LIST_GAP = 12;

const MessageListComponent: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  userLastReadMessageIdMap,
  userImageMap,
  userNameMap,
  onResendText,
  onResendImage,
  onDeletePending,
}) => {
  const dateRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());

  // unreadCount를 한 번에 계산 (O(n×m) → 한 번만 실행)
  const unreadCountMap = useMemo(() => {
    const map = new Map<number | string, number>();

    messages.forEach((msg) => {
      if (typeof msg.id !== "number") {
        map.set(msg.id, 0);
        return;
      }

      const isMyMessage = msg.senderUsername === currentUserId;

      // 내가 보낸 메시지: 나를 제외한 다른 사람들 중 읽지 않은 사람 수
      // 다른 사람이 보낸 메시지: 모든 사람 중 읽지 않은 사람 수
      let unreadCount = 0;

      Object.entries(userLastReadMessageIdMap).forEach(([userId, lastReadId]) => {
        // 내가 보낸 메시지의 경우 나 자신은 제외
        if (isMyMessage && userId === currentUserId) {
          return;
        }

        // 해당 유저가 이 메시지를 읽지 않았으면 카운트 증가
        if (!isReadByLastReadMessageId(msg.id as number, lastReadId)) {
          unreadCount++;
        }
      });

      map.set(msg.id, unreadCount);
    });

    return map;
  }, [messages, userLastReadMessageIdMap, currentUserId]);

  // 날짜 타임스탬프 클릭 핸들러
  const handleDateClick = useCallback((dateKey: string) => {
    const targetElement = dateRefs.current.get(dateKey);
    if (targetElement) {
      const scrollableParent = getScrollableParent(targetElement);
      if (scrollableParent) {
        const targetTop =
          targetElement.offsetTop -
          HEADER_HEIGHT -
          DATE_ITEM_HEIGHT -
          MESSAGE_LIST_GAP;

        const currentScrollTop = scrollableParent.scrollTop;
        const distance = targetTop - currentScrollTop; // 양수: 아래로 이동, 음수: 위로 이동

        let behavior: ScrollBehavior;

        if (distance < 0) {
          // 위로 이동할 때
          behavior = Math.abs(distance) < 400 ? "smooth" : "auto";
        } else {
          // 아래로 이동할 때
          behavior = distance < 800 ? "smooth" : "auto";
        }

        scrollableParent.scrollTo({
          top: targetTop,
          behavior,
        });
      }
    }
  }, []);

  return (
    <ul className="flex flex-col list-none gap-[12px]">
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];
        const dateKey = new Date(message.createdAt).toISOString().split("T")[0]!;
        const isSameDate =
          prevMessage &&
          new Date(message.createdAt).toDateString() ===
          new Date(prevMessage.createdAt).toDateString();

        return (
          <MessageItem
            key={message.id}
            message={message}
            prevMessage={prevMessage}
            nextMessage={nextMessage}
            currentUserId={currentUserId}
            unreadCount={unreadCountMap.get(message.id) ?? 0}
            userImageUrl={userImageMap[message.senderUsername] ?? null}
            senderDisplayName={userNameMap[message.senderUsername] ?? ""}
            onDateClick={handleDateClick}
            onResendText={onResendText}
            onResendImage={onResendImage}
            onDeletePending={onDeletePending}
            dateRef={
              !isSameDate
                ? (el) => {
                  if (el) dateRefs.current.set(dateKey, el);
                }
                : undefined
            }
          />
        );
      })}
    </ul>
  );
};

export const MessageList = React.memo(MessageListComponent);
