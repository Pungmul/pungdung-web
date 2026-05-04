"use client";

import { useEffect, useMemo } from "react";

import {
  useSocketManager,
  useSocketTopicsReady,
} from "@pungdung/worker-socket-bridge/react";

const STUCK_SUBSCRIPTION_RESYNC_MS = 3_000;

export type UseChatRoomMessageSubscriptionParams = {
  roomId: string;
  isConnected: boolean;
};

export function useChatRoomMessageSubscription({
  roomId,
  isConnected,
}: UseChatRoomMessageSubscriptionParams) {
  const socket = useSocketManager();
  const chatMessageTopic = useMemo(
    () => `/sub/chat/message/${roomId}`,
    [roomId]
  );
  const { isReady: isMessageTopicReady } = useSocketTopicsReady([
    chatMessageTopic,
  ]);
  const canSend = isConnected && isMessageTopicReady;

  useEffect(() => {
    if (!isConnected || isMessageTopicReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      void socket.resyncTopics([chatMessageTopic]);
    }, STUCK_SUBSCRIPTION_RESYNC_MS);

    return () => window.clearTimeout(timer);
  }, [chatMessageTopic, isConnected, isMessageTopicReady, socket]);

  return {
    canSend,
    isMessageTopicReady,
    chatMessageTopic,
  };
}
