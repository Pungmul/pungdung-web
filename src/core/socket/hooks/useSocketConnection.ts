import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector"
import { sharedSocketManager } from "../SharedSocketManager"
import { SocketConnectionStatus } from "../types";

type TopicStatusEntry = {
  topic: string;
  status: ReturnType<typeof sharedSocketManager.getTopicStatus>;
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

/**
 * 
 * @returns 웹 소켓에 연결되어 구독을 받을 준비가 된 상태를 반환합니다.
 */
export function useSocketConnection() {
    return useSyncExternalStoreWithSelector(
        (callback) => sharedSocketManager.storeSubscribe(callback),
        () => sharedSocketManager.getConnectionStatus(),
        () => false,
        (state) => state,
    );
}

export function useSocketConnectionState(): SocketConnectionStatus {
  return useSyncExternalStoreWithSelector(
    (callback) => sharedSocketManager.storeSubscribe(callback),
    () => sharedSocketManager.getSnapshot().connection,
    () => DISCONNECTED_SOCKET_STATE,
    (state) => state
  );
}

export function useSocketTopicsReady(topics: readonly string[]) {
  const isEqual = (prev: TopicsReadySnapshot, next: TopicsReadySnapshot): boolean => {
    if (prev.isReady !== next.isReady || prev.statuses.length !== next.statuses.length) {
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

  return useSyncExternalStoreWithSelector(
    (callback) => sharedSocketManager.storeSubscribe(callback),
    () => {
      const snapshot = sharedSocketManager.getSnapshot();
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
    () => EMPTY_TOPICS_READY_SNAPSHOT,
    (state) => state,
    isEqual
  );
}