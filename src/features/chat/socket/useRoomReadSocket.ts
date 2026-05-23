"use client";

import { type RefObject, useCallback, useEffect, useMemo, useRef } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  useSocketConnection,
  useSocketManagerOptional,
  useSocketSubscription,
} from "@pungdung/worker-socket-bridge/react";

import { myPageQueries } from "@/features/my-page";

import { MAX_ATTEMPTS, READ_SIGN_CATCH_UP_DELAY_MS } from "../constants";
import { chatQueries } from "../queries";
import {
  buildReadSignPublishPayload,
  clearReadSignCatchUpTimer,
  createReadSignPublishScheduler,
  ensureReadSignTargetMessageId,
  resetReadSignRuntimeState,
  resolveMyReadBroadcastAction,
  resolveReadBroadcastLastReadMessageId,
} from "../services";
import { useReadReceiptStore } from "../store";

import type { ReadSignFn, ReadSignOptions } from "./read-sign.types";
import { readSocketMessageSchema } from "./socket-message.schema";
import { applyResetRoomUnreadCount } from "../hooks/actions/chat-room-list/apply-reset-room-unread-count";
import { toNumericMessageId } from "../lib/message/parse-message-id";
import { logReadSignDebug } from "../lib/read-receipt/read-sign-debug-log";
import type { ReadSignPublishScheduler } from "../services";

import { authQueries } from "@/features/auth/queries";

export type ReadSignTimelineMessage = {
  id: number | string;
  createdAt: string;
};

export type ReadSignTimelineMessagesRef = RefObject<
  readonly ReadSignTimelineMessage[]
>;

type UseRoomReadSocketOptions = {
  timelineMessagesRef?: ReadSignTimelineMessagesRef;
};

type RoomReadSignRuntime = {
  pending: boolean;
  pageVisible: boolean;
  targetMessageId: number | null;
  catchUpTimer: ReturnType<typeof setTimeout> | null;
  catchUpAttempts: number;
  myUserId: number | null;
  readSign: ReadSignFn;
  publishScheduler: ReadSignPublishScheduler | null;
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
    publishScheduler: null,
  };
}

export function useRoomReadSocket(
  roomId: string,
  options?: UseRoomReadSocketOptions
) {
  const timelineMessagesRef = options?.timelineMessagesRef;
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

  const resolvePublishTargetMessageId = useCallback(() => {
    const runtime = runtimeRef.current;
    runtime.targetMessageId = ensureReadSignTargetMessageId({
      currentTargetMessageId: runtime.targetMessageId,
      timelineMessages: timelineMessagesRef?.current,
    });
    return runtime.targetMessageId;
  }, [timelineMessagesRef]);

  const publishReadSignNow = useCallback(async () => {
    const runtime = runtimeRef.current;

    if (!socket) {
      runtime.pending = true;
      return false;
    }

    const targetMessageId = resolvePublishTargetMessageId();
    if (targetMessageId === null) {
      logReadSignDebug("publish.skipped", {
        roomId,
        reason: "missing_target_message_id",
      });
      return false;
    }

    const topic = `/pub/chat/read/${roomId}`;
    const payload = buildReadSignPublishPayload(roomId, targetMessageId);

    logReadSignDebug("publish.attempt", {
      roomId,
      topic,
      targetMessageId,
      payload,
    });

    try {
      await socket.publish(topic, payload);
      runtime.pending = false;
      logReadSignDebug("publish.success", {
        roomId,
        targetMessageId,
      });
      runtime.catchUpAttempts = 0;
      return true;
    } catch (error) {
      runtime.pending = true;
      logReadSignDebug("publish.fail", {
        roomId,
        targetMessageId,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }, [resolvePublishTargetMessageId, roomId, socket]);

  const createPublishScheduler = useCallback(() => {
    return createReadSignPublishScheduler(async () => {
      const runtime = runtimeRef.current;

      if (!token?.accessToken) {
        return;
      }

      if (!canSendNow()) {
        runtime.pending = true;
        return;
      }

      const didSend = await publishReadSignNow();
      if (!didSend) {
        return;
      }

      await applyResetRoomUnreadCount(queryClient, roomId);
    });
  }, [
    canSendNow,
    publishReadSignNow,
    queryClient,
    roomId,
    token?.accessToken,
  ]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    runtime.publishScheduler?.cancel();
    runtime.publishScheduler = null;
  }, [createPublishScheduler]);

  const scheduleReadSignPublish = useCallback(() => {
    const runtime = runtimeRef.current;

    if (!runtime.publishScheduler) {
      runtime.publishScheduler = createPublishScheduler();
    }

    runtime.publishScheduler.schedule();
  }, [createPublishScheduler]);

  const flushReadSignOnRoomLeave = useCallback(() => {
    const runtime = runtimeRef.current;
    resolvePublishTargetMessageId();

    if (runtime.targetMessageId === null) {
      logReadSignDebug("lifecycle.flush_on_leave.skipped", {
        roomId,
        reason: "missing_target_message_id",
      });
      runtime.publishScheduler?.cancel();
    } else {
      logReadSignDebug("lifecycle.flush_on_leave", {
        roomId,
        targetMessageId: runtime.targetMessageId,
      });

      if (!runtime.publishScheduler) {
        runtime.publishScheduler = createPublishScheduler();
      }

      runtime.publishScheduler.flushNow();
    }

    resetReadSignRuntimeState(runtime);
  }, [createPublishScheduler, resolvePublishTargetMessageId, roomId]);

  const scheduleReadSignCatchUp = useCallback(() => {
    const runtime = runtimeRef.current;
    const targetMessageId = runtime.targetMessageId;

    if (targetMessageId === null) {
      return;
    }

    if (runtime.catchUpAttempts >= MAX_ATTEMPTS) {
      logReadSignDebug("catch_up.exhausted", {
        roomId,
        targetMessageId,
        catchUpAttempts: runtime.catchUpAttempts,
      });
      return;
    }

    clearReadSignCatchUpTimer(runtime);
    runtime.catchUpTimer = setTimeout(() => {
      runtime.catchUpTimer = null;
      runtime.catchUpAttempts += 1;
      runtime.readSign({
        upToMessageId: targetMessageId,
        source: "catch-up",
      });
    }, READ_SIGN_CATCH_UP_DELAY_MS);
  }, [roomId]);

  const handleReadMessage = useCallback(
    (message: unknown) => {
      const runtime = runtimeRef.current;
      const parsed = readSocketMessageSchema.safeParse(message);
      if (!parsed.success) {
        logReadSignDebug("receive.parse_failed", {
          roomId,
          issues: parsed.error.issues.map((issue) => issue.message),
          raw: message,
        });
        return;
      }

      const { messageLogId } = parsed.data;
      const { userId, messageIds, readAt } = parsed.data.content;
      const timelineMessages = timelineMessagesRef?.current;
      const isMyReadBroadcast =
        runtime.myUserId !== null && userId === runtime.myUserId;
      const resolvedLastReadMessageId = resolveReadBroadcastLastReadMessageId({
        messageIds,
        readAt,
        timelineMessages,
        runtime,
        isMyReadBroadcast,
      });

      logReadSignDebug("receive", {
        roomId,
        messageLogId,
        userId,
        messageIds,
        readAt,
        resolvedLastReadMessageId,
        myUserId: runtime.myUserId,
        isMyReadBroadcast,
        targetMessageId: runtime.targetMessageId,
        catchUpAttempts: runtime.catchUpAttempts,
      });

      if (!isMyReadBroadcast) {
        applySocketRead(roomId, userId, {
          messageIds,
          readAt,
          timelineMessages,
        });
        return;
      }

      const myBroadcastAction = resolveMyReadBroadcastAction({
        runtime,
        broadcastUserId: userId,
        messageIds,
        resolvedLastReadMessageId,
      });

      if (myBroadcastAction.type === "clear_target") {
        logReadSignDebug("receive.my_broadcast.clear_target", {
          roomId,
          resolvedLastReadMessageId,
          messageLogId,
          previousTargetMessageId: runtime.targetMessageId,
        });
        runtime.targetMessageId = null;
        runtime.catchUpAttempts = 0;
        clearReadSignCatchUpTimer(runtime);
        void applyResetRoomUnreadCount(queryClient, roomId);
        return;
      }

      if (myBroadcastAction.type === "schedule_catch_up") {
        logReadSignDebug("receive.my_broadcast.schedule_catch_up", {
          roomId,
          resolvedLastReadMessageId,
          messageLogId,
          targetMessageId: runtime.targetMessageId,
          catchUpAttempts: runtime.catchUpAttempts,
        });
        scheduleReadSignCatchUp();
        return;
      }

      logReadSignDebug("receive.my_broadcast.noop", {
        roomId,
        resolvedLastReadMessageId,
        messageLogId,
        targetMessageId: runtime.targetMessageId,
      });
    },
    [
      applySocketRead,
      queryClient,
      roomId,
      scheduleReadSignCatchUp,
      timelineMessagesRef,
    ]
  );

  const readSign = useCallback<ReadSignFn>(
    (options?: ReadSignOptions) => {
      const runtime = runtimeRef.current;
      const previousTargetMessageId = runtime.targetMessageId;
      runtime.targetMessageId = ensureReadSignTargetMessageId({
        currentTargetMessageId: runtime.targetMessageId,
        upToMessageId: options?.upToMessageId,
        timelineMessages: timelineMessagesRef?.current,
      });
      const upToMessageId = toNumericMessageId(options?.upToMessageId);

      logReadSignDebug("invoke", {
        roomId,
        source: options?.source ?? "unknown",
        upToMessageId,
        previousTargetMessageId,
        nextTargetMessageId: runtime.targetMessageId,
        pageVisible: runtime.pageVisible,
        pending: runtime.pending,
      });

      if (runtime.targetMessageId === null) {
        logReadSignDebug("invoke.skipped", {
          roomId,
          source: options?.source ?? "unknown",
          reason: "missing_target_message_id",
        });
        return;
      }

      if (!token?.accessToken) {
        logReadSignDebug("invoke.skipped", {
          roomId,
          source: options?.source ?? "unknown",
          reason: "missing_token",
        });
        return;
      }

      if (!canSendNow()) {
        runtime.pending = true;
        logReadSignDebug("invoke.deferred", {
          roomId,
          source: options?.source ?? "unknown",
          reason: "cannot_send_now",
          isConnected,
          pageVisible: runtime.pageVisible,
          targetMessageId: runtime.targetMessageId,
        });
        return;
      }

      scheduleReadSignPublish();
    },
    [
      canSendNow,
      isConnected,
      roomId,
      scheduleReadSignPublish,
      timelineMessagesRef,
      token,
    ]
  );

  runtimeRef.current.readSign = readSign;

  useEffect(() => {
    const runtime = runtimeRef.current;

    const handleVisibilityChange = () => {
      runtime.pageVisible = !document.hidden;
      if (runtime.pageVisible && runtime.pending && token?.accessToken) {
        readSign({ source: "visibility-pending" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearReadSignCatchUpTimer(runtime);
    };
  }, [readSign, token?.accessToken]);

  useEffect(() => {
    return () => {
      flushReadSignOnRoomLeave();
    };
  }, [flushReadSignOnRoomLeave, roomId]);

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
    readSign({ source: "reconnect-pending" });
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
