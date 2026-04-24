import {
  SocketConnectionPhase,
  SocketConnectionStatus,
  SocketConfig,
  SocketSubscriptionStatus,
  Subscription,
  WorkerMessage,
  WorkerPublishedPayload,
  WorkerResponseType,
  WorkerSubscriptionStatePayload,
  WorkerResponse,
} from "./types";

type PendingCommand = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  timeout: NodeJS.Timeout;
  type: WorkerMessage["type"];
  topic: string | undefined;
};

export class SharedSocketManager {
  private static instance: SharedSocketManager;
  private worker: SharedWorker | Worker | null = null;
  private port: MessagePort | null = null;
  private subscriptions = new Map<
    string,
    Map<string, (data: unknown) => void>
  >();
  private pendingSubscriptions = new Set<string>();
  private pendingCommands = new Map<string, PendingCommand>();
  private connectionStatus: SocketConnectionStatus = {
    phase: "idle",
    isConnected: false,
  };
  private topicReadiness = new Map<
    string,
    { status: SocketSubscriptionStatus; error?: string }
  >();
  private isSharedWorkerSupported: boolean;
  private workerMode: "shared" | "dedicated" = "dedicated";
  private readonly COMMAND_TIMEOUT = 30000;
  private connectPromise: Promise<void> | null = null;

  private stateSubscriptions = new Set<() => void>();
  private snapshotVersion = 0;
  private cachedSnapshot:
    | {
        version: number;
        value: {
          connection: SocketConnectionStatus;
          isConnected: boolean;
          topicReadiness: ReadonlyMap<
            string,
            { status: SocketSubscriptionStatus; error?: string }
          >;
        };
      }
    | null = null;

  private constructor() {
    this.isSharedWorkerSupported = typeof SharedWorker !== "undefined";
  }

  static getInstance(): SharedSocketManager {
    if (!SharedSocketManager.instance) {
      SharedSocketManager.instance = new SharedSocketManager();
    }
    return SharedSocketManager.instance;
  }

  async connect(config: SocketConfig): Promise<void> {
    if (this.worker && this.connectionStatus.isConnected) {
      return;
    }
    if (
      this.worker &&
      this.port &&
      (this.connectionStatus.phase === "connecting" ||
        this.connectionStatus.phase === "reconnecting")
    ) {
      return this.connectPromise ?? this.sendCommand("CONNECT", config).then(() => undefined);
    }
    if (this.connectPromise) {
      return this.connectPromise;
    }

    const tryConnect = async (useSharedWorker: boolean): Promise<void> => {
      this.workerMode = useSharedWorker ? "shared" : "dedicated";
      this.worker = useSharedWorker
        ? new SharedWorker("/socket-worker.js")
        : new Worker("/dedicated-worker.js");
      this.port =
        useSharedWorker
          ? (this.worker as SharedWorker).port
          : (this.worker as unknown as MessagePort);

      if (!this.port) {
        throw new Error("Worker port initialization failed");
      }

      this.port.addEventListener("message", (event: MessageEvent) => {
        const response = event.data as WorkerResponse;
        const { type, data, error, commandId } = response;
        this.handleWorkerResponse(type, data, error, commandId);
      });

      if (useSharedWorker) {
        (this.port as MessagePort).start();
      }

      this.updateConnectionStatus({ phase: "connecting", isConnected: false });
      await this.sendCommand("CONNECT", config);
      this.flushPendingSubscriptions();
    };

    const cleanupWorker = () => {
      if (this.worker && "terminate" in this.worker) {
        (this.worker as Worker).terminate();
      }
      this.worker = null;
      this.port = null;
      this.updateConnectionStatus({
        phase: "disconnected",
        isConnected: false,
      });
    };

    const connectTask = (async () => {
      try {
        if (this.isSharedWorkerSupported) {
          try {
            await tryConnect(true);
          } catch {
            cleanupWorker();
            await tryConnect(false);
          }
        } else {
          await tryConnect(false);
        }
      } catch (error) {
        cleanupWorker();
        throw error;
      }
    })();

    this.connectPromise = connectTask.finally(() => {
      this.connectPromise = null;
    });

    return this.connectPromise;
  }

  async subscribe(
    topic: string,
    callback: (data: unknown) => void
  ): Promise<Subscription> {
    const callbackId = crypto.randomUUID();

    let callbacks = this.subscriptions.get(topic);
    const isFirstSubscriber = !callbacks || callbacks.size === 0;

    if (!callbacks) {
      callbacks = new Map<string, (data: unknown) => void>();
      this.subscriptions.set(topic, callbacks);
    }

    callbacks.set(callbackId, callback);

    if (isFirstSubscriber) {
      this.topicReadiness.set(topic, { status: "pending" });
      this.notifyStateSubscriptions();

      if (this.port) {
        await this.sendCommand("SUBSCRIBE", { topic });
      } else {
        callbacks.delete(callbackId);
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
          this.topicReadiness.delete(topic);
          this.notifyStateSubscriptions();
        }
        throw new Error("Socket worker is not initialized");
      }
    }

    return { topic, id: callbackId };
  }

  async unsubscribe(subscription: Subscription): Promise<void> {
    this.pendingSubscriptions.delete(subscription.topic);
    this.topicReadiness.delete(subscription.topic);
    const callbacks = this.subscriptions.get(subscription.topic);

    if (!callbacks) {
      return;
    }

    if (callbacks.has(subscription.id)) {
      callbacks.delete(subscription.id);
      // 남은 구독자가 없으면 실제로 해제
      if (callbacks.size === 0) {
        this.subscriptions.delete(subscription.topic);
        if (this.port) {
          this.port.postMessage({
            type: "UNSUBSCRIBE",
            data: { topic: subscription.topic },
          } as WorkerMessage);
        }
      }
      return;
    }

    this.subscriptions.delete(subscription.topic);
    if (this.port) {
      this.port.postMessage({
        type: "UNSUBSCRIBE",
        data: { topic: subscription.topic },
      } as WorkerMessage);
    }
  }

  async publish(topic: string, message: unknown): Promise<void> {
    if (!this.port) {
      throw new Error("Socket is not connected");
    }

    await this.sendCommand("SEND_MESSAGE", { topic, message });
  }

  sendMessage(topic: string, message: unknown): void {
    if (!this.connectionStatus.isConnected) {
      throw new Error("Socket is not connected");
    }

    void this.publish(topic, message).catch((publishError) => {
      console.error("Socket publish failed", publishError);
    });
  }

  disconnect(): void {
    if (this.port) {
      const disconnectCommandId = crypto.randomUUID();
      this.port.postMessage({
        type: "DISCONNECT",
        commandId: disconnectCommandId,
      } as WorkerMessage);
    }

    this.connectionStatus = { phase: "disconnected", isConnected: false };
    this.subscriptions.clear();
    this.topicReadiness.clear();
    this.pendingSubscriptions.clear();
    this.pendingCommands.forEach((pending) => {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Socket disconnected"));
    });
    this.pendingCommands.clear();
    this.port = null;
    this.worker = null;
    this.connectPromise = null;
    this.workerMode = "dedicated";
    this.notifyStateSubscriptions();
  }

  getConnectionStatus(): boolean {
    return this.connectionStatus.isConnected;
  }

  getConnectionPhase(): SocketConnectionPhase {
    return this.connectionStatus.phase;
  }

  getTopicStatus(topic: string): SocketSubscriptionStatus {
    return this.topicReadiness.get(topic)?.status ?? "idle";
  }

  getTopicError(topic: string): string | undefined {
    return this.topicReadiness.get(topic)?.error;
  }

  areTopicsReady(topics: string[]): boolean {
    if (topics.length === 0) {
      return false;
    }
    return topics.every((topic) => this.getTopicStatus(topic) === "subscribed");
  }

  getWorkerType(): "shared" | "dedicated" {
    return this.workerMode;
  }

  getSubscriptionCount(): number {
    let count = 0;
    this.subscriptions.forEach((set) => (count += set.size));
    return count;
  }

  private flushPendingSubscriptions(): void {
    if (!this.port || this.pendingSubscriptions.size === 0) {
      return;
    }

    const topics = Array.from(this.pendingSubscriptions);
    this.pendingSubscriptions.clear();
    topics.forEach((topic) => {
      void this.sendCommand("SUBSCRIBE", { topic }).then(
        () => undefined,
        (subscriptionError) => {
          this.topicReadiness.set(topic, {
            status: "error",
            error:
              subscriptionError instanceof Error
                ? subscriptionError.message
                : String(subscriptionError),
          });
          this.notifyStateSubscriptions();
        }
      );
    });
  }

  private sendCommand(
    type: Exclude<WorkerMessage["type"], "UNSUBSCRIBE" | "DISCONNECT">,
    data?: unknown
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.port) {
        reject(new Error("Worker port is not available"));
        return;
      }

      const commandId = crypto.randomUUID();
      const topic =
        data && typeof data === "object" && "topic" in data
          ? String((data as { topic?: unknown }).topic)
          : undefined;

      const timeout = setTimeout(() => {
        this.pendingCommands.delete(commandId);
        reject(new Error(`Command timeout: ${type} (${commandId})`));
      }, this.COMMAND_TIMEOUT);

      this.pendingCommands.set(commandId, { resolve, reject, timeout, type, topic });

      this.port.postMessage({
        type,
        data,
        commandId,
      } as WorkerMessage);
    });
  }

  private resolveCommand(commandId: string, value?: unknown): void {
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingCommands.delete(commandId);
      pending.resolve(value);
    }
  }

  private rejectCommand(commandId: string, error: unknown): void {
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingCommands.delete(commandId);
      pending.reject(error);
    }
  }

  storeSubscribe = (listener: () => void) => {
    this.stateSubscriptions.add(listener);
    return () => this.stateSubscriptions.delete(listener);
  };

  private notifyStateSubscriptions(): void {
    this.snapshotVersion += 1;
    this.cachedSnapshot = null;
    this.stateSubscriptions.forEach((listener) => listener());
  }

  getSnapshot(): {
    connection: SocketConnectionStatus;
    isConnected: boolean;
    topicReadiness: ReadonlyMap<string, { status: SocketSubscriptionStatus; error?: string }>;
  } {
    if (this.cachedSnapshot && this.cachedSnapshot.version === this.snapshotVersion) {
      return this.cachedSnapshot.value;
    }

    const snapshot = {
      connection: { ...this.connectionStatus },
      isConnected: this.connectionStatus.isConnected,
      topicReadiness: new Map(this.topicReadiness),
    };

    this.cachedSnapshot = {
      version: this.snapshotVersion,
      value: snapshot,
    };

    return snapshot;
  }

  private handleWorkerResponse(
    type: WorkerResponseType,
    data: unknown,
    error: unknown,
    commandId?: string
  ) {
    switch (type) {
      case "CONNECTED":
        this.updateConnectionStatus({ phase: "connected", isConnected: true });
        if (commandId) {
          this.resolveCommand(commandId, undefined);
        }
        this.flushPendingSubscriptions();
        break;
      case "CONNECTION_STATE":
        this.applyConnectionState(data);
        if (commandId && this.connectionStatus.isConnected) {
          this.resolveCommand(commandId, data);
        }
        break;
      case "SUBSCRIBED":
        this.applySubscribedState(data, commandId);
        break;
      case "SUBSCRIPTION_STATE":
        this.applySubscriptionState(data as WorkerSubscriptionStatePayload, commandId);
        break;
      case "PUBLISHED":
        this.applyPublishedState(data as WorkerPublishedPayload, commandId);
        break;
      case "RETRYING":
        break;
      case "MESSAGE":
        this.dispatchMessage(data);
        break;
      case "ERROR":
        if (commandId) {
          this.rejectCommand(commandId, error || new Error("Unknown error"));
        } else {
          this.updateConnectionStatus({
            phase: "failed",
            isConnected: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
        break;
      default:
        break;
    }
  }

  private applyConnectionState(data: unknown) {
    const payload = data as {
      phase?: SocketConnectionPhase;
      isConnected?: boolean;
      error?: string;
    };
    this.updateConnectionStatus({
      phase: payload.phase ?? "failed",
      isConnected: Boolean(payload.isConnected),
      ...(payload.error ? { error: payload.error } : {}),
    });
    if (payload.phase === "connected") {
      this.flushPendingSubscriptions();
    }
  }

  private applySubscribedState(data: unknown, commandId?: string) {
    const payload = data as { topic?: string };
    if (!payload?.topic) {
      return;
    }
    this.topicReadiness.set(payload.topic, { status: "subscribed" });
    this.notifyStateSubscriptions();
    if (commandId) {
      this.resolveCommand(commandId, payload);
    }
  }

  private applySubscriptionState(
    data: WorkerSubscriptionStatePayload,
    commandId?: string
  ) {
    if (!data?.topic) {
      return;
    }
    this.topicReadiness.set(data.topic, {
      status: data.status,
      ...(data.error ? { error: data.error } : {}),
    });
    this.notifyStateSubscriptions();
    if (commandId && data.status === "subscribed") {
      this.resolveCommand(commandId, data);
    }
    if (commandId && data.status === "error") {
      this.rejectCommand(commandId, new Error(data.error || "Subscription failed"));
    }
  }

  private applyPublishedState(data: WorkerPublishedPayload, commandId?: string) {
    if (!commandId) {
      return;
    }
    if (data.status === "published") {
      this.resolveCommand(commandId, data);
      return;
    }
    this.rejectCommand(commandId, new Error(data.error || "Publish failed"));
  }

  private dispatchMessage(data: unknown) {
    const payload = data as {
      topic: string;
      message: unknown;
    };
    const callbacks = this.subscriptions.get(payload.topic);
    if (!callbacks || callbacks.size === 0) {
      return;
    }
    callbacks.forEach((callback) => {
      try {
        callback(payload.message);
      } catch (callbackError) {
        console.error("Socket subscription callback error", callbackError);
      }
    });
  }

  private updateConnectionStatus(next: SocketConnectionStatus): void {
    this.connectionStatus = next;
    this.notifyStateSubscriptions();
  }
}

export const sharedSocketManager = SharedSocketManager.getInstance();
