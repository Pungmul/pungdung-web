"use client";

import type {
  SocketConnectionStatus,
  SubscriptionStatus,
} from "../../protocol";
import { useSocketStoreSelector } from "../lib/create-socket-store-selector";
import { useSocketManagerOptional } from "../SocketManagerProvider";

type TopicStatusEntry = {
  topic: string;
  status: SubscriptionStatus;
  error: string | undefined;
};

type TopicsReadySnapshot = {
  isReady: boolean;
  statuses: TopicStatusEntry[];
};

const DISCONNECTED_SOCKET_STATE: SocketConnectionStatus = {
  phase: "idle",
  isConnected: false,
};

const EMPTY_TOPICS_READY_SNAPSHOT: TopicsReadySnapshot = {
  isReady: false,
  statuses: [],
};

export function useSocketConnection() {
  const socket = useSocketManagerOptional();

  return useSocketStoreSelector({
    socket,
    getSnapshot: (manager) => manager.getConnectionStatus(),
    getServerSnapshot: () => DISCONNECTED_SOCKET_STATE.isConnected,
    selector: (isConnected) => isConnected,
  });
}

export function useSocketConnectionState(): SocketConnectionStatus {
  const socket = useSocketManagerOptional();

  return useSocketStoreSelector({
    socket,
    getSnapshot: (manager) => manager.getSnapshot().connection,
    getServerSnapshot: () => DISCONNECTED_SOCKET_STATE,
    selector: (state) => state,
  });
}

export function useSocketTopicsReady(topics: readonly string[]) {
  const socket = useSocketManagerOptional();

  const isEqual = (
    prev: TopicsReadySnapshot,
    next: TopicsReadySnapshot
  ): boolean => {
    if (
      prev.isReady !== next.isReady ||
      prev.statuses.length !== next.statuses.length
    ) {
      return false;
    }
    for (let index = 0; index < prev.statuses.length; index += 1) {
      const prevEntry = prev.statuses[index];
      const nextEntry = next.statuses[index];
      if (!prevEntry || !nextEntry) {
        return false;
      }
      if (
        prevEntry.topic !== nextEntry.topic ||
        prevEntry.status !== nextEntry.status ||
        prevEntry.error !== nextEntry.error
      ) {
        return false;
      }
    }
    return true;
  };

  return useSocketStoreSelector({
    socket,
    getSnapshot: (manager) => {
      const snapshot = manager.getSnapshot();
      const filteredTopics = topics.filter(Boolean);
      const statuses = filteredTopics.map((topic) => {
        const readiness = snapshot.topicReadiness.get(topic);
        return {
          topic,
          status: readiness?.status ?? "idle",
          error: readiness?.error,
        };
      });
      const isReady =
        filteredTopics.length > 0 &&
        statuses.every((entry) => entry.status === "subscribed");

      return {
        isReady,
        statuses,
      };
    },
    getServerSnapshot: () => EMPTY_TOPICS_READY_SNAPSHOT,
    selector: (state) => state,
    isEqual,
  });
}
