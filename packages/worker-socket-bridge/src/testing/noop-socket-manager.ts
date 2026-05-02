import type { CreateSocketManagerOptions } from "../client/socket-manager";
import type {
  SocketConfig,
  SocketConnectionStatus,
  SocketListener,
  SubscriptionStatus,
} from "../protocol";
import type { SocketConnectionStateCheck } from "../client/socket-probe";
import type { TopicReadinessEntry } from "../client/socket-snapshot";
import type { SocketRuntime } from "../runtime";

const DISCONNECTED_CONNECTION: SocketConnectionStatus = {
  phase: "idle",
  isConnected: false,
};

const noopListener: SocketListener = {
  topic: "",
  async unsubscribe() {},
};

/**
 * 앱/통합 테스트에서 worker·STOMP 없이 import만 통과시키기 위한 SocketManager 대체 구현.
 * 프로덕션 번들에는 포함하지 말고 `@pungdung/worker-socket-bridge/testing` subpath만 사용한다.
 */
export class NoopSocketManager {
  constructor(_options: CreateSocketManagerOptions = {}) {
    void _options;
  }

  getRuntimeMode(): SocketRuntime["mode"] | null {
    return null;
  }

  setTransportFailureHandler(_handler: ((error: unknown) => void) | null): void {}

  getMessageInactivityMs(): number | null {
    return null;
  }

  shouldProbeForMessageInactivity(_thresholdMs?: number): boolean {
    return false;
  }

  async checkConnectionState(
    _timeoutMs?: number
  ): Promise<SocketConnectionStateCheck> {
    return {
      healthy: false,
      workerAlive: false,
      stompConnected: false,
      webSocketOpen: false,
      webSocketReadyState: null,
      serverActivityStale: false,
      clientConnected: false,
    };
  }

  async probeWorkerAlive(_timeoutMs?: number): Promise<boolean> {
    return true;
  }

  async probeConnectionAlive(_timeoutMs?: number): Promise<boolean> {
    return false;
  }

  async ensureWorkerAlive(_timeoutMs?: number): Promise<void> {}

  async connect(
    _config: SocketConfig,
    _options: { skipConnectedProbe?: boolean } = {}
  ): Promise<void> {}

  async ensureConnected(_config?: SocketConfig): Promise<void> {}

  async forceReconnect(_config: SocketConfig): Promise<void> {}

  async forceRecreateRuntime(_config: SocketConfig): Promise<void> {}

  async subscribe(
    _topic: string,
    _callback: (data: unknown) => void
  ): Promise<SocketListener> {
    return noopListener;
  }

  async resyncTopics(_topics: readonly string[]): Promise<void> {}

  async publish(_topic: string, _message: unknown): Promise<void> {}

  sendMessage(_topic: string, _message: unknown): void {}

  disconnect(): void {}

  getConnectionStatus(): boolean {
    return false;
  }

  getTopicStatus(_topic: string): SubscriptionStatus {
    return "idle";
  }

  getTopicError(_topic: string): string | undefined {
    return undefined;
  }

  storeSubscribe = (_listener: () => void) => () => {};

  getSnapshot(): {
    connection: SocketConnectionStatus;
    isConnected: boolean;
    topicReadiness: ReadonlyMap<string, TopicReadinessEntry>;
  } {
    return {
      connection: DISCONNECTED_CONNECTION,
      isConnected: false,
      topicReadiness: new Map(),
    };
  }
}
