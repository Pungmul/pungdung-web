import type { SocketConnectionStatus, SubscriptionStatus } from "../protocol";

export type TopicReadinessEntry = {
  status: SubscriptionStatus;
  error?: string;
};

type SnapshotValue = {
  connection: SocketConnectionStatus;
  isConnected: boolean;
  topicReadiness: ReadonlyMap<string, TopicReadinessEntry>;
};

export class SocketSnapshotStore {
  private readonly stateSubscriptions = new Set<() => void>();
  private snapshotVersion = 0;
  private cachedSnapshot: { version: number; value: SnapshotValue } | null = null;

  constructor(
    private readonly deps: {
      getConnectionStatus: () => SocketConnectionStatus;
      buildTopicReadinessMap: () => Map<string, TopicReadinessEntry>;
    }
  ) {}

  storeSubscribe = (listener: () => void) => {
    this.stateSubscriptions.add(listener);
    return () => this.stateSubscriptions.delete(listener);
  };

  notifyStateSubscriptions(): void {
    this.snapshotVersion += 1;
    this.cachedSnapshot = null;
    this.stateSubscriptions.forEach((listener) => listener());
  }

  getSnapshot(): SnapshotValue {
    if (
      this.cachedSnapshot &&
      this.cachedSnapshot.version === this.snapshotVersion
    ) {
      return this.cachedSnapshot.value;
    }

    const connection = this.deps.getConnectionStatus();
    const snapshot: SnapshotValue = {
      connection: { ...connection },
      isConnected: connection.isConnected,
      topicReadiness: this.deps.buildTopicReadinessMap(),
    };

    this.cachedSnapshot = {
      version: this.snapshotVersion,
      value: snapshot,
    };

    return snapshot;
  }
}
