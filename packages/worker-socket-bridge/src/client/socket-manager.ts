import type {
  SocketConfig,
  SocketConnectionStatus,
  SocketListener,
  SubscriptionStatus,
} from "../protocol";
import {
  createSocketBridge,
  type SocketBridge,
} from "../rpc/create-socket-bridge";
import type { CreateSocketRuntimeOptions, SocketRuntime } from "../runtime";

import { ConnectionStatusStore } from "./connection-status-store";
import { SocketConnectionLifecycle } from "./socket-connection";
import {
  type SocketConnectionStateCheck,
  SocketProbe,
} from "./socket-probe";
import { SocketPushHandler } from "./socket-push-handler";
import {
  SocketSnapshotStore,
  type TopicReadinessEntry,
} from "./socket-snapshot";
import { SocketSubscriptions } from "./socket-subscriptions";
import { TopicBuffer } from "./topic-buffer";

export type { SocketConnectionStateCheck } from "./socket-probe";

export type CreateSocketManagerOptions = CreateSocketRuntimeOptions & {
  commandTimeoutMs?: number;
  graceMs?: number;
  maxMessagesPerTopic?: number;
  /** 구독 중인데 inbound MESSAGE가 이 시간 동안 없으면 probe 대상 */
  messageInactivityProbeMs?: number;
  onRuntimeChange?: (mode: SocketRuntime["mode"]) => void;
};

const DEFAULT_COMMAND_TIMEOUT_MS = 30_000;
const DEFAULT_GRACE_MS = 30_000;
const DEFAULT_MAX_MESSAGES_PER_TOPIC = 100;
const DEFAULT_PUBLISH_COMMAND_TIMEOUT_MS = 8_000;

export class SocketManager {
  private readonly connectionStatusStore: ConnectionStatusStore;
  private bridge: SocketBridge;
  private readonly managerOptions: CreateSocketManagerOptions;
  private readonly topicBuffer: TopicBuffer;
  private transportFailureHandler: ((error: unknown) => void) | null = null;
  private readonly subscriptions: SocketSubscriptions;
  private readonly snapshotStore: SocketSnapshotStore;
  private readonly probe: SocketProbe;
  private readonly pushHandler: SocketPushHandler;
  private readonly connection: SocketConnectionLifecycle;

  constructor(options: CreateSocketManagerOptions = {}) {
    this.managerOptions = options;
    this.topicBuffer = new TopicBuffer({
      graceMs: options.graceMs ?? DEFAULT_GRACE_MS,
      maxMessagesPerTopic:
        options.maxMessagesPerTopic ?? DEFAULT_MAX_MESSAGES_PER_TOPIC,
    });

    let snapshotStore: SocketSnapshotStore;
    this.connectionStatusStore = new ConnectionStatusStore(
      { phase: "idle", isConnected: false },
      () => snapshotStore.notifyStateSubscriptions()
    );
    this.subscriptions = new SocketSubscriptions({
      topicBuffer: this.topicBuffer,
      hasRuntime: () => this.connection.hasRuntime(),
      invokeSubscribe: async (topic) => {
        await this.bridge.invoke("SUBSCRIBE", { topic });
      },
      postUnsubscribe: (topic) => this.bridge.post("UNSUBSCRIBE", { topic }),
      onStateChanged: () => snapshotStore.notifyStateSubscriptions(),
      touchInboundMessageActivity: () => this.probe.touchInboundMessageActivity(),
    });
    this.snapshotStore = snapshotStore = new SocketSnapshotStore({
      getConnectionStatus: () => this.connectionStatusStore.get(),
      buildTopicReadinessMap: () => this.subscriptions.buildTopicReadinessMap(),
    });
    this.probe = new SocketProbe({
      getRuntimeMode: () => this.connection.getRuntimeMode(),
      hasRuntime: () => this.connection.hasRuntime(),
      invokePingCommand: () => this.bridge.invoke("PING"),
      getConnectionStatus: () => this.connectionStatusStore.get(),
      updateConnectionStatus: (status) => this.connectionStatusStore.update(status),
      getLastConnectConfig: () => this.connection.getLastConnectConfig(),
      getListenerTopicSize: () => this.subscriptions.getListenerTopicSize(),
      getMessageInactivityProbeMs: () => this.managerOptions.messageInactivityProbeMs,
    });
    this.connection = new SocketConnectionLifecycle({
      managerOptions: this.managerOptions,
      invokeCommand: (command, payload) =>
        command === "CONNECT"
          ? this.bridge.invoke("CONNECT", payload as SocketConfig)
          : this.bridge.invoke("SUBSCRIBE", payload as { topic: string }),
      postDisconnect: () => this.bridge.post("DISCONNECT"),
      rejectAllPendingRpc: (error) => this.bridge.rejectAll(error),
      getPendingRpcSize: () => this.bridge.pending.size(),
      getConnectionStatus: () => this.connectionStatusStore.get(),
      setConnectionStatusSilently: (status) =>
        this.connectionStatusStore.setSilently(status),
      updateConnectionStatus: (status) => this.connectionStatusStore.update(status),
      subscriptions: this.subscriptions,
      probe: this.probe,
      topicBufferClear: () => this.topicBuffer.clear(),
      onStateChanged: () => this.snapshotStore.notifyStateSubscriptions(),
      onRuntimeReady: (runtime) => this.attachRuntimeHandler(runtime),
    });
    this.pushHandler = new SocketPushHandler({
      subscriptions: this.subscriptions,
      getConnectionStatus: () => this.connectionStatusStore.get(),
      updateConnectionStatus: (status) => this.connectionStatusStore.update(status),
      touchConnectedActivity: () => this.probe.touchConnectedActivity(),
      markProbeHealthyNow: () => this.probe.markProbeHealthyNow(),
      invalidateTransportProbeCache: () => this.probe.invalidateTransportProbeCache(),
      onTransportRecoveryRequired: (signal) =>
        this.notifyTransportFailure(signal),
      onStateChanged: () => this.snapshotStore.notifyStateSubscriptions(),
    });
    this.bridge = createSocketBridge({
      dispatch: (envelope) => {
        const runtime = this.connection.getRuntime();
        if (!runtime) {
          throw new Error("Socket runtime is not initialized");
        }
        return runtime.dispatch(envelope);
      },
      onPush: (response) => {
        this.pushHandler.handlePush(response);
      },
      commandTimeoutMs: options.commandTimeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS,
    });
  }

  getRuntimeMode(): SocketRuntime["mode"] | null { return this.connection.getRuntimeMode(); }
  setTransportFailureHandler(handler: ((error: unknown) => void) | null): void { this.transportFailureHandler = handler; }

  private notifyTransportFailure(error: unknown): void {
    this.transportFailureHandler?.(error);
  }

  private handleTransportFailure(error: unknown): void {
    if (this.connectionStatusStore.get().isConnected) {
      this.connectionStatusStore.update({
        phase: "disconnected",
        isConnected: false,
      });
    }
    this.probe.invalidateTransportProbeCache();
    this.notifyTransportFailure(error);
  }

  getMessageInactivityMs(): number | null { return this.probe.getMessageInactivityMs(); }

  shouldProbeForMessageInactivity(thresholdMs?: number): boolean {
    return thresholdMs === undefined
      ? this.probe.shouldProbeForMessageInactivity()
      : this.probe.shouldProbeForMessageInactivity(thresholdMs);
  }

  async checkConnectionState(timeoutMs?: number): Promise<SocketConnectionStateCheck> {
    return this.probe.checkConnectionState(timeoutMs);
  }

  async probeWorkerAlive(timeoutMs?: number): Promise<boolean> {
    return this.probe.probeWorkerAlive(timeoutMs);
  }

  async probeConnectionAlive(timeoutMs?: number): Promise<boolean> {
    return this.probe.probeConnectionAlive(timeoutMs);
  }

  async ensureWorkerAlive(timeoutMs?: number): Promise<void> {
    if (await this.probeWorkerAlive(timeoutMs)) {
      return;
    }
    this.connection.recreateRuntime();
  }

  async connect(config: SocketConfig, options: { skipConnectedProbe?: boolean } = {}): Promise<void> {
    return this.connection.connect(config, options);
  }

  async ensureConnected(config?: SocketConfig): Promise<void> {
    return this.connection.ensureConnected(config);
  }

  async forceReconnect(config: SocketConfig): Promise<void> {
    return this.connection.forceReconnect(config);
  }

  async forceRecreateRuntime(config: SocketConfig): Promise<void> {
    return this.connection.forceRecreateRuntime(config);
  }

  async subscribe(topic: string, callback: (data: unknown) => void): Promise<SocketListener> {
    return this.subscriptions.subscribe(topic, callback);
  }

  async resyncTopics(topics: readonly string[]): Promise<void> {
    return this.subscriptions.resyncTopics(topics);
  }

  async publish(topic: string, message: unknown): Promise<void> {
    return this.probe.publishWithGuard(
      this.bridge.invoke("SEND_MESSAGE", { topic, message }),
      DEFAULT_PUBLISH_COMMAND_TIMEOUT_MS,
      "SEND_MESSAGE",
      (error) => this.handleTransportFailure(error)
    );
  }

  sendMessage(topic: string, message: unknown): void {
    void this.publish(topic, message).catch((publishError) => {
      console.error("Socket publish failed", publishError);
    });
  }

  disconnect(): void {
    this.connection.disconnect();
  }

  getConnectionStatus(): boolean {
    return this.connectionStatusStore.get().isConnected;
  }

  getTopicStatus(topic: string): SubscriptionStatus { return this.subscriptions.getTopicStatus(topic); }
  getTopicError(topic: string): string | undefined { return this.subscriptions.getTopicError(topic); }
  storeSubscribe = (listener: () => void) => this.snapshotStore.storeSubscribe(listener);

  getSnapshot(): { connection: SocketConnectionStatus; isConnected: boolean; topicReadiness: ReadonlyMap<string, TopicReadinessEntry> } {
    return this.snapshotStore.getSnapshot();
  }

  private attachRuntimeHandler(runtime: SocketRuntime | null): void {
    runtime?.setMessageHandler((response) => {
      this.bridge.handleResponse(response);
    });
  }
}
