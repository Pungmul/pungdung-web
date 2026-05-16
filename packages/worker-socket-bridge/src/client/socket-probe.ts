import { isRuntimeTransportHealthy } from "../../stomp/connection-probe";
import type {
  PongPayload,
  SocketConfig,
  SocketConnectionStatus,
} from "../protocol";

export type SocketConnectionStateCheck = {
  healthy: boolean;
  workerAlive: boolean;
  stompConnected: boolean;
  webSocketOpen: boolean;
  webSocketReadyState: number | null;
  serverActivityStale: boolean;
  clientConnected: boolean;
};

const DEFAULT_WORKER_PING_TIMEOUT_MS = 1_000;
const DEFAULT_MESSAGE_INACTIVITY_PROBE_MS = 3 * 60_000;
const DEFAULT_TRANSPORT_PROBE_CACHE_MS = 15_000;
const SOCKET_TRANSPORT_PROBE_FAILED = "Socket transport probe failed";

export class SocketProbe {
  private lastInboundMessageAt: number | null = null;
  private lastConnectedAt: number | null = null;
  private lastProbeHealthyAt: number | null = null;

  constructor(
    private readonly deps: {
      getRuntimeMode: () => string | null;
      hasRuntime: () => boolean;
      invokePingCommand: () => Promise<unknown>;
      getConnectionStatus: () => SocketConnectionStatus;
      updateConnectionStatus: (status: SocketConnectionStatus) => void;
      getLastConnectConfig: () => SocketConfig | null;
      getListenerTopicSize: () => number;
      getMessageInactivityProbeMs: () => number | undefined;
    }
  ) {}

  withTimeout<T>(task: Promise<T>, timeoutMs: number, label: string): Promise<T> {
    return Promise.race([
      task,
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
          timeoutMs
        );
      }),
    ]);
  }

  invalidateTransportProbeCache(): void {
    this.lastProbeHealthyAt = null;
  }

  markProbeHealthyNow(): void {
    this.lastProbeHealthyAt = Date.now();
  }

  touchInboundMessageActivity(): void {
    this.lastInboundMessageAt = Date.now();
  }

  touchConnectedActivity(): void {
    this.lastConnectedAt = Date.now();
  }

  resetActivity(): void {
    this.lastInboundMessageAt = null;
    this.lastConnectedAt = null;
  }

  async invokePing(
    timeoutMs: number = DEFAULT_WORKER_PING_TIMEOUT_MS
  ): Promise<PongPayload | undefined> {
    if (!this.deps.hasRuntime()) {
      throw new Error("Socket runtime is not initialized");
    }

    const response = await this.withTimeout(
      this.deps.invokePingCommand(),
      timeoutMs,
      "Worker ping"
    );
    return response as PongPayload | undefined;
  }

  syncConnectionStatusFromProbe(pong?: PongPayload): void {
    if (!pong) {
      return;
    }

    const connectionStatus = this.deps.getConnectionStatus();
    const runtimeHealthy = isRuntimeTransportHealthy(pong);
    if (connectionStatus.isConnected === runtimeHealthy) {
      return;
    }

    this.deps.updateConnectionStatus({
      phase: runtimeHealthy ? "connected" : (pong.phase ?? "disconnected"),
      isConnected: runtimeHealthy,
    });
  }

  private resolveRuntimeHealth(pong?: PongPayload): {
    stompConnected: boolean;
    webSocketOpen: boolean;
    webSocketReadyState: number | null;
    serverActivityStale: boolean;
    runtimeHealthy: boolean;
  } {
    const stompConnected = pong?.isStompConnected === true;
    const webSocketOpen = pong?.isWebSocketOpen === true;
    const webSocketReadyState = pong?.webSocketReadyState ?? null;
    const serverActivityStale = pong?.isServerActivityStale === true;
    const runtimeHealthy = pong ? isRuntimeTransportHealthy(pong) : false;

    return {
      stompConnected,
      webSocketOpen,
      webSocketReadyState,
      serverActivityStale,
      runtimeHealthy,
    };
  }

  private handleProbeTransportFailure(): void {
    const connectionStatus = this.deps.getConnectionStatus();
    if (connectionStatus.isConnected) {
      this.deps.updateConnectionStatus({
        phase: "disconnected",
        isConnected: false,
      });
    }
    this.invalidateTransportProbeCache();
  }

  async checkConnectionState(
    timeoutMs: number = DEFAULT_WORKER_PING_TIMEOUT_MS
  ): Promise<SocketConnectionStateCheck> {
    if (!this.deps.hasRuntime()) {
      const result: SocketConnectionStateCheck = {
        healthy: false,
        workerAlive: false,
        stompConnected: false,
        webSocketOpen: false,
        webSocketReadyState: null,
        serverActivityStale: false,
        clientConnected: false,
      };
      return result;
    }

    try {
      const pong = await this.invokePing(timeoutMs);
      this.syncConnectionStatusFromProbe(pong);
      const connectionStatus = this.deps.getConnectionStatus();
      const runtime = this.resolveRuntimeHealth(pong);
      const healthy =
        connectionStatus.isConnected && runtime.runtimeHealthy === true;

      if (healthy) {
        this.markProbeHealthyNow();
      } else {
        this.invalidateTransportProbeCache();
      }

      const result: SocketConnectionStateCheck = {
        healthy,
        workerAlive: true,
        stompConnected: runtime.stompConnected,
        webSocketOpen: runtime.webSocketOpen,
        webSocketReadyState: runtime.webSocketReadyState,
        serverActivityStale: runtime.serverActivityStale,
        clientConnected: connectionStatus.isConnected,
      };
      return result;
    } catch {
      this.handleProbeTransportFailure();
      const result: SocketConnectionStateCheck = {
        healthy: false,
        workerAlive: false,
        stompConnected: false,
        webSocketOpen: false,
        webSocketReadyState: null,
        serverActivityStale: false,
        clientConnected: this.deps.getConnectionStatus().isConnected,
      };
      return result;
    }
  }

  async probeWorkerAlive(
    timeoutMs: number = DEFAULT_WORKER_PING_TIMEOUT_MS
  ): Promise<boolean> {
    try {
      await this.invokePing(timeoutMs);
      return true;
    } catch {
      return false;
    }
  }

  async probeConnectionAlive(
    timeoutMs: number = DEFAULT_WORKER_PING_TIMEOUT_MS
  ): Promise<boolean> {
    try {
      const pong = await this.invokePing(timeoutMs);
      this.syncConnectionStatusFromProbe(pong);
      const connectionStatus = this.deps.getConnectionStatus();
      const runtime = this.resolveRuntimeHealth(pong);
      const healthy =
        connectionStatus.isConnected && runtime.runtimeHealthy === true;
      return healthy;
    } catch {
      this.handleProbeTransportFailure();
      return false;
    }
  }

  async probeBeforePublish(): Promise<void> {
    if (!this.deps.hasRuntime()) {
      throw new Error("Socket is not connected");
    }

    if (!this.deps.getLastConnectConfig()) {
      throw new Error("Socket is not connected");
    }

    const now = Date.now();
    const connectionStatus = this.deps.getConnectionStatus();
    if (
      this.lastProbeHealthyAt !== null &&
      now - this.lastProbeHealthyAt < DEFAULT_TRANSPORT_PROBE_CACHE_MS &&
      connectionStatus.isConnected
    ) {
      return;
    }

    if (await this.probeConnectionAlive()) {
      this.lastProbeHealthyAt = now;
      return;
    }

    this.invalidateTransportProbeCache();
    throw new Error(SOCKET_TRANSPORT_PROBE_FAILED);
  }

  isTransportProbeFailure(error: unknown): boolean {
    return (
      error instanceof Error && error.message === SOCKET_TRANSPORT_PROBE_FAILED
    );
  }

  async publishWithGuard(
    task: Promise<unknown>,
    timeoutMs: number,
    label: string,
    onTransportProbeFailure: (error: unknown) => void
  ): Promise<void> {
    try {
      await this.probeBeforePublish();
      await this.withTimeout(task, timeoutMs, label);
    } catch (error) {
      if (this.isTransportProbeFailure(error)) {
        onTransportProbeFailure(error);
      }
      throw error;
    }
  }

  getMessageInactivityMs(): number | null {
    const connectionStatus = this.deps.getConnectionStatus();
    if (!connectionStatus.isConnected) {
      return null;
    }
    if (this.deps.getListenerTopicSize() === 0) {
      return null;
    }

    const reference = this.lastInboundMessageAt ?? this.lastConnectedAt;
    if (reference === null) {
      return null;
    }

    return Date.now() - reference;
  }

  shouldProbeForMessageInactivity(
    thresholdMs: number = this.deps.getMessageInactivityProbeMs() ??
      DEFAULT_MESSAGE_INACTIVITY_PROBE_MS
  ): boolean {
    const inactivityMs = this.getMessageInactivityMs();
    return inactivityMs !== null && inactivityMs >= thresholdMs;
  }
}
