import type { SocketConfig, SocketConnectionStatus } from "../protocol";
import {
  type CreateSocketRuntimeOptions,
  createSocketRuntimeWithFallback,
  type SocketRuntime,
  type SocketRuntimeFallbackController,
} from "../runtime";

import type { SocketProbe } from "./socket-probe";
import type { SocketSubscriptions } from "./socket-subscriptions";

const MAX_CONNECT_ATTEMPTS = 3;
const CONNECT_RETRY_DELAY_MS = 500;

type ConnectOptions = {
  skipConnectedProbe?: boolean;
};

export class SocketConnectionLifecycle {
  private runtime: SocketRuntime | null = null;
  private runtimeController: SocketRuntimeFallbackController | null = null;
  private connectPromise: Promise<void> | null = null;
  private lastConnectConfig: SocketConfig | null = null;
  private shouldResyncSubscriptionsOnConnect = false;

  constructor(
    private readonly deps: {
      managerOptions: CreateSocketRuntimeOptions & {
        onRuntimeChange?: (mode: SocketRuntime["mode"]) => void;
      };
      invokeCommand: (
        command: "CONNECT" | "SUBSCRIBE",
        payload: SocketConfig | { topic: string }
      ) => Promise<unknown>;
      postDisconnect: () => void;
      rejectAllPendingRpc: (error: Error | unknown) => void;
      getPendingRpcSize: () => number;
      getConnectionStatus: () => SocketConnectionStatus;
      setConnectionStatusSilently: (status: SocketConnectionStatus) => void;
      updateConnectionStatus: (status: SocketConnectionStatus) => void;
      subscriptions: SocketSubscriptions;
      probe: SocketProbe;
      topicBufferClear: () => void;
      onStateChanged: () => void;
      onRuntimeReady: (runtime: SocketRuntime | null) => void;
    }
  ) {
    this.initRuntimeController();
  }

  getRuntime(): SocketRuntime | null {
    return this.runtime;
  }

  getRuntimeMode(): SocketRuntime["mode"] | null {
    return this.runtime?.mode ?? null;
  }

  getLastConnectConfig(): SocketConfig | null {
    return this.lastConnectConfig;
  }

  hasRuntime(): boolean {
    return this.runtime !== null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  initRuntimeController(): void {
    this.runtimeController = createSocketRuntimeWithFallback({
      ...this.deps.managerOptions,
      onRuntimeChange: (mode) => {
        this.deps.managerOptions.onRuntimeChange?.(mode);
      },
    });
    this.runtime = this.runtimeController.runtime;
    this.deps.onRuntimeReady(this.runtime);
  }

  recreateRuntime(): void {
    this.runtime?.dispose();
    this.runtime = null;
    this.runtimeController = null;
    this.deps.rejectAllPendingRpc(new Error("Socket runtime recreated"));
    this.initRuntimeController();
    this.shouldResyncSubscriptionsOnConnect = true;
    this.connectPromise = null;
    this.deps.probe.resetActivity();
    this.deps.probe.invalidateTransportProbeCache();
    this.deps.setConnectionStatusSilently({
      phase: "disconnected",
      isConnected: false,
    });
  }

  private async resyncActiveSubscriptions(): Promise<void> {
    const topics = this.deps.subscriptions.getActiveTopics();

    await Promise.all(
      topics.map(async (topic) => {
        this.deps.subscriptions.markTopicPending(topic);

        try {
          await this.deps.invokeCommand("SUBSCRIBE", { topic });
          this.deps.subscriptions.flushMessageBuffer(topic);
        } catch (resyncError) {
          console.error(
            `Socket subscription resync failed for ${topic}`,
            resyncError
          );
        }
      })
    );

    this.deps.onStateChanged();
  }

  private async connectAndResyncIfNeeded(config: SocketConfig): Promise<void> {
    await this.deps.invokeCommand("CONNECT", config);

    if (!this.shouldResyncSubscriptionsOnConnect) {
      return;
    }

    this.shouldResyncSubscriptionsOnConnect = false;
    await this.resyncActiveSubscriptions();
  }

  async connect(config: SocketConfig, options: ConnectOptions = {}): Promise<void> {
    this.lastConnectConfig = config;

    if (
      !options.skipConnectedProbe &&
      this.runtime &&
      this.deps.getConnectionStatus().isConnected
    ) {
      if (await this.deps.probe.probeConnectionAlive()) {
        this.deps.probe.markProbeHealthyNow();
        return;
      }
      return this.forceReconnect(config);
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }


    const connectTask = (async () => {
      this.deps.updateConnectionStatus({ phase: "connecting", isConnected: false });

      let attempts = 0;
      while (this.runtimeController && attempts < MAX_CONNECT_ATTEMPTS) {
        attempts += 1;
        try {
          await this.connectAndResyncIfNeeded(config);
          this.deps.probe.markProbeHealthyNow();
          return;
        } catch (error) {
          const nextRuntime = this.runtimeController.tryNextRuntime();
          if (!nextRuntime) {
            this.recreateRuntime();
            if (attempts >= MAX_CONNECT_ATTEMPTS) {
              throw error;
            }
            await this.delay(CONNECT_RETRY_DELAY_MS * attempts);
            continue;
          }
          this.runtime = nextRuntime;
          this.deps.onRuntimeReady(this.runtime);
          this.deps.rejectAllPendingRpc(error);
          this.shouldResyncSubscriptionsOnConnect = true;
        }
      }

      throw new Error("Socket runtime is not available");
    })();

    const trackedConnect = connectTask.then(
      (result) => {
        this.connectPromise = null;
        return result;
      },
      (error: unknown) => {
        this.connectPromise = null;
        throw error;
      }
    );

    this.connectPromise = trackedConnect;
    return trackedConnect;
  }

  async ensureConnected(config?: SocketConfig): Promise<void> {
    const connectConfig = config ?? this.lastConnectConfig;
    if (!connectConfig) {
      return;
    }

    this.lastConnectConfig = connectConfig;

    if (this.connectPromise) {
      return this.connectPromise;
    }

    if (this.deps.getConnectionStatus().isConnected) {
      if (await this.deps.probe.probeConnectionAlive()) {
        return;
      }
      return this.forceReconnect(connectConfig);
    }

    return this.connect(connectConfig, { skipConnectedProbe: true });
  }

  async forceReconnect(config: SocketConfig): Promise<void> {
    this.lastConnectConfig = config;
    if (this.connectPromise) {
      return this.connectPromise;
    }


    if (!this.runtime) {
      this.initRuntimeController();
    }

    if (this.runtime) {
      this.deps.postDisconnect();
      this.deps.updateConnectionStatus({ phase: "reconnecting", isConnected: false });
      this.shouldResyncSubscriptionsOnConnect = true;
    }

    return this.connect(config, { skipConnectedProbe: true });
  }

  async forceRecreateRuntime(config: SocketConfig): Promise<void> {
    this.lastConnectConfig = config;
    if (this.connectPromise) {
      return this.connectPromise;
    }
    this.recreateRuntime();
    return this.connect(config, { skipConnectedProbe: true });
  }

  disconnect(): void {
    if (this.runtime) {
      this.deps.postDisconnect();
      this.runtime.dispose();
    }

    this.deps.updateConnectionStatus({ phase: "disconnected", isConnected: false });
    this.deps.subscriptions.clearAll();
    this.deps.rejectAllPendingRpc(new Error("Socket disconnected"));
    this.deps.topicBufferClear();
    this.connectPromise = null;
    this.runtime = null;
    this.runtimeController = null;
    this.deps.probe.resetActivity();
    this.deps.probe.invalidateTransportProbeCache();
    this.initRuntimeController();
    this.deps.onStateChanged();
  }
}
