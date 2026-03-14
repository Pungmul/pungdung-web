"use client";
import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  SocketService,
  useSocketConnection,
  useSocketSubscription,
} from "@/core/socket";

import { chatQueries } from "../queries";
import {
  mergeChatRoomWithReadSocketMessage,
  resetUnreadCount,
} from "../services";

import { readSocketMessageSchema } from "./socket-message.schema";
import type { ChatRoom, ChatRoomListItem } from "../types/domain/chat-room.types";

import { authQueries } from "@/features/auth/queries";

/**
 * 채팅방의 읽음 처리를 관리하는 소켓 훅.
 *
 * @description
 * 1. 사용자가 메시지를 읽었음을 서버에 알림 (`readSign` → `/pub/chat/read/:roomId`)
 * 2. 다른 사용자의 읽음 상태를 소켓으로 수신해 `ChatRoom` 쿼리 `userInitReadList` 반영
 * 3. React Query 캐시 갱신으로 UI에 반영
 *
 * @example
 * const { readSign, isConnected } = useRoomReadSocket(roomId);
 * // 새 메시지를 화면에 반영한 뒤
 * readSign();
 */
export function useRoomReadSocket(roomId: string) {
  const queryClient = useQueryClient();
  const isConnected = useSocketConnection();
  const { data: token } = useQuery(authQueries.token());

  /** 연결·가시성이 맞지 않아 보내지 못한 읽음 신호를 나중에 다시 시도하기 위한 플래그 */
  const pendingReadSignRef = useRef(false);
  const isPageVisibleRef = useRef(!document.hidden);

  const canSendNow = useCallback(
    () => isConnected && isPageVisibleRef.current,
    [isConnected]
  );

  const sendReadSign = useCallback(() => {
    const message = {
      chatRoomUUID: roomId,
    };

    try {
      SocketService.sendMessage(`/pub/chat/read/${roomId}`, message);
      pendingReadSignRef.current = false;
      return true;
    } catch (error) {
      // 소켓 publish 타이밍 이슈로 실패할 수 있어 다음 기회에 재전송한다.
      pendingReadSignRef.current = true;
      console.warn(
        "Failed to send read sign, will retry on next trigger",
        error
      );
      return false;
    }
  }, [roomId]);

  /** 타인 읽음 브로드캐스트: `mergeChatRoomWithReadSocketMessage`로 캐시만 갱신 */
  const handleReadMessage = useCallback(
    (message: unknown) => {
      const parsed = readSocketMessageSchema.safeParse(message);
      if (!parsed.success) return;

      queryClient.setQueryData<ChatRoom>(
        chatQueries.room(roomId).queryKey,
        (prev) =>
          mergeChatRoomWithReadSocketMessage(prev, parsed.data) ?? prev
      );
    },
    [queryClient, roomId]
  );

  /**
   * 현재 사용자 읽음을 서버에 전송하고, 방 목록 `unreadCount`는 낙관적으로 0으로 둔다.
   * 실제 읽음 동기화는 서버 브로드캐스트로 이어진다.
   */
  const readSign = useCallback(() => {
    if (!token?.accessToken) {
      console.warn("Cannot send read sign: No token (logged out)");
      return;
    }

    if (!canSendNow()) {
      if (!isConnected) {
        console.warn("Cannot send read sign: WebSocket not connected");
      } else {
        console.log("Page not visible, pending read sign");
      }
      pendingReadSignRef.current = true;
      return;
    }

    const didSend = sendReadSign();
    if (!didSend) {
      return;
    }

    // ChatRoomList의 unreadCount 즉시 업데이트 (낙관적 업데이트)
    queryClient.setQueryData<ChatRoomListItem[]>(
      chatQueries.roomList().queryKey,
      (prevData) => {
        if (!prevData) return [];
        return resetUnreadCount(prevData, roomId);
      }
    );
  }, [token, canSendNow, isConnected, queryClient, roomId, sendReadSign]);

  /**
   * 페이지 가시성: 다시 보이면 보류 중인 읽음 신호를 실행하고, 숨기면 전송 중단 상태로 둔다.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      isPageVisibleRef.current = visible;

      // 다시 보이게 되었고 보류 중이며 로그인 상태면 읽음 재시도
      if (visible && pendingReadSignRef.current && token?.accessToken) {
        readSign();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [readSign, token?.accessToken]);

  /**
   * 연결 및 가시성이 복구되면 보류된 읽음 신호 재전송.
   * `visibilitychange`가 빠졌거나 연결 타이밍이 어긋난 경우를 보완한다.
   */
  useEffect(() => {
    if (
      !token?.accessToken ||
      !isConnected ||
      !isPageVisibleRef.current ||
      !pendingReadSignRef.current
    ) {
      return;
    }
    readSign();
  }, [token?.accessToken, isConnected, readSign]);

  /**
   * 연결되면(및 토큰 있으면) 읽음 신호 전송.
   * 채팅방 진입·재연결 시 목록/타이틀 반영을 맞추기 위함.
   */
  useEffect(() => {
    if (!token?.accessToken || !isConnected) {
      return;
    }
    readSign();
  }, [token?.accessToken, isConnected, readSign]);

  /** 다른 사용자 읽음 상태 구독 */
  useSocketSubscription({
    topic: `/sub/chat/read/${roomId}`,
    onMessage: handleReadMessage,
    enabled: !!roomId,
  });

  return {
    readSign,
    isConnected,
  };
}
