"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  useSocketConnection,
  useSocketManagerOptional,
  useSocketSubscription,
} from "@pungdung/worker-socket-bridge/react";

import { myPageQueries } from "@/features/my-page";

import { chatQueries } from "../queries";
import { buildReadSignPublishPayload } from "../services";
import { mergeReadTargetMessageId } from "../services";
import {
  MAX_ATTEMPTS,
  READ_SIGN_CATCH_UP_DELAY_MS,
} from "../services";
import { resetUnreadCountInRoomList } from "../services";
import { resolveConfirmedLastReadMessageId } from "../services";
import { shouldClearReadSignTarget } from "../services";
import { shouldScheduleReadSignCatchUp } from "../services";
import { useReadReceiptStore } from "../store";

import type { ReadSignFn, ReadSignOptions } from "./read-sign.types";
import { readSocketMessageSchema } from "./socket-message.schema";
import { toNumericMessageId } from "../lib/message/parse-message-id";
import type { ChatRoomListItem } from "../types/chat-room.types";

import { authQueries } from "@/features/auth/queries";

type RoomReadSignRuntime = {
  pending: boolean;
  pageVisible: boolean;
  targetMessageId: number | null;
  catchUpTimer: ReturnType<typeof setTimeout> | null;
  catchUpAttempts: number;
  myUserId: number | null;
  readSign: ReadSignFn;
};

function createRoomReadSignRuntime(): RoomReadSignRuntime {
  return {
    pending: false,
    pageVisible: typeof document !== "undefined" ? !document.hidden : true,
    targetMessageId: null,
    catchUpTimer: null,
    catchUpAttempts: 0,
    myUserId: null,
    readSign: () => {},
  };
}

function clearCatchUpTimer(runtime: RoomReadSignRuntime): void {
  if (runtime.catchUpTimer === null) {
    return;
  }

  clearTimeout(runtime.catchUpTimer);
  runtime.catchUpTimer = null;
}

/**
 * 채팅방 읽음 publish + `/sub/chat/read` 브로드캐스트 반영.
 */
export function useRoomReadSocket(roomId: string) {
  const socket = useSocketManagerOptional();
  const queryClient = useQueryClient();
  const isConnected = useSocketConnection();
  const { data: token } = useQuery(authQueries.token());
  const { data: myInfo } = useQuery(myPageQueries.info());
  const { data: chatRoomData } = useQuery(chatQueries.room(roomId));
  const runtimeRef = useRef<RoomReadSignRuntime>(createRoomReadSignRuntime());
  const applySocketRead = useReadReceiptStore((state) => state.applySocketRead);

  const myUserId = useMemo(() => {
    const username = myInfo?.username;
    if (!username || !chatRoomData) {
      return null;
    }

    return (
      chatRoomData.userInfoList.find((user) => user.username === username)
        ?.userId ?? null
    );
  }, [chatRoomData, myInfo?.username]);

  runtimeRef.current.myUserId = myUserId;

  const canSendNow = useCallback(() => {
    return isConnected && runtimeRef.current.pageVisible;
  }, [isConnected]);

  const publishReadSign = useCallback(async () => {
    const runtime = runtimeRef.current;

    if (!socket) {
      runtime.pending = true;
      return false;
    }

    const topic = `/pub/chat/read/${roomId}`;
    const payload = buildReadSignPublishPayload(
      roomId,
      runtime.targetMessageId
    );

    try {
      await socket.publish(topic, payload);
      runtime.pending = false;
      return true;
    } catch {
      runtime.pending = true;
      return false;
    }
  }, [roomId, socket]);

  const scheduleReadSignCatchUp = useCallback(() => {
    const runtime = runtimeRef.current;
    const targetMessageId = runtime.targetMessageId;

    if (targetMessageId === null) {
      return;
    }

    if (runtime.catchUpAttempts >= MAX_ATTEMPTS) {
      return;
    }

    clearCatchUpTimer(runtime);
    runtime.catchUpTimer = setTimeout(() => {
      runtime.catchUpTimer = null;
      runtime.catchUpAttempts += 1;
      runtime.readSign({ upToMessageId: targetMessageId });
    }, READ_SIGN_CATCH_UP_DELAY_MS);
  }, []);

  const handleReadMessage = useCallback(
    (message: unknown) => {
      const runtime = runtimeRef.current;
      const parsed = readSocketMessageSchema.safeParse(message);
      if (!parsed.success) {
        return;
      }

      const { userId, messageIds } = parsed.data.content;
      const confirmedLastReadMessageId =
        resolveConfirmedLastReadMessageId(messageIds);
      const isMyReadBroadcast =
        runtime.myUserId !== null && userId === runtime.myUserId;

      if (!isMyReadBroadcast) {
        applySocketRead(roomId, userId, messageIds);
        return;
      }

      if (
        shouldClearReadSignTarget(
          runtime.targetMessageId,
          confirmedLastReadMessageId
        )
      ) {
        runtime.targetMessageId = null;
        runtime.catchUpAttempts = 0;
        clearCatchUpTimer(runtime);
        return;
      }

      if (
        shouldScheduleReadSignCatchUp({
          broadcastUserId: userId,
          myUserId: runtime.myUserId,
          targetMessageId: runtime.targetMessageId,
          messageIds,
          confirmedLastReadMessageId,
        })
      ) {
        scheduleReadSignCatchUp();
      }
    },
    [applySocketRead, roomId, scheduleReadSignCatchUp]
  );

  const readSign = useCallback<ReadSignFn>(
    (options?: ReadSignOptions) => {
      const runtime = runtimeRef.current;
      const upToMessageId = toNumericMessageId(options?.upToMessageId);

      if (upToMessageId !== null) {
        runtime.targetMessageId = mergeReadTargetMessageId(
          runtime.targetMessageId,
          upToMessageId
        );
      }

      if (!token?.accessToken) {
        return;
      }

      if (!canSendNow()) {
        runtime.pending = true;
        return;
      }

      void publishReadSign().then((didSend) => {
        if (!didSend) {
          return;
        }

        queryClient.setQueryData<ChatRoomListItem[]>(
          chatQueries.roomList().queryKey,
          (prevData) => {
            if (!prevData) return prevData;
            return resetUnreadCountInRoomList(prevData, roomId);
          }
        );
      });
    },
    [token, canSendNow, publishReadSign, queryClient, roomId]
  );

  runtimeRef.current.readSign = readSign;

  useEffect(() => {
    const runtime = runtimeRef.current;

    const handleVisibilityChange = () => {
      runtime.pageVisible = !document.hidden;
      if (runtime.pageVisible && runtime.pending && token?.accessToken) {
        readSign();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearCatchUpTimer(runtime);
    };
  }, [readSign, token?.accessToken]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (
      !token?.accessToken ||
      !isConnected ||
      !runtime.pageVisible ||
      !runtime.pending
    ) {
      return;
    }
    readSign();
  }, [token?.accessToken, isConnected, readSign]);

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
